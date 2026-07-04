import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { initAppCheck } from "./app-check";
import { firebaseConfig } from "./config";

/**
 * Client-side Firebase singletons. `getApps()` guard prevents re-initialising
 * during Fast Refresh / repeated imports.
 */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Attest requests via App Check before any Firestore/Auth calls are made.
initAppCheck(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };
