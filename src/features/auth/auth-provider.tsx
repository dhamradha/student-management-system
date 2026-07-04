"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { admissionToEmail } from "@/lib/auth/admission";
import { auth, db } from "@/lib/firebase/client";
import { STUDENT_EMAIL_DOMAIN } from "@/lib/firebase/config";
import { createStudentProfile } from "@/lib/services/users";
import type { UserDoc } from "@/types";

interface AuthContextValue {
  user: User | null;
  profile: UserDoc | null;
  loading: boolean;
  loginWithAdmission: (admissionNo: string, password: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerStudent: (admissionNo: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Global auth state. Subscribes to Firebase Auth and live-streams the user's
 * Firestore profile so approval-milestone changes (SRS §3) surface instantly
 * without a refresh.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
      }
    });
  }, []);

  // Live profile subscription, re-created whenever the signed-in user changes.
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    let healed = false;
    const unsub = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        if (snap.exists()) {
          setProfile(snap.data() as UserDoc);
          setLoading(false);
          return;
        }
        // No profile document. Self-heal a student whose profile write failed
        // during registration by deriving the admission number from the
        // synthetic login email. Staff accounts are provisioned separately and
        // are never healed here. onSnapshot re-fires once the doc is written.
        const email = user.email ?? "";
        const suffix = `@${STUDENT_EMAIL_DOMAIN}`;
        if (!healed && email.endsWith(suffix)) {
          healed = true;
          createStudentProfile(user.uid, email.slice(0, -suffix.length)).catch(
            () => setLoading(false),
          );
        } else {
          setProfile(null);
          setLoading(false);
        }
      },
      () => setLoading(false),
    );
    return unsub;
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      async loginWithAdmission(admissionNo, password) {
        await signInWithEmailAndPassword(
          auth,
          admissionToEmail(admissionNo),
          password,
        );
      },
      async loginWithEmail(email, password) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      },
      async registerStudent(admissionNo, password) {
        const cred = await createUserWithEmailAndPassword(
          auth,
          admissionToEmail(admissionNo),
          password,
        );
        await createStudentProfile(cred.user.uid, admissionNo);
      },
      async logout() {
        await signOut(auth);
      },
    }),
    [user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
