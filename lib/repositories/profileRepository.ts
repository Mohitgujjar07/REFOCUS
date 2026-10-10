import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { UserProfile } from "@/types";
import { FOUNDER_INITIAL_PROFILE } from "@/lib/constants";

export const ProfileRepository = {
  /**
   * Fetches the user profile document by UID.
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!db) return null;
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  },

  /**
   * Creates or overwrites a user profile document upon registration or onboarding.
   */
  async createUserProfile(uid: string, initialData: Partial<UserProfile>): Promise<UserProfile> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");

    const now = new Date().toISOString();
    const profile: UserProfile = {
      ...FOUNDER_INITIAL_PROFILE,
      uid,
      displayName: initialData.displayName || "New Transformation User",
      email: initialData.email || "",
      startingWeightKg: initialData.startingWeightKg || FOUNDER_INITIAL_PROFILE.startingWeightKg,
      currentWeightKg: initialData.currentWeightKg || initialData.startingWeightKg || FOUNDER_INITIAL_PROFILE.currentWeightKg,
      targetWeightKg: initialData.targetWeightKg || FOUNDER_INITIAL_PROFILE.targetWeightKg,
      heightCm: initialData.heightCm || FOUNDER_INITIAL_PROFILE.heightCm,
      dailyCalorieTarget: initialData.dailyCalorieTarget || FOUNDER_INITIAL_PROFILE.dailyCalorieTarget,
      dailyProteinTargetGrams: initialData.dailyProteinTargetGrams || FOUNDER_INITIAL_PROFILE.dailyProteinTargetGrams,
      dailyStepTarget: initialData.dailyStepTarget || FOUNDER_INITIAL_PROFILE.dailyStepTarget,
      dailySleepTargetHours: initialData.dailySleepTargetHours || FOUNDER_INITIAL_PROFILE.dailySleepTargetHours,
      dietaryPattern: initialData.dietaryPattern || FOUNDER_INITIAL_PROFILE.dietaryPattern,
      monthlyGroceryBudgetInr: initialData.monthlyGroceryBudgetInr ?? FOUNDER_INITIAL_PROFILE.monthlyGroceryBudgetInr,
      availableGymDaysPerWeek: initialData.availableGymDaysPerWeek || FOUNDER_INITIAL_PROFILE.availableGymDaysPerWeek,
      preferredUnits: initialData.preferredUnits || "metric",
      timeZone: initialData.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
      experienceLevel: initialData.experienceLevel || "beginner",
      createdAt: now,
      updatedAt: now,
      ...initialData,
    };

    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      ...profile,
      serverUpdatedAt: serverTimestamp(),
    });

    return profile;
  },

  /**
   * Updates specific profile fields.
   */
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
      serverUpdatedAt: serverTimestamp(),
    });
  },

  /**
   * Deletes user document.
   */
  async deleteUserProfile(uid: string): Promise<void> {
    if (!db) throw new Error("Firebase Firestore is not initialized.");
    const userDocRef = doc(db, "users", uid);
    await deleteDoc(userDocRef);
  },
};
