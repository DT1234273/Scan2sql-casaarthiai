import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  getDocFromServer,
  serverTimestamp,
} from 'firebase/firestore';
import type { NoSQLBillRecord, SavedDocumentRecord } from './App';
import {
  DEFAULT_CLIENT_ID,
  DEFAULT_CA_CLIENT,
  DEFAULT_TALLY_SETTINGS,
  type CAClientProfile,
  type TallySettings,
  type TeamMemberRecord,
  type UserApiKeyRecord,
  type FirmRole,
  type BillApprovalStatus,
} from './caWorkspaceTypes';

interface FirebaseAppletConfigShape {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}

const appletConfigModules = import.meta.glob<{ default?: FirebaseAppletConfigShape }>(
  '../firebase-applet-config.json',
  { eager: true }
);
const rawAppletModule = Object.values(appletConfigModules)[0];
const firebaseAppletConfig: FirebaseAppletConfigShape =
  rawAppletModule?.default ?? (rawAppletModule as unknown as FirebaseAppletConfigShape) ?? {};

const env = ((import.meta as unknown as { env?: Record<string, string | undefined> }).env) || {};

function pickEnvOrConfig(envVal: string | undefined, configVal: string | undefined): string {
  const trimmed = (envVal || '').trim();
  return trimmed.length > 0 ? trimmed : (configVal || '');
}

const resolvedFirebaseConfig = {
  apiKey: pickEnvOrConfig(env.VITE_FIREBASE_API_KEY, firebaseAppletConfig.apiKey),
  authDomain: pickEnvOrConfig(env.VITE_FIREBASE_AUTH_DOMAIN, firebaseAppletConfig.authDomain),
  projectId: pickEnvOrConfig(env.VITE_FIREBASE_PROJECT_ID, firebaseAppletConfig.projectId),
  storageBucket: pickEnvOrConfig(
    env.VITE_FIREBASE_STORAGE_BUCKET,
    firebaseAppletConfig.storageBucket
  ),
  messagingSenderId: pickEnvOrConfig(
    env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppletConfig.messagingSenderId
  ),
  appId: pickEnvOrConfig(env.VITE_FIREBASE_APP_ID, firebaseAppletConfig.appId),
};

const resolvedDatabaseId = pickEnvOrConfig(
  env.VITE_FIREBASE_FIRESTORE_DATABASE_ID,
  firebaseAppletConfig.firestoreDatabaseId
);

export const ACTIVE_FIREBASE_PROJECT_ID = resolvedFirebaseConfig.projectId;
export const ACTIVE_FIREBASE_AUTH_DOMAIN = resolvedFirebaseConfig.authDomain;

const app = initializeApp(resolvedFirebaseConfig);
export const auth = getAuth(app);
export const db =
  resolvedDatabaseId && resolvedDatabaseId !== '(default)'
    ? getFirestore(app, resolvedDatabaseId)
    : getFirestore(app);

// Keep verified Google sessions signed in across reloads on both desktop & mobile browsers
setPersistence(auth, browserLocalPersistence).catch(() => {});

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Clean up any legacy localStorage fake-login token left from older builds
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('ledgersutra_live_auth_user_v1');
  } catch {
    // ignore storage access errors
  }
}

