import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { BodyCompositionLog } from "@/types";

export const ProgressRepository = {
  /**
   * Fetches body composition and weight logs ordered chronologically.
   */
  async getBodyLogs(uid: string, limitCount = 50): Promise<BodyCompositionLog[]> {
    if (!db) return [];
    const logsCol = collection(db, "users", uid, "bodyLogs");
    const q = query(logsCol, orderBy("date", "asc"), limit(limitCount));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as BodyCompositionLog[];
  },

  /**
   * Adds a new body measurement entry.
   */
  async addBodyLog(
    uid: string,
    log: Omit<BodyCompositionLog, "id">
  ): Promise<BodyCompositionLog> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");

    const logsCol = collection(db, "users", uid, "bodyLogs");
    const newDocRef = doc(logsCol);
    const logId = newDocRef.id;

    const fullLog: BodyCompositionLog = {
      ...log,
      id: logId,
    };

    await setDoc(newDocRef, {
      ...fullLog,
      createdAt: serverTimestamp(),
    });

    return fullLog;
  },

  /**
   * Deletes a body measurement entry.
   */
  async deleteBodyLog(uid: string, logId: string): Promise<void> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");
    const docRef = doc(db, "users", uid, "bodyLogs", logId);
    await deleteDoc(docRef);
  },
};
