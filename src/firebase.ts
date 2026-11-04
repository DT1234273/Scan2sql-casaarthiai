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
  getDocFromServer,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import type { NoSQLBillRecord, SavedDocumentRecord } from './App';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

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

export async function signInWithGooglePopup(): Promise<User> {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

export async function signOutGoogleUser(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged };
export type { User };

// Helpers to sanitize strings, numbers, and IDs to strictly match firestore.rules
function sanitizeId(rawId: string, fallbackPrefix = 'REC'): string {
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

export async function saveUserProfileToFirestore(
  user: User,
  userMode: 'normal_user' | 'ca_mode',
  selectedColumnKeys: string[]
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

  const payload = {
    uid,
    email: clampString(user.email, 200, 3, 'user@casaarthiai.in'),
    displayName: clampString(user.displayName || user.email?.split('@')[0], 150, 1, 'LedgerSutra User'),
    photoURL: clampString(user.photoURL, 1000, 0, ''),
    userMode: userMode === 'ca_mode' ? 'ca_mode' : 'normal_user',
    selectedColumnsJson,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', uid), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveBillToUserAccount(userId: string, bill: NoSQLBillRecord): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  const billId = sanitizeId(bill.id, 'BILL');
  const path = `users/${uid}/bills/${billId}`;

  let extraHeaderFieldsJson = '{}';
  try {
    const str = JSON.stringify(bill.extraHeaderFields || {});
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

  const payload = {
    id: billId,
    ownerId: uid,
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
  };

  try {
    await setDoc(doc(db, 'users', uid, 'bills', billId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteBillFromUserAccount(userId: string, rawBillId: string): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  const billId = sanitizeId(rawBillId, 'BILL');
  const path = `users/${uid}/bills/${billId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'bills', billId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveDocumentToUserAccount(
  userId: string,
  docRecord: SavedDocumentRecord
): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  const docId = sanitizeId(docRecord.id, 'DOC');
  const path = `users/${uid}/documents/${docId}`;

  const rawPageCount = Math.round(Number(docRecord.pageCount) || 1);
  const pageCount = Math.max(1, Math.min(500, rawPageCount));

  const payload = {
    id: docId,
    ownerId: uid,
    fileName: clampString(docRecord.fileName, 250, 1, 'Document.pdf'),
    fileType: clampString(docRecord.fileType, 40, 1, 'PDF'),
    docType: docRecord.docType === 'NORMAL_DOCUMENT' ? 'NORMAL_DOCUMENT' : 'SHOP_BILL',
    pageCount,
    ocrLanguage: clampString(docRecord.ocrLanguage, 30, 1, 'eng+hin'),
    extractedText: clampString(docRecord.extractedText, 50000, 0, ''),
    confidence: clampConfidence(docRecord.confidence),
    createdAt: clampString(docRecord.createdAt, 40, 1, new Date().toISOString().slice(0, 16).replace('T', ' ')),
    syncedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', uid, 'documents', docId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteDocumentFromUserAccount(userId: string, rawDocId: string): Promise<void> {
  const uid = sanitizeId(userId, 'USR');
  const docId = sanitizeId(rawDocId, 'DOC');
  const path = `users/${uid}/documents/${docId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'documents', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToUserAccountHistory(
  userId: string,
  callbacks: {
    onBillsUpdate: (bills: NoSQLBillRecord[]) => void;
    onDocumentsUpdate: (docs: SavedDocumentRecord[]) => void;
    onProfileUpdate?: (profile: { userMode?: 'normal_user' | 'ca_mode'; selectedColumnKeys?: string[] }) => void;
  }
): () => void {
  const uid = sanitizeId(userId, 'USR');

  const unsubProfile = onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      if (!snap.exists() || !callbacks.onProfileUpdate) return;
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
      callbacks.onProfileUpdate({
        userMode: data.userMode === 'ca_mode' ? 'ca_mode' : data.userMode === 'normal_user' ? 'normal_user' : undefined,
        selectedColumnKeys: parsedCols,
      });
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${uid}`);
    }
  );

  const unsubBills = onSnapshot(
    collection(db, 'users', uid, 'bills'),
    (snap) => {
      const bills: NoSQLBillRecord[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
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
        }
        bills.push({
          id: String(d.id || docSnap.id),
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
        });
      });
      // Sort newest first by createdAt or id
      bills.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
      callbacks.onBillsUpdate(bills);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uid}/bills`);
    }
  );

  const unsubDocs = onSnapshot(
    collection(db, 'users', uid, 'documents'),
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
      handleFirestoreError(err, OperationType.LIST, `users/${uid}/documents`);
    }
  );

  return () => {
    unsubProfile();
    unsubBills();
    unsubDocs();
  };
}