export async function signInWithGooglePopup(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutGoogleUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export { onAuthStateChanged };
export type { User };

function isAuthenticatedOwner(userId: string): boolean {
  return Boolean(
    auth.currentUser &&
      auth.currentUser.uid === userId &&
      auth.currentUser.emailVerified === true
  );
}

// Helpers to sanitize strings, numbers, and IDs to strictly match firestore.rules
export function sanitizeId(rawId: string, fallbackPrefix = 'REC'): string {
  const cleaned = String(rawId || '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 120);
  return cleaned.length >= 1 ? cleaned : `${fallbackPrefix}_${Date.now()}`;
}

function clampString(val: unknown, maxLen: number, minLen = 0, fallback = ''): string {
  const str = String(val ?? '').trim();
  if (str.length < minLen) {
    return fallback.slice(0, maxLen);
  }
  return str.slice(0, maxLen);
}

function clampCurrency(val: unknown): number {
  const num = Number(val);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.min(10000000000, Number(num.toFixed(2)));
}

function clampConfidence(val: unknown): number {
  const num = Number(val);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.min(100, Number(num.toFixed(2)));
}

function normalizeFirmRoleForFirestore(role?: string): 'owner' | 'reviewer' | 'staff' {
  const lowered = String(role || '').trim().toLowerCase();
  if (lowered === 'reviewer') return 'reviewer';
  if (lowered === 'staff') return 'staff';
  return 'owner';
}

function normalizeTeamStatusForFirestore(status?: string): 'active' | 'invited' {
  return String(status || '').trim().toLowerCase() === 'active' ? 'active' : 'invited';
}

export async function sha256HexBrowser(raw: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function saveUserProfileToFirestore(
  user: User,
  userMode: 'normal_user' | 'ca_mode',
  selectedColumnKeys: string[],
  tallySettings?: TallySettings,
  activeRole?: FirmRole
): Promise<void> {
  const uid = user.uid;
  if (!isAuthenticatedOwner(uid)) return;

  const path = `users/${uid}`;
  let selectedColumnsJson = '["fileName","billDate","invoiceNumber","shopName","grandTotal"]';
  try {
    const serialized = JSON.stringify(selectedColumnKeys);
    if (serialized.length >= 2 && serialized.length <= 5000) {
      selectedColumnsJson = serialized;
    }
  } catch {
    // keep default
  }

  let tallySettingsJson = JSON.stringify(DEFAULT_TALLY_SETTINGS);
  if (tallySettings) {
    try {
      const serialized = JSON.stringify(tallySettings);
      if (serialized.length >= 2 && serialized.length <= 5000) {
        tallySettingsJson = serialized;
      }
    } catch {
      // keep default
    }
  }

  const normalizedFirmRole = normalizeFirmRoleForFirestore(activeRole);

  const payload = {
    uid,
    email: clampString(user.email, 200, 3, 'user@casaarthiai.in'),
    displayName: clampString(
      user.displayName || user.email?.split('@')[0],
      150,
      1,
      'CA Saarthi AI User'
    ),
    photoURL: clampString(user.photoURL, 1000, 0, ''),
    userMode: userMode === 'ca_mode' ? 'ca_mode' : 'normal_user',
    firmRole: normalizedFirmRole,
    selectedColumnsJson,
    tallySettingsJson,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', uid), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ---------------------------------------------------------------------------
// Client-Wise Workspace CRUD (/users/{uid}/clients/{clientId})
// ---------------------------------------------------------------------------
export async function saveClientToFirestore(
  userId: string,
  client: CAClientProfile
): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;
  const clientId = sanitizeId(client.id || DEFAULT_CLIENT_ID, 'CLI');
  const path = `users/${uid}/clients/${clientId}`;

  const payload = {
    id: clientId,
    ownerId: uid,
    name: clampString(client.name, 200, 1, 'Default Client'),
    gstin: clampString(client.gstin, 30, 0, ''),
    pan: clampString(client.pan, 20, 0, ''),
    financialYear: clampString(client.financialYear, 20, 4, '2026-27'),
    notes: clampString(client.notes, 2000, 0, ''),
    archived: Boolean(client.archived),
    createdAt: clampString(
      client.createdAt,
      40,
      1,
      new Date().toISOString().slice(0, 16).replace('T', ' ')
    ),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', uid, 'clients', clientId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteClientFromFirestore(
  userId: string,
  rawClientId: string
): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;
  const clientId = sanitizeId(rawClientId, 'CLI');

  try {
    const billsSnap = await getDocs(
      query(
        collection(db, 'users', uid, 'clients', clientId, 'bills'),
        where('ownerId', '==', uid)
      )
    );
    for (const bDoc of billsSnap.docs) {
      await deleteDoc(bDoc.ref);
    }
    const docsSnap = await getDocs(
      query(
        collection(db, 'users', uid, 'clients', clientId, 'documents'),
        where('ownerId', '==', uid)
      )
    );
    for (const dDoc of docsSnap.docs) {
      await deleteDoc(dDoc.ref);
    }
    await deleteDoc(doc(db, 'users', uid, 'clients', clientId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}/clients/${clientId}`);
  }
}

// ---------------------------------------------------------------------------
// Client-Scoped Bill & Document Persistence
// Path: /users/{uid}/clients/{clientId}/bills/{billId}
// ---------------------------------------------------------------------------
function buildBillFirestorePayload(uid: string, clientId: string, bill: NoSQLBillRecord) {
  const billId = sanitizeId(bill.id, 'BILL');
  const billAny = bill as unknown as Record<string, unknown>;
  const extraWithAudit = {
    ...(bill.extraHeaderFields || {}),
    clientId,
    approvalStatus: String(
      billAny.approvalStatus || bill.extraHeaderFields?.approvalStatus || 'approved'
    ),
    rejectionReason: String(
      billAny.rejectionReason || bill.extraHeaderFields?.rejectionReason || ''
    ),
    auditTrailJson:
      typeof billAny.auditTrail === 'object'
        ? JSON.stringify(billAny.auditTrail)
        : bill.extraHeaderFields?.auditTrailJson || '[]',
  };

  let extraHeaderFieldsJson = '{}';
  try {
    const str = JSON.stringify(extraWithAudit);
    if (str.length >= 2 && str.length <= 10000) {
      extraHeaderFieldsJson = str;
    }
  } catch {
    extraHeaderFieldsJson = '{}';
  }

  let itemsJson = '[]';
  try {
    const str = JSON.stringify(Array.isArray(bill.items) ? bill.items.slice(0, 100) : []);
    if (str.length >= 2 && str.length <= 100000) {
      itemsJson = str;
    }
  } catch {
    itemsJson = '[]';
  }

  const approvalStatusRaw = String(
    billAny.approvalStatus || extraWithAudit.approvalStatus || 'approved'
  );
  const approvalStatus: BillApprovalStatus =
    approvalStatusRaw === 'draft' ||
    approvalStatusRaw === 'pending_review' ||
    approvalStatusRaw === 'rejected'
      ? approvalStatusRaw
      : 'approved';

  return {
    billId,
    payload: {
      id: billId,
      ownerId: uid,
      clientId: clampString(clientId, 120, 1, DEFAULT_CLIENT_ID),
      approvalStatus,
      fileName: clampString(bill.fileName, 250, 1, 'Uploaded_Bill.pdf'),
      shopName: clampString(bill.shopName, 250, 1, 'Vendor / Shop'),
      sellerGstin: clampString(bill.sellerGstin, 30, 0, ''),
      buyerName: clampString(bill.buyerName, 250, 0, ''),
      buyerGstin: clampString(bill.buyerGstin, 30, 0, ''),
      invoiceNumber: clampString(bill.invoiceNumber, 120, 1, 'INV-001'),
      billDate: clampString(bill.billDate, 40, 1, new Date().toISOString().slice(0, 10)),
      placeOfSupply: clampString(bill.placeOfSupply, 120, 0, ''),
      voucherType: clampString(bill.voucherType, 80, 1, 'Tax Invoice'),
      paymentMode: clampString(bill.paymentMode, 80, 1, 'Cash / UPI'),
      subtotal: clampCurrency(bill.subtotal),
      cgstAmount: clampCurrency(bill.cgstAmount),
      sgstAmount: clampCurrency(bill.sgstAmount),
      igstAmount: clampCurrency(bill.igstAmount),
      taxAmount: clampCurrency(bill.taxAmount),
      discountAmount: clampCurrency(bill.discountAmount),
      grandTotal: clampCurrency(bill.grandTotal),
      confidence: clampConfidence(bill.confidence),
      rawText: clampString(bill.rawText, 50000, 0, ''),
      createdAt: clampString(
        bill.createdAt,
        40,
        1,
        new Date().toISOString().slice(0, 16).replace('T', ' ')
      ),
      extraHeaderFieldsJson,
      itemsJson,
      syncedAt: serverTimestamp(),
    },
  };
}

export async function saveBillToUserAccount(
  userId: string,
  bill: NoSQLBillRecord,
  rawClientId = DEFAULT_CLIENT_ID
): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;
  const billAny = bill as unknown as Record<string, unknown>;
  const clientId = sanitizeId(
    String(billAny.clientId || bill.extraHeaderFields?.clientId || rawClientId),
    'CLI'
  );
  const { billId, payload } = buildBillFirestorePayload(uid, clientId, bill);
  const clientPath = `users/${uid}/clients/${clientId}/bills/${billId}`;

  try {
    await setDoc(doc(db, 'users', uid, 'clients', clientId, 'bills', billId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, clientPath);
  }
}

export async function deleteBillFromUserAccount(
  userId: string,
  rawBillId: string,
  rawClientId = DEFAULT_CLIENT_ID
): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;
  const billId = sanitizeId(rawBillId, 'BILL');
  const clientId = sanitizeId(rawClientId, 'CLI');

  try {
    await deleteDoc(doc(db, 'users', uid, 'clients', clientId, 'bills', billId));
    await deleteDoc(doc(db, 'users', uid, 'bills', billId)).catch(() => {});
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `users/${uid}/clients/${clientId}/bills/${billId}`
    );
  }
}

export async function saveDocumentToUserAccount(
  userId: string,
  docRecord: SavedDocumentRecord,
  rawClientId = DEFAULT_CLIENT_ID
): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;
  const docId = sanitizeId(docRecord.id, 'DOC');
  const docAny = docRecord as unknown as Record<string, unknown>;
  const clientId = sanitizeId(String(docAny.clientId || rawClientId), 'CLI');
  const path = `users/${uid}/clients/${clientId}/documents/${docId}`;

  const rawPageCount = Math.round(Number(docRecord.pageCount) || 1);
  const pageCount = Math.max(1, Math.min(500, rawPageCount));

  const payload = {
    id: docId,
    ownerId: uid,
    clientId,
    fileName: clampString(docRecord.fileName, 250, 1, 'Document.pdf'),
    fileType: clampString(docRecord.fileType, 40, 1, 'PDF'),
    docType: docRecord.docType === 'NORMAL_DOCUMENT' ? 'NORMAL_DOCUMENT' : 'SHOP_BILL',
    pageCount,
    ocrLanguage: clampString(docRecord.ocrLanguage, 30, 1, 'eng+hin'),
    extractedText: clampString(docRecord.extractedText, 50000, 0, ''),
    confidence: clampConfidence(docRecord.confidence),
    createdAt: clampString(
      docRecord.createdAt,
      40,
      1,
      new Date().toISOString().slice(0, 16).replace('T', ' ')
    ),
    syncedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', uid, 'clients', clientId, 'documents', docId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteDocumentFromUserAccount(
  userId: string,
  rawDocId: string,
  rawClientId = DEFAULT_CLIENT_ID
): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;
  const docId = sanitizeId(rawDocId, 'DOC');
  const clientId = sanitizeId(rawClientId, 'CLI');

  try {
    await deleteDoc(doc(db, 'users', uid, 'clients', clientId, 'documents', docId));
    await deleteDoc(doc(db, 'users', uid, 'documents', docId)).catch(() => {});
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `users/${uid}/clients/${clientId}/documents/${docId}`
    );
  }
}

// ---------------------------------------------------------------------------
// Team Members & API Keys Persistence in Firestore
// ---------------------------------------------------------------------------
export async function saveTeamMemberToFirestore(
  userId: string,
  member: TeamMemberRecord
): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;
  const memberId = sanitizeId(member.id, 'MEM');
  const path = `users/${uid}/teamMembers/${memberId}`;

  const payload = {
    id: memberId,
    ownerId: uid,
    email: clampString(member.email.toLowerCase(), 200, 3, 'staff@firm.in'),
    name: clampString(member.name, 150, 1, 'Team Member'),
    role: normalizeFirmRoleForFirestore(member.role),
    assignedClientsJson: clampString(
      JSON.stringify(member.assignedClientIds || [DEFAULT_CLIENT_ID]),
      4000,
      2,
      '[]'
    ),
    status: normalizeTeamStatusForFirestore(member.status),
    invitedAt: clampString(
      member.invitedAt,
      40,
      1,
      new Date().toISOString().slice(0, 16).replace('T', ' ')
    ),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', uid, 'teamMembers', memberId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTeamMemberFromFirestore(
  userId: string,
  rawMemberId: string
): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;
  const memberId = sanitizeId(rawMemberId, 'MEM');

  try {
    await deleteDoc(doc(db, 'users', uid, 'teamMembers', memberId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}/teamMembers/${memberId}`);
  }
}

export async function saveTallySettingsToFirestore(
  userId: string,
  tallySettings: TallySettings
): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;
  const path = `users/${uid}`;
  let tallySettingsJson = JSON.stringify(DEFAULT_TALLY_SETTINGS);
  try {
    const serialized = JSON.stringify(tallySettings);
    if (serialized.length >= 2 && serialized.length <= 5000) {
      tallySettingsJson = serialized;
    }
  } catch {
    // keep default
  }

  const cur = auth.currentUser;
  let existing: Record<string, unknown> = {};
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      existing = snap.data() as Record<string, unknown>;
    }
  } catch {
    // proceed with safe defaults
  }

  const resolvedUserMode = existing.userMode === 'normal_user' ? 'normal_user' : 'ca_mode';
  const resolvedFirmRole = normalizeFirmRoleForFirestore(String(existing.firmRole || 'owner'));
  const resolvedSelectedColumnsJson =
    typeof existing.selectedColumnsJson === 'string' &&
    existing.selectedColumnsJson.length >= 2 &&
    existing.selectedColumnsJson.length <= 5000
      ? existing.selectedColumnsJson
      : '["fileName","billDate","invoiceNumber","shopName","grandTotal"]';

  const payload = {
    uid,
    email: clampString(cur?.email || existing.email, 200, 3, 'user@casaarthiai.in'),
    displayName: clampString(
      cur?.displayName || existing.displayName || cur?.email?.split('@')[0],
      150,
      1,
      'CA Saarthi AI User'
    ),
    photoURL: clampString(cur?.photoURL || existing.photoURL, 1000, 0, ''),
    userMode: resolvedUserMode,
    firmRole: resolvedFirmRole,
    selectedColumnsJson: resolvedSelectedColumnsJson,
    tallySettingsJson,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', uid), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveApiKeyToFirestore(
  userId: string,
  apiKeyRecord: UserApiKeyRecord
): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;
  const keyId = sanitizeId(apiKeyRecord.id, 'KEY');
  const path = `users/${uid}/apiKeys/${keyId}`;

  const payload = {
    id: keyId,
    ownerId: uid,
    label: clampString(apiKeyRecord.label || apiKeyRecord.name, 120, 1, 'API Key'),
    keyPrefix: clampString(apiKeyRecord.keyPrefix, 24, 4, 'ls_live_'),
    keyHash: clampString(apiKeyRecord.keyHash, 128, 32, ''),
    revoked: Boolean(apiKeyRecord.revoked),
    createdAt: clampString(
      apiKeyRecord.createdAt,
      40,
      1,
      new Date().toISOString().slice(0, 16).replace('T', ' ')
    ),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', uid, 'apiKeys', keyId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function createAndSaveApiKeyToFirestore(
  userId: string,
  label: string
): Promise<{ rawKey: string; record: UserApiKeyRecord }> {
  const uid = userId;
  const randomBytes = new Uint8Array(18);
  crypto.getRandomValues(randomBytes);
  const tokenHex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const rawKey = `ls_live_${tokenHex}`;
  const keyHash = await sha256HexBrowser(rawKey);
  const keyPrefix = rawKey.slice(0, 14);
  const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const record: UserApiKeyRecord = {
    id: `KEY_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    ownerId: uid,
    label: label.trim() || 'CA Saarthi AI API Key',
    name: label.trim() || 'CA Saarthi AI API Key',
    keyPrefix,
    keyHash,
    createdAt: nowStr,
    revoked: false,
    status: 'active',
  };

  await saveApiKeyToFirestore(uid, record);
  fetch('/api/v1/keys/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      keyHash,
      keyPrefix,
      label: record.label,
      ownerUid: uid,
    }),
  }).catch(() => {});

  return { rawKey, record };
}

export async function revokeApiKeyInFirestore(
  userId: string,
  rawKeyId: string,
  keyHash?: string
): Promise<void> {
  const keyId = sanitizeId(rawKeyId, 'KEY');
  if (keyHash) {
    fetch('/api/v1/keys/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyHash }),
    }).catch(() => {});
  }
  await deleteApiKeyFromFirestore(userId, keyId);
}

export async function deleteApiKeyFromFirestore(
  userId: string,
  rawKeyId: string
): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;
  const keyId = sanitizeId(rawKeyId, 'KEY');

  try {
    await deleteDoc(doc(db, 'users', uid, 'apiKeys', keyId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}/apiKeys/${keyId}`);
  }
}

// ---------------------------------------------------------------------------
// Delete All User Account Data ("Delete my data")
// ---------------------------------------------------------------------------
export async function deleteEntireUserAccountDataFromFirestore(userId: string): Promise<void> {
  if (!isAuthenticatedOwner(userId)) return;

  const uid = userId;

  try {
    // 1. Delete all clients and nested bills/documents
    const clientsSnap = await getDocs(
      query(collection(db, 'users', uid, 'clients'), where('ownerId', '==', uid))
    );
    for (const cDoc of clientsSnap.docs) {
      await deleteClientFromFirestore(uid, cDoc.id);
    }
    // 2. Delete legacy root bills & documents
    const legacyBills = await getDocs(
      query(collection(db, 'users', uid, 'bills'), where('ownerId', '==', uid))
    );
    for (const bDoc of legacyBills.docs) {
      await deleteDoc(bDoc.ref);
    }
    const legacyDocs = await getDocs(
      query(collection(db, 'users', uid, 'documents'), where('ownerId', '==', uid))
    );
    for (const dDoc of legacyDocs.docs) {
      await deleteDoc(dDoc.ref);
    }
    // 3. Delete team members & API keys
    const teamSnap = await getDocs(
      query(collection(db, 'users', uid, 'teamMembers'), where('ownerId', '==', uid))
    );
    for (const mDoc of teamSnap.docs) {
      await deleteDoc(mDoc.ref);
    }
    const keysSnap = await getDocs(
      query(collection(db, 'users', uid, 'apiKeys'), where('ownerId', '==', uid))
    );
    for (const kDoc of keysSnap.docs) {
      await deleteDoc(kDoc.ref);
    }
    // 4. Delete user profile document
    await deleteDoc(doc(db, 'users', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}`);
  }
}

function parseBillSnapshotDoc(docId: string, d: Record<string, unknown>): NoSQLBillRecord {
  let extraHeaderFields: Record<string, string> = {};
  if (typeof d.extraHeaderFieldsJson === 'string') {
    try {
      const parsed = JSON.parse(d.extraHeaderFieldsJson);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        extraHeaderFields = parsed as Record<string, string>;
      }
    } catch {
      // ignore
    }
  } else if (d.extraHeaderFields && typeof d.extraHeaderFields === 'object') {
    extraHeaderFields = { ...(d.extraHeaderFields as Record<string, string>) };
  }
  if (d.clientId && !extraHeaderFields.clientId) {
    extraHeaderFields.clientId = String(d.clientId);
  }
  if (d.approvalStatus && !extraHeaderFields.approvalStatus) {
    extraHeaderFields.approvalStatus = String(d.approvalStatus);
  }

  let items: NoSQLBillRecord['items'] = [];
  if (typeof d.itemsJson === 'string') {
    try {
      const parsed = JSON.parse(d.itemsJson);
      if (Array.isArray(parsed)) {
        items = parsed as NoSQLBillRecord['items'];
      }
    } catch {
      // ignore
    }
  } else if (Array.isArray(d.items)) {
    items = d.items as NoSQLBillRecord['items'];
  }

  return {
    id: String(d.id || docId),
    fileName: String(d.fileName || 'Uploaded_Bill.pdf'),
    shopName: String(d.shopName || 'Vendor'),
    sellerGstin: String(d.sellerGstin || ''),
    buyerName: String(d.buyerName || ''),
    buyerGstin: String(d.buyerGstin || ''),
    invoiceNumber: String(d.invoiceNumber || ''),
    billDate: String(d.billDate || ''),
    placeOfSupply: String(d.placeOfSupply || ''),
    voucherType: String(d.voucherType || 'Tax Invoice'),
    paymentMode: String(d.paymentMode || 'Cash / UPI'),
    subtotal: Number(d.subtotal) || 0,
    cgstAmount: Number(d.cgstAmount) || 0,
    sgstAmount: Number(d.sgstAmount) || 0,
    igstAmount: Number(d.igstAmount) || 0,
    taxAmount: Number(d.taxAmount) || 0,
    discountAmount: Number(d.discountAmount) || 0,
    grandTotal: Number(d.grandTotal) || 0,
    confidence: Number(d.confidence) || 100,
    rawText: String(d.rawText || ''),
    createdAt: String(d.createdAt || ''),
    extraHeaderFields,
    items,
  };
}

export function subscribeToUserAccountHistory(
  userId: string,
  activeClientId: string,
  callbacks: {
    onBillsUpdate: (bills: NoSQLBillRecord[]) => void;
    onDocumentsUpdate: (docs: SavedDocumentRecord[]) => void;
    onClientsUpdate?: (clients: CAClientProfile[]) => void;
    onTeamMembersUpdate?: (members: TeamMemberRecord[]) => void;
    onApiKeysUpdate?: (keys: UserApiKeyRecord[]) => void;
    onTallySettingsUpdate?: (settings: TallySettings) => void;
    onProfileUpdate?: (profile: {
      userMode?: 'normal_user' | 'ca_mode';
      firmRole?: FirmRole;
      selectedColumnKeys?: string[];
      tallySettings?: TallySettings;
    }) => void;
  }
): () => void {
  if (!isAuthenticatedOwner(userId)) {
    return () => {};
  }

  const uid = userId;
  const clientId = sanitizeId(activeClientId || DEFAULT_CLIENT_ID, 'CLI');

  // Auto-migrate legacy root /users/{uid}/bills into /users/{uid}/clients/client_default/bills once
  if (clientId === DEFAULT_CLIENT_ID) {
    getDocs(query(collection(db, 'users', uid, 'bills'), where('ownerId', '==', uid)))
      .then(async (legacySnap) => {
        if (!legacySnap.empty) {
          await saveClientToFirestore(uid, { ...DEFAULT_CA_CLIENT, ownerId: uid });
          for (const docSnap of legacySnap.docs) {
            const billObj = parseBillSnapshotDoc(
              docSnap.id,
              docSnap.data() as Record<string, unknown>
            );
            await saveBillToUserAccount(uid, billObj, DEFAULT_CLIENT_ID);
          }
        }
      })
      .catch(() => {});
  }

  const unsubProfile = onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      let parsedCols: string[] | undefined;
      if (typeof data.selectedColumnsJson === 'string') {
        try {
          const arr = JSON.parse(data.selectedColumnsJson);
          if (Array.isArray(arr) && arr.length > 0) {
            parsedCols = arr.map((k: unknown) => String(k));
          }
        } catch {
          // ignore
        }
      }
      let parsedTally: TallySettings | undefined;
      if (typeof data.tallySettingsJson === 'string') {
        try {
          const obj = JSON.parse(data.tallySettingsJson);
          if (obj && typeof obj === 'object') {
            parsedTally = { ...DEFAULT_TALLY_SETTINGS, ...obj };
          }
        } catch {
          // ignore
        }
      }
      if (parsedTally && callbacks.onTallySettingsUpdate) {
        callbacks.onTallySettingsUpdate(parsedTally);
      }
      if (callbacks.onProfileUpdate) {
        callbacks.onProfileUpdate({
          userMode:
            data.userMode === 'ca_mode'
              ? 'ca_mode'
              : data.userMode === 'normal_user'
              ? 'normal_user'
              : undefined,
          firmRole:
            data.firmRole === 'reviewer'
              ? 'Reviewer'
              : data.firmRole === 'staff'
              ? 'Staff'
              : 'Owner/CA',
          selectedColumnKeys: parsedCols,
          tallySettings: parsedTally,
        });
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${uid}`);
    }
  );

  const unsubClients = onSnapshot(
    query(collection(db, 'users', uid, 'clients'), where('ownerId', '==', uid)),
    (snap) => {
      if (!callbacks.onClientsUpdate) return;
      const list: CAClientProfile[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: String(d.id || docSnap.id),
          ownerId: String(d.ownerId || uid),
          name: String(d.name || 'Client'),
          gstin: String(d.gstin || ''),
          pan: String(d.pan || ''),
          financialYear: String(d.financialYear || '2026-27'),
          notes: String(d.notes || ''),
          archived: Boolean(d.archived),
          createdAt: String(d.createdAt || ''),
        });
      });
      if (list.length === 0) {
        const defaultClient = { ...DEFAULT_CA_CLIENT, ownerId: uid };
        saveClientToFirestore(uid, defaultClient).catch(() => {});
        list.push(defaultClient);
      }
      callbacks.onClientsUpdate(list);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uid}/clients`);
    }
  );

  const unsubBills = onSnapshot(
    query(
      collection(db, 'users', uid, 'clients', clientId, 'bills'),
      where('ownerId', '==', uid)
    ),
    (snap) => {
      const bills: NoSQLBillRecord[] = [];
      snap.forEach((docSnap) => {
        bills.push(parseBillSnapshotDoc(docSnap.id, docSnap.data() as Record<string, unknown>));
      });
      bills.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
      callbacks.onBillsUpdate(bills);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uid}/clients/${clientId}/bills`);
    }
  );

  const unsubDocs = onSnapshot(
    query(
      collection(db, 'users', uid, 'clients', clientId, 'documents'),
      where('ownerId', '==', uid)
    ),
    (snap) => {
      const docs: SavedDocumentRecord[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        docs.push({
          id: String(d.id || docSnap.id),
          fileName: String(d.fileName || 'Document.pdf'),
          fileType: String(d.fileType || 'PDF'),
          docType: d.docType === 'NORMAL_DOCUMENT' ? 'NORMAL_DOCUMENT' : 'SHOP_BILL',
          pageCount: Number(d.pageCount) || 1,
          ocrLanguage: String(d.ocrLanguage || 'eng+hin'),
          extractedText: String(d.extractedText || ''),
          confidence: Number(d.confidence) || 100,
          createdAt: String(d.createdAt || ''),
        });
      });
      docs.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
      callbacks.onDocumentsUpdate(docs);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uid}/clients/${clientId}/documents`);
    }
  );

  const unsubTeam = onSnapshot(
    query(collection(db, 'users', uid, 'teamMembers'), where('ownerId', '==', uid)),
    (snap) => {
      if (!callbacks.onTeamMembersUpdate) return;
      const members: TeamMemberRecord[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        let assignedClientIds = [DEFAULT_CLIENT_ID];
        if (typeof d.assignedClientsJson === 'string') {
          try {
            const arr = JSON.parse(d.assignedClientsJson);
            if (Array.isArray(arr)) assignedClientIds = arr.map(String);
          } catch {
            // ignore
          }
        }
        members.push({
          id: String(d.id || docSnap.id),
          ownerId: String(d.ownerId || uid),
          email: String(d.email || ''),
          name: String(d.name || ''),
          role:
            d.role === 'owner' || d.role === 'Owner/CA'
              ? 'Owner/CA'
              : d.role === 'reviewer' || d.role === 'Reviewer'
              ? 'Reviewer'
              : 'Staff',
          assignedClientIds,
          invitedAt: String(d.invitedAt || ''),
          status: d.status === 'active' || d.status === 'Active' ? 'Active' : 'Invited',
        });
      });
      callbacks.onTeamMembersUpdate(members);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uid}/teamMembers`);
    }
  );

  const unsubKeys = onSnapshot(
    query(collection(db, 'users', uid, 'apiKeys'), where('ownerId', '==', uid)),
    (snap) => {
      if (!callbacks.onApiKeysUpdate) return;
      const keys: UserApiKeyRecord[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        const revoked = Boolean(d.revoked);
        const label = String(d.label || 'API Key');
        keys.push({
          id: String(d.id || docSnap.id),
          ownerId: String(d.ownerId || uid),
          label,
          name: label,
          keyPrefix: String(d.keyPrefix || 'ls_live_'),
          keyHash: String(d.keyHash || ''),
          revoked,
          status: revoked ? 'revoked' : 'active',
          createdAt: String(d.createdAt || ''),
        });
      });
      callbacks.onApiKeysUpdate(keys);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uid}/apiKeys`);
    }
  );

  return () => {
    unsubProfile();
    unsubClients();
    unsubBills();
    unsubDocs();
    unsubTeam();
    unsubKeys();
  };
}
