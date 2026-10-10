import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { FoodLogEntry } from "@/types";

export const FoodLogRepository = {
  /**
   * Fetches all food logs for a given user on a specific ISO date (YYYY-MM-DD).
   */
  async getFoodLogsForDate(uid: string, date: string): Promise<FoodLogEntry[]> {
    if (!db) return [];
    const foodLogsCol = collection(db, "users", uid, "foodLogs");
    const q = query(
      foodLogsCol,
      where("loggedDate", "==", date),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as FoodLogEntry[];
  },

  /**
   * Adds a new immutable snapshot food entry to Firestore.
   */
  async addFoodLog(uid: string, entry: Omit<FoodLogEntry, "id">): Promise<FoodLogEntry> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");

    const foodLogsCol = collection(db, "users", uid, "foodLogs");
    const newDocRef = doc(foodLogsCol);
    const logId = newDocRef.id;

    const fullEntry: FoodLogEntry = {
      ...entry,
      id: logId,
    };

    await setDoc(newDocRef, {
      ...fullEntry,
      createdAt: serverTimestamp(),
    });

    return fullEntry;
  },

  /**
   * Updates an existing food log quantity and calculated nutrients.
   */
  async updateFoodLog(uid: string, logId: string, updates: Partial<FoodLogEntry>): Promise<void> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");
    const docRef = doc(db, "users", uid, "foodLogs", logId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Deletes a food log.
   */
  async deleteFoodLog(uid: string, logId: string): Promise<void> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");
    const docRef = doc(db, "users", uid, "foodLogs", logId);
    await deleteDoc(docRef);
  },
};
