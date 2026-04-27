import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "./firebase";
import { ApplicationData, AppStatus, AuditLogEntry } from "./types";

const APPLICATIONS = "applications";

export async function checkMobileExists(mobile: string) {
  const snapshot = await getDoc(doc(db, APPLICATIONS, mobile));
  return snapshot.exists();
}

export async function checkDuplicateEntry(childName: string, dob: string, motherName: string) {
  const q = query(
    collection(db, APPLICATIONS),
    where("childName", "==", childName.trim()),
    where("dob", "==", dob),
    where("motherName", "==", motherName.trim()),
    limit(1)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export async function saveApplication(data: ApplicationData) {
  const ref = doc(db, APPLICATIONS, data.mobile);

  await runTransaction(db, async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists()) {
      throw new Error("Application already exists");
    }
    tx.set(ref, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });
}

export async function getApplicationByMobile(mobile: string) {
  const snap = await getDoc(doc(db, APPLICATIONS, mobile));
  return snap.exists() ? snap.data() : null;
}

export async function listApplications() {
  const snap = await getDocs(collection(db, APPLICATIONS));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateStatus(mobile: string, status: AppStatus, entry: AuditLogEntry) {
  const ref = doc(db, APPLICATIONS, mobile);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Application not found");
  const oldLog = (snap.data().auditLog ?? []) as AuditLogEntry[];

  await updateDoc(ref, {
    status,
    auditLog: [...oldLog, entry],
    updatedAt: serverTimestamp()
  });
}
