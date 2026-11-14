import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
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

// Direct embedded Firebase configuration (works immediately without .env or external JSON files)
const DIRECT_FIREBASE_CONFIG = {
  projectId: 'gen-lang-client-0134509229',
  appId: '1:794445351838:web:a64527ee4ad0f9c396a48f',
  apiKey: 'AIzaSyDgv1tSvXsZ7hSEPEEGwHO-WzJ-Ux3ZslU',
  authDomain: 'gen-lang-client-0134509229.firebaseapp.com',
  firestoreDatabaseId: 'ai-studio-scan2sqlintellig-c69d733f-58f1-435a-92f7-1fb8ce0f7833',
  storageBucket: 'gen-lang-client-0134509229.firebasestorage.app',
  messagingSenderId: '794445351838',
};

const env = (import.meta as any).env || {};

const resolvedFirebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || DIRECT_FIREBASE_CONFIG.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || DIRECT_FIREBASE_CONFIG.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || DIRECT_FIREBASE_CONFIG.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || DIRECT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId:
    env.VITE_FIREBASE_MESSAGING_SENDER_ID || DIRECT_FIREBASE_CONFIG.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || DIRECT_FIREBASE_CONFIG.appId,
};

const resolvedDatabaseId =
  env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || DIRECT_FIREBASE_CONFIG.firestoreDatabaseId;

const app = initializeApp(resolvedFirebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, resolvedDatabaseId);

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
): FirestoreErrorInfo {
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
  return errInfo;
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

const LIVE_SESSION_STORAGE_KEY = 'ledgersutra_live_auth_user_v1';
const authListeners = new Set<(user: User | null) => void>();

function notifyAuthListeners(user: User | null) {
  authListeners.forEach((cb) => {
    try {
      cb(user);
    } catch {
      // ignore listener errors
    }
  });
}

export function getSavedLiveSessionUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LIVE_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.uid === 'string' && typeof parsed.email === 'string') {
      return parsed as User;
    }
  } catch {
    // ignore
  }
  return null;
}

export function signInWithLivePracticeAccount(params: {
  email: string;
  displayName?: string;
  firmName?: string;
}): User {
  const cleanEmail = params.email.trim().toLowerCase();
  const emailPrefix = cleanEmail.split('@')[0] || 'ca_user';
  const cleanName =
    (params.displayName || params.firmName || emailPrefix)
      .trim()
      .slice(0, 120) || 'CA Practitioner';
  const deterministicUid = `USR_${cleanEmail.replace(/[^a-z0-9]/g, '_').slice(0, 64)}`;

  const sessionUser: Partial<User> = {
    uid: deterministicUid,
    email: cleanEmail,
    displayName: cleanName,
    emailVerified: true,
    isAnonymous: false,
    photoURL: null,
    providerData: [
      {
        providerId: 'ledgersutra.live',
        uid: cleanEmail,
        displayName: cleanName,
        email: cleanEmail,
        phoneNumber: null,
        photoURL: null,
      },
    ],
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LIVE_SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    } catch {
      // ignore storage errors
    }
  }
  const userObj = sessionUser as User;
  notifyAuthListeners(userObj);
  return userObj;
}

export async function signInWithGooglePopup(): Promise<User> {
  const credential = await signInWithPopup(auth, googleProvider);
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LIVE_SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  notifyAuthListeners(credential.user);
  return credential.user;
}

export async function signOutGoogleUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LIVE_SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  try {
    if (auth.currentUser) {
      await signOut(auth);
    }
  } finally {
    notifyAuthListeners(null);
  }
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  authListeners.add(callback);
  const unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(firebaseUser);
    } else {
      const fallbackUser = getSavedLiveSessionUser();
      callback(fallbackUser);
    }
  });
  return () => {
    authListeners.delete(callback);
    unsubscribeFirebase();
  };
}

export { onAuthStateChanged };
export type { User };

// Local Per-User Account Backup Helpers (ensures live custom domains work even when Firebase Auth domain is restricted)
function getLocalAccountKey(uid: string, collectionKey: string): string {
  return `ledgersutra_acct_${sanitizeId(uid, 'USR')}_${collectionKey}`;
}

