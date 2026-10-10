"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { ProfileRepository } from "@/lib/repositories/profileRepository";
import { UserProfile } from "@/types";
import { FOUNDER_INITIAL_PROFILE } from "@/lib/constants";
import { getFriendlyFirebaseErrorMessage } from "@/lib/firebase/errors";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isConfigured = isFirebaseConfigured();

  // Load user profile from Firestore or provision baseline
  const fetchProfile = async (uid: string, fallbackEmail?: string, fallbackName?: string) => {
    try {
      let p = await ProfileRepository.getUserProfile(uid);
      if (!p) {
        // First-time user, initialize baseline profile in Firestore
        p = await ProfileRepository.createUserProfile(uid, {
          email: fallbackEmail || "",
          displayName: fallbackName || "Refocous Member",
        });
      }
      setProfile(p);
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  };

  useEffect(() => {
    if (!isConfigured || !auth) {
      // In development when credentials are not yet entered in .env.local,
      // load founder profile with isConfigured = false
      setProfile(FOUNDER_INITIAL_PROFILE);
      setIsLoading(false);
      return;
    }

    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          setUser(firebaseUser);
          if (firebaseUser) {
            await fetchProfile(
              firebaseUser.uid,
              firebaseUser.email || undefined,
              firebaseUser.displayName || undefined
            );
          } else {
            setProfile(null);
          }
          setIsLoading(false);
        },
        (authErr) => {
          console.warn("Firebase Auth observer caught error:", authErr);
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.warn("Failed to attach auth observer:", err);
      setIsLoading(false);
    }

    return () => {
      try {
        unsubscribe();
      } catch {
        // Safe cleanup
      }
    };
  }, [isConfigured]);

  const signInWithGoogle = async () => {
    setError(null);
    if (!isConfigured || !auth) {
      // In demo/blueprint mode, allow entry with founder profile
      setProfile(FOUNDER_INITIAL_PROFILE);
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const cred = await signInWithPopup(auth, provider);
      await fetchProfile(
        cred.user.uid,
        cred.user.email || undefined,
        cred.user.displayName || undefined
      );
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        return;
      }
      const msg = getFriendlyFirebaseErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const login = async (email: string, pass: string) => {
    setError(null);
    if (!isConfigured || !auth) {
      throw new Error("Firebase is not configured. Please supply Firebase credentials in .env.local.");
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await fetchProfile(cred.user.uid, cred.user.email || undefined, cred.user.displayName || undefined);
    } catch (err: any) {
      const msg = getFriendlyFirebaseErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    setError(null);
    if (!isConfigured || !auth) {
      throw new Error("Firebase is not configured. Please supply Firebase credentials in .env.local.");
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      // Create user document in Firestore immediately
      const newProfile = await ProfileRepository.createUserProfile(cred.user.uid, {
        email,
        displayName: name,
      });
      setProfile(newProfile);
    } catch (err: any) {
      const msg = getFriendlyFirebaseErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setError(null);
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    setError(null);
    if (!isConfigured || !auth) {
      throw new Error("Firebase is not configured. Please supply Firebase credentials in .env.local.");
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      const msg = getFriendlyFirebaseErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isConfigured,
        error,
        signInWithGoogle,
        login,
        register,
        logout,
        resetPassword,
        refreshProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
