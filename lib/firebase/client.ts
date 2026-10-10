import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, FirebaseStorage, connectStorageEmulator } from "firebase/storage";
import { firebaseConfig, isFirebaseConfigured } from "./config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== "undefined" && isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Support for local Firebase Emulator Suite if configured
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
      const authHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || "http://127.0.0.1:9099";
      const firestoreHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || "127.0.0.1";
      const firestorePort = Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || 8080);

      try {
        connectAuthEmulator(auth, authHost, { disableWarnings: true });
        connectFirestoreEmulator(db, firestoreHost, firestorePort);
        connectStorageEmulator(storage, "127.0.0.1", 9199);
      } catch {
        // Emulator already connected in fast refresh
      }
    }
  } catch (error) {
    console.error("Failed to initialize Firebase client:", error);
  }
}

export { app, auth, db, storage };