function readLocalAccountData<T>(uid: string, collectionKey: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(getLocalAccountKey(uid, collectionKey));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocalAccountData<T>(uid: string, collectionKey: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getLocalAccountKey(uid, collectionKey), JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('ledgersutra-local-account-sync', { detail: { uid } }));
  } catch {
    // ignore quota errors
  }
}

function isFirebaseCloudSessionActive(uid: string): boolean {
  return Boolean(auth.currentUser && sanitizeId(auth.currentUser.uid, 'USR') === sanitizeId(uid, 'USR'));
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
  const uid = sanitizeId(user.uid, 'USR');
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
      // ignore
    }
  }

  // Always save profile to local account store
  writeLocalAccountData(uid, 'profile', {
    uid,
    email: clampString(user.email, 200, 3, 'user@ledgersutra.in'),
    displayName: clampString(user.displayName || user.email?.split('@')[0], 150, 1, 'LedgerSutra User'),
    photoURL: clampString(user.photoURL, 1000, 0, ''),
    userMode: userMode === 'ca_mode' ? 'ca_mode' : 'normal_user',
    firmRole: activeRole === 'reviewer' || activeRole === 'staff' ? activeRole : 'owner',
    selectedColumnsJson,
    tallySettingsJson,
  });

  if (!isFirebaseCloudSessionActive(uid)) {
    return;
  }

  const payload = {
    uid,
    email: clampString(user.email, 200, 3, 'user@ledgersutra.in'),
    displayName: clampString(user.displayName || user.email?.split('@')[0], 150, 1, 'LedgerSutra User'),
    photoURL: clampString(user.photoURL, 1000, 0, ''),
    userMode: userMode === 'ca_mode' ? 'ca_mode' : 'normal_user',
    firmRole: activeRole === 'reviewer' || activeRole === 'staff' ? activeRole : 'owner',
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

const localAccountListeners = new Set<(uid: string) => void>();
function notifyLocalAccountUpdate(uid: string) {
  localAccountListeners.forEach((cb) => {
    try {
      cb(uid);
    } catch {
      // ignore
    }
  });
}

// ---------------------------------------------------------------------------
// PART 3: Client-Wise Workspace CRUD (/users/{uid}/clients/{clientId})
// ---------------------------------------------------------------------------
export async function saveClientToFirestore(
  userId: string,
  client: CAClientProfile
): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  const clientId = sanitizeId(client.id || DEFAULT_CLIENT_ID, 'CLI');
  const path = `users/${uid}/clients/${clientId}`;

  const normalizedClient: CAClientProfile = {
    id: clientId,
    ownerId: uid,
    name: clampString(client.name, 200, 1, 'Default Client'),
    gstin: clampString(client.gstin, 30, 0, ''),
    pan: clampString(client.pan, 20, 0, ''),
    financialYear: clampString(client.financialYear, 20, 4, '2026-27'),
    notes: clampString(client.notes, 2000, 0, ''),
    archived: Boolean(client.archived),
    createdAt: clampString(client.createdAt, 40, 1, new Date().toISOString().slice(0, 16).replace('T', ' ')),
  };

  const existingClients = readLocalAccountData<CAClientProfile[]>(uid, 'clients', []);
  const nextClients = [normalizedClient, ...existingClients.filter((c) => c.id !== clientId)];
  writeLocalAccountData(uid, 'clients', nextClients);
  notifyLocalAccountUpdate(uid);

  if (!isFirebaseCloudSessionActive(uid)) return;

  const payload = {
    ...normalizedClient,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', uid, 'clients', clientId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteClientFromFirestore(userId: string, rawClientId: string): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  const clientId = sanitizeId(rawClientId, 'CLI');

  const existingClients = readLocalAccountData<CAClientProfile[]>(uid, 'clients', []);
  writeLocalAccountData(
    uid,
    'clients',
    existingClients.filter((c) => c.id !== clientId)
  );
  writeLocalAccountData(uid, `bills_${clientId}`, []);
  writeLocalAccountData(uid, `docs_${clientId}`, []);
  notifyLocalAccountUpdate(uid);

  if (!isFirebaseCloudSessionActive(uid)) return;

  try {
    // Delete all client-scoped bills and documents first
    const billsSnap = await getDocs(collection(db, 'users', uid, 'clients', clientId, 'bills'));
    for (const bDoc of billsSnap.docs) {
      await deleteDoc(bDoc.ref);
    }
    const docsSnap = await getDocs(collection(db, 'users', uid, 'clients', clientId, 'documents'));
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
// Also writes to /users/{uid}/bills/{billId} for backward compatibility
// ---------------------------------------------------------------------------
function buildBillFirestorePayload(uid: string, clientId: string, bill: NoSQLBillRecord) {
  const billId = sanitizeId(bill.id, 'BILL');
  const extraWithAudit = {
    ...(bill.extraHeaderFields || {}),
    clientId,
    approvalStatus: String((bill as any).approvalStatus || bill.extraHeaderFields?.approvalStatus || 'approved'),
    rejectionReason: String((bill as any).rejectionReason || bill.extraHeaderFields?.rejectionReason || ''),
    auditTrailJson:
      typeof (bill as any).auditTrail === 'object'
        ? JSON.stringify((bill as any).auditTrail)
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

  const approvalStatusRaw = String((bill as any).approvalStatus || extraWithAudit.approvalStatus || 'approved');
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
      createdAt: clampString(bill.createdAt, 40, 1, new Date().toISOString().slice(0, 16).replace('T', ' ')),
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
  const uid = sanitizeId(userId, 'USR');
  const clientId = sanitizeId((bill as any).clientId || bill.extraHeaderFields?.clientId || rawClientId, 'CLI');
  const { billId, payload } = buildBillFirestorePayload(uid, clientId, bill);
  const clientPath = `users/${uid}/clients/${clientId}/bills/${billId}`;

  const localRecord = parseBillSnapshotDoc(billId, payload);
  const existingBills = readLocalAccountData<NoSQLBillRecord[]>(uid, `bills_${clientId}`, []);
  writeLocalAccountData(uid, `bills_${clientId}`, [
    localRecord,
    ...existingBills.filter((b) => b.id !== billId),
  ]);
  notifyLocalAccountUpdate(uid);

  if (!isFirebaseCloudSessionActive(uid)) return;

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
  const uid = sanitizeId(userId, 'USR');
  const billId = sanitizeId(rawBillId, 'BILL');
  const clientId = sanitizeId(rawClientId, 'CLI');

  const existingBills = readLocalAccountData<NoSQLBillRecord[]>(uid, `bills_${clientId}`, []);
  writeLocalAccountData(
    uid,
    `bills_${clientId}`,
    existingBills.filter((b) => b.id !== billId)
  );
  notifyLocalAccountUpdate(uid);

  if (!isFirebaseCloudSessionActive(uid)) return;

  try {
    await deleteDoc(doc(db, 'users', uid, 'clients', clientId, 'bills', billId));
    // Also clean up legacy root bill if it existed from before migration
    await deleteDoc(doc(db, 'users', uid, 'bills', billId)).catch(() => {});
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}/clients/${clientId}/bills/${billId}`);
  }
}

export async function saveDocumentToUserAccount(
  userId: string,
  docRecord: SavedDocumentRecord,
  rawClientId = DEFAULT_CLIENT_ID
): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  const docId = sanitizeId(docRecord.id, 'DOC');
  const clientId = sanitizeId((docRecord as any).clientId || rawClientId, 'CLI');
  const path = `users/${uid}/clients/${clientId}/documents/${docId}`;

  const rawPageCount = Math.round(Number(docRecord.pageCount) || 1);
  const pageCount = Math.max(1, Math.min(500, rawPageCount));

  const localDoc: SavedDocumentRecord = {
    id: docId,
    fileName: clampString(docRecord.fileName, 250, 1, 'Document.pdf'),
    fileType: clampString(docRecord.fileType, 40, 1, 'PDF'),
    docType: docRecord.docType === 'NORMAL_DOCUMENT' ? 'NORMAL_DOCUMENT' : 'SHOP_BILL',
    pageCount,
    ocrLanguage: clampString(docRecord.ocrLanguage, 30, 1, 'eng+hin'),
    extractedText: clampString(docRecord.extractedText, 50000, 0, ''),
    confidence: clampConfidence(docRecord.confidence),
    createdAt: clampString(docRecord.createdAt, 40, 1, new Date().toISOString().slice(0, 16).replace('T', ' ')),
  };

  const existingDocs = readLocalAccountData<SavedDocumentRecord[]>(uid, `docs_${clientId}`, []);
  writeLocalAccountData(uid, `docs_${clientId}`, [
    localDoc,
    ...existingDocs.filter((d) => d.id !== docId),
  ]);
  notifyLocalAccountUpdate(uid);

  if (!isFirebaseCloudSessionActive(uid)) return;

  const payload = {
    ...localDoc,
    ownerId: uid,
    clientId,
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
  const uid = sanitizeId(userId, 'USR');
  const docId = sanitizeId(rawDocId, 'DOC');
  const clientId = sanitizeId(rawClientId, 'CLI');

  const existingDocs = readLocalAccountData<SavedDocumentRecord[]>(uid, `docs_${clientId}`, []);
  writeLocalAccountData(
    uid,
    `docs_${clientId}`,
    existingDocs.filter((d) => d.id !== docId)
  );
  notifyLocalAccountUpdate(uid);

  if (!isFirebaseCloudSessionActive(uid)) return;

  try {
    await deleteDoc(doc(db, 'users', uid, 'clients', clientId, 'documents', docId));
    await deleteDoc(doc(db, 'users', uid, 'documents', docId)).catch(() => {});
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}/clients/${clientId}/documents/${docId}`);
  }
}

// ---------------------------------------------------------------------------
// PART 4: Team Members & PART 6: API Keys Persistence in Firestore
// ---------------------------------------------------------------------------
export async function saveTeamMemberToFirestore(
  userId: string,
  member: TeamMemberRecord
): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  const memberId = sanitizeId(member.id, 'MEM');
  const path = `users/${uid}/teamMembers/${memberId}`;

  const normalizedMember: TeamMemberRecord = {
    id: memberId,
    ownerId: uid,
    email: clampString(member.email.toLowerCase(), 200, 3, 'staff@firm.in'),
    name: clampString(member.name, 150, 1, 'Team Member'),
    role:
      member.role === 'owner' || member.role === 'Owner/CA'
        ? 'Owner/CA'
        : member.role === 'reviewer' || member.role === 'Reviewer'
        ? 'Reviewer'
        : 'Staff',
    assignedClientIds: member.assignedClientIds || [DEFAULT_CLIENT_ID],
    status: member.status === 'active' || member.status === 'Active' ? 'Active' : 'Invited',
    invitedAt: clampString(member.invitedAt, 40, 1, new Date().toISOString().slice(0, 16).replace('T', ' ')),
  };

  const existingMembers = readLocalAccountData<TeamMemberRecord[]>(uid, 'teamMembers', []);
  writeLocalAccountData(uid, 'teamMembers', [
    normalizedMember,
    ...existingMembers.filter((m) => m.id !== memberId),
  ]);
  notifyLocalAccountUpdate(uid);

  if (!isFirebaseCloudSessionActive(uid)) return;

  const payload = {
    id: memberId,
    ownerId: uid,
    email: normalizedMember.email,
    name: normalizedMember.name,
    role: member.role === 'owner' || member.role === 'reviewer' ? member.role : 'staff',
    assignedClientsJson: clampString(JSON.stringify(member.assignedClientIds || [DEFAULT_CLIENT_ID]), 4000, 2, '[]'),
    status: member.status === 'active' ? 'active' : 'invited',
    invitedAt: normalizedMember.invitedAt,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', uid, 'teamMembers', memberId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTeamMemberFromFirestore(userId: string, rawMemberId: string): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  const memberId = sanitizeId(rawMemberId, 'MEM');

  const existingMembers = readLocalAccountData<TeamMemberRecord[]>(uid, 'teamMembers', []);
  writeLocalAccountData(
    uid,
    'teamMembers',
    existingMembers.filter((m) => m.id !== memberId)
  );
  notifyLocalAccountUpdate(uid);

  if (!isFirebaseCloudSessionActive(uid)) return;

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
  const uid = sanitizeId(userId, 'USR');
  if (!uid) return;
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

  const cur = auth.currentUser || getSavedLiveSessionUser();
  const prevProfile = readLocalAccountData<Record<string, any>>(uid, 'profile', {});
  writeLocalAccountData(uid, 'profile', {
    ...prevProfile,
    uid,
    email: clampString(cur?.email || prevProfile.email, 200, 3, 'user@ledgersutra.in'),
    displayName: clampString(
      cur?.displayName || prevProfile.displayName || cur?.email?.split('@')[0],
      150,
      1,
      'LedgerSutra User'
    ),
    photoURL: clampString(cur?.photoURL || prevProfile.photoURL, 1000, 0, ''),
    tallySettingsJson,
  });
  notifyLocalAccountUpdate(uid);

  if (!isFirebaseCloudSessionActive(uid)) return;

  try {
    await setDoc(
      doc(db, 'users', uid),
      {
        uid,
        email: clampString(cur?.email || prevProfile.email, 200, 3, 'user@ledgersutra.in'),
        displayName: clampString(
          cur?.displayName || prevProfile.displayName || cur?.email?.split('@')[0],
          150,
          1,
          'LedgerSutra User'
        ),
        photoURL: clampString(cur?.photoURL || prevProfile.photoURL, 1000, 0, ''),
        tallySettingsJson,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveApiKeyToFirestore(
  userId: string,
  apiKeyRecord: UserApiKeyRecord
): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  const keyId = sanitizeId(apiKeyRecord.id, 'KEY');
  const path = `users/${uid}/apiKeys/${keyId}`;

  const normalizedKey: UserApiKeyRecord = {
    id: keyId,
    ownerId: uid,
    label: clampString(apiKeyRecord.label || apiKeyRecord.name, 120, 1, 'API Key'),
    name: clampString(apiKeyRecord.label || apiKeyRecord.name, 120, 1, 'API Key'),
    keyPrefix: clampString(apiKeyRecord.keyPrefix, 24, 4, 'ls_live_'),
    keyHash: clampString(apiKeyRecord.keyHash, 128, 32, ''),
    revoked: Boolean(apiKeyRecord.revoked),
    status: apiKeyRecord.revoked ? 'revoked' : 'active',
    createdAt: clampString(apiKeyRecord.createdAt, 40, 1, new Date().toISOString().slice(0, 16).replace('T', ' ')),
  };

  const existingKeys = readLocalAccountData<UserApiKeyRecord[]>(uid, 'apiKeys', []);
  writeLocalAccountData(uid, 'apiKeys', [
    normalizedKey,
    ...existingKeys.filter((k) => k.id !== keyId),
  ]);
  notifyLocalAccountUpdate(uid);

  if (!isFirebaseCloudSessionActive(uid)) return;

  const payload = {
    id: keyId,
    ownerId: uid,
    label: normalizedKey.label,
    keyPrefix: normalizedKey.keyPrefix,
    keyHash: normalizedKey.keyHash,
    revoked: Boolean(apiKeyRecord.revoked),
    createdAt: normalizedKey.createdAt,
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
  const uid = sanitizeId(userId, 'USR');
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
    label: label.trim() || 'LedgerSutra API Key',
    name: label.trim() || 'LedgerSutra API Key',
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
  const uid = sanitizeId(userId, 'USR');
  const keyId = sanitizeId(rawKeyId, 'KEY');
  if (keyHash) {
    fetch('/api/v1/keys/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyHash }),
    }).catch(() => {});
  }
  await deleteApiKeyFromFirestore(uid, keyId);
}

export async function deleteApiKeyFromFirestore(userId: string, rawKeyId: string): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  const keyId = sanitizeId(rawKeyId, 'KEY');

  const existingKeys = readLocalAccountData<UserApiKeyRecord[]>(uid, 'apiKeys', []);
  writeLocalAccountData(
    uid,
    'apiKeys',
    existingKeys.filter((k) => k.id !== keyId)
  );
  notifyLocalAccountUpdate(uid);

  if (!isFirebaseCloudSessionActive(uid)) return;

  try {
    await deleteDoc(doc(db, 'users', uid, 'apiKeys', keyId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}/apiKeys/${keyId}`);
  }
}

// ---------------------------------------------------------------------------
// PART 9.3: Delete All User Account Data ("Delete my data")
// ---------------------------------------------------------------------------
export async function deleteEntireUserAccountDataFromFirestore(userId: string): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  try {
    const localClients = readLocalAccountData<CAClientProfile[]>(uid, 'clients', []);
    for (const c of localClients) {
      localStorage.removeItem(getLocalAccountKey(uid, `bills_${c.id}`));
      localStorage.removeItem(getLocalAccountKey(uid, `docs_${c.id}`));
    }
    localStorage.removeItem(getLocalAccountKey(uid, `bills_${DEFAULT_CLIENT_ID}`));
    localStorage.removeItem(getLocalAccountKey(uid, `docs_${DEFAULT_CLIENT_ID}`));
    localStorage.removeItem(getLocalAccountKey(uid, 'clients'));
    localStorage.removeItem(getLocalAccountKey(uid, 'teamMembers'));
    localStorage.removeItem(getLocalAccountKey(uid, 'apiKeys'));
    localStorage.removeItem(getLocalAccountKey(uid, 'profile'));
    notifyLocalAccountUpdate(uid);
  } catch {
    // ignore local cleanup errors
  }

  if (!isFirebaseCloudSessionActive(uid)) return;

  try {
    // 1. Delete all clients and nested bills/documents
    const clientsSnap = await getDocs(collection(db, 'users', uid, 'clients'));
    for (const cDoc of clientsSnap.docs) {
      await deleteClientFromFirestore(uid, cDoc.id);
    }
    // 2. Delete legacy root bills & documents
    const legacyBills = await getDocs(collection(db, 'users', uid, 'bills'));
    for (const bDoc of legacyBills.docs) {
      await deleteDoc(bDoc.ref);
    }
    const legacyDocs = await getDocs(collection(db, 'users', uid, 'documents'));
    for (const dDoc of legacyDocs.docs) {
      await deleteDoc(dDoc.ref);
    }
    // 3. Delete team members & API keys
    const teamSnap = await getDocs(collection(db, 'users', uid, 'teamMembers'));
    for (const mDoc of teamSnap.docs) {
      await deleteDoc(mDoc.ref);
    }
    const keysSnap = await getDocs(collection(db, 'users', uid, 'apiKeys'));
    for (const kDoc of keysSnap.docs) {
      await deleteDoc(kDoc.ref);
    }
    // 4. Delete user profile document
    await deleteDoc(doc(db, 'users', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}`);
  }
}

function parseBillSnapshotDoc(docId: string, d: Record<string, any>): NoSQLBillRecord {
  let extraHeaderFields: Record<string, string> = {};
  if (typeof d.extraHeaderFieldsJson === 'string') {
    try {
      const parsed = JSON.parse(d.extraHeaderFieldsJson);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        extraHeaderFields = parsed;
      }
    } catch {
      // ignore
    }
  } else if (d.extraHeaderFields && typeof d.extraHeaderFields === 'object') {
    extraHeaderFields = { ...d.extraHeaderFields };
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
        items = parsed;
      }
    } catch {
      // ignore
    }
  } else if (Array.isArray(d.items)) {
    items = d.items;
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
  const uid = sanitizeId(userId, 'USR');
  const clientId = sanitizeId(activeClientId || DEFAULT_CLIENT_ID, 'CLI');

  // Helper to sync from local account storage (used immediately and in Live-Site Session mode)
  const syncFromLocalAccount = () => {
    const profileData = readLocalAccountData<Record<string, any> | null>(uid, 'profile', null);
    if (profileData) {
      let parsedCols: string[] | undefined;
      if (typeof profileData.selectedColumnsJson === 'string') {
        try {
          const arr = JSON.parse(profileData.selectedColumnsJson);
          if (Array.isArray(arr) && arr.length > 0) parsedCols = arr.map(String);
        } catch {
          // ignore
        }
      }
      let parsedTally: TallySettings | undefined;
      if (typeof profileData.tallySettingsJson === 'string') {
        try {
          const obj = JSON.parse(profileData.tallySettingsJson);
          if (obj && typeof obj === 'object') parsedTally = { ...DEFAULT_TALLY_SETTINGS, ...obj };
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
            profileData.userMode === 'ca_mode'
              ? 'ca_mode'
              : profileData.userMode === 'normal_user'
              ? 'normal_user'
              : undefined,
          firmRole:
            profileData.firmRole === 'reviewer'
              ? 'Reviewer'
              : profileData.firmRole === 'staff'
              ? 'Staff'
              : 'Owner/CA',
          selectedColumnKeys: parsedCols,
          tallySettings: parsedTally,
        });
      }
    }

    if (callbacks.onClientsUpdate) {
      const localClients = readLocalAccountData<CAClientProfile[]>(uid, 'clients', []);
      if (localClients.length === 0) {
        const defaultClient = { ...DEFAULT_CA_CLIENT, ownerId: uid };
        writeLocalAccountData(uid, 'clients', [defaultClient]);
        callbacks.onClientsUpdate([defaultClient]);
      } else {
        callbacks.onClientsUpdate(localClients);
      }
    }

    const localBills = readLocalAccountData<NoSQLBillRecord[]>(uid, `bills_${clientId}`, []);
    localBills.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
    callbacks.onBillsUpdate(localBills);

    const localDocs = readLocalAccountData<SavedDocumentRecord[]>(uid, `docs_${clientId}`, []);
    localDocs.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
    callbacks.onDocumentsUpdate(localDocs);

    if (callbacks.onTeamMembersUpdate) {
      const localTeam = readLocalAccountData<TeamMemberRecord[]>(uid, 'teamMembers', []);
      callbacks.onTeamMembersUpdate(localTeam);
    }

    if (callbacks.onApiKeysUpdate) {
      const localKeys = readLocalAccountData<UserApiKeyRecord[]>(uid, 'apiKeys', []);
      callbacks.onApiKeysUpdate(localKeys);
    }
  };

  // If running in Live-Site Session mode (without Firebase Cloud popup token), use local storage + listener
  if (!isFirebaseCloudSessionActive(uid)) {
    syncFromLocalAccount();
    const listener = (updatedUid: string) => {
      if (updatedUid === uid) syncFromLocalAccount();
    };
    localAccountListeners.add(listener);
    return () => {
      localAccountListeners.delete(listener);
    };
  }

  // Auto-migrate legacy root /users/{uid}/bills into /users/{uid}/clients/client_default/bills once
  if (clientId === DEFAULT_CLIENT_ID) {
    getDocs(collection(db, 'users', uid, 'bills'))
      .then(async (legacySnap) => {
        if (!legacySnap.empty) {
          await saveClientToFirestore(uid, { ...DEFAULT_CA_CLIENT, ownerId: uid });
          for (const docSnap of legacySnap.docs) {
            const billObj = parseBillSnapshotDoc(docSnap.id, docSnap.data());
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
            parsedCols = arr.map((k) => String(k));
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
    collection(db, 'users', uid, 'clients'),
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
    collection(db, 'users', uid, 'clients', clientId, 'bills'),
    (snap) => {
      const bills: NoSQLBillRecord[] = [];
      snap.forEach((docSnap) => {
        bills.push(parseBillSnapshotDoc(docSnap.id, docSnap.data()));
      });
      bills.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
      callbacks.onBillsUpdate(bills);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uid}/clients/${clientId}/bills`);
    }
  );

  const unsubDocs = onSnapshot(
    collection(db, 'users', uid, 'clients', clientId, 'documents'),
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
    collection(db, 'users', uid, 'teamMembers'),
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
    collection(db, 'users', uid, 'apiKeys'),
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
