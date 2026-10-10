import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { WorkoutSession } from "@/types";

export const WorkoutRepository = {
  /**
   * Fetches recent completed/logged workout sessions for a user.
   */
  async getWorkoutSessions(uid: string, limitCount = 20): Promise<WorkoutSession[]> {
    if (!db) return [];
    const sessionsCol = collection(db, "users", uid, "workoutSessions");
    const q = query(sessionsCol, orderBy("startedAt", "desc"), limit(limitCount));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as WorkoutSession[];
  },

  /**
   * Persists a finished or saved workout session.
   */
  async createWorkoutSession(
    uid: string,
    session: Omit<WorkoutSession, "id">
  ): Promise<WorkoutSession> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");

    const sessionsCol = collection(db, "users", uid, "workoutSessions");
    const newDocRef = doc(sessionsCol);
    const sessionId = newDocRef.id;

    const fullSession: WorkoutSession = {
      ...session,
      id: sessionId,
    };

    await setDoc(newDocRef, {
      ...fullSession,
      createdAt: serverTimestamp(),
    });

    return fullSession;
  },

  /**
   * Updates an existing workout session (e.g., sets completed or finish time).
   */
  async updateWorkoutSession(
    uid: string,
    sessionId: string,
    updates: Partial<WorkoutSession>
  ): Promise<void> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");
    const docRef = doc(db, "users", uid, "workoutSessions", sessionId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },
};
