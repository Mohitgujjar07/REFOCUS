import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { HabitItem } from "@/types";

export interface DailyLogRecord {
  date: string;
  steps: number;
  sleepHours?: number;
  waterLitres?: number;
  notes?: string;
}

export const HabitRepository = {
  /**
   * Fetches user's habits.
   */
  async getHabits(uid: string): Promise<HabitItem[]> {
    if (!db) return [];
    const habitsCol = collection(db, "users", uid, "habits");
    const snapshot = await getDocs(habitsCol);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as HabitItem[];
  },

  /**
   * Saves or updates a user habit.
   */
  async saveHabit(uid: string, habit: HabitItem): Promise<void> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");
    const docRef = doc(db, "users", uid, "habits", habit.id);
    await setDoc(docRef, {
      ...habit,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Fetches daily tracking data for a specific date (steps, sleep, hydration).
   */
  async getDailyLog(uid: string, date: string): Promise<DailyLogRecord | null> {
    if (!db) return null;
    const docRef = doc(db, "users", uid, "dailyLogs", date);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as DailyLogRecord;
  },

  /**
   * Saves daily metrics (steps, sleep, hydration).
   */
  async saveDailyLog(
    uid: string,
    date: string,
    data: Partial<DailyLogRecord>
  ): Promise<void> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");
    const docRef = doc(db, "users", uid, "dailyLogs", date);
    await setDoc(
      docRef,
      {
        ...data,
        date,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },
};
