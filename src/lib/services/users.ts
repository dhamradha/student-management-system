import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type QueryConstraint,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import { INSTITUTION_NAME } from "@/lib/constants/academic";
import type {
  AcademicData,
  GuardianData,
  UserDoc,
} from "@/types";

const usersCol = collection(db, "users");

function userRef(uid: string) {
  return doc(db, "users", uid);
}

/** Create the initial STUDENT profile immediately after registration. */
export async function createStudentProfile(
  uid: string,
  admissionNo: string,
): Promise<void> {
  const now = new Date().toISOString();
  const data: UserDoc = {
    uid,
    role: "STUDENT",
    isApproved: false,
    status: "incomplete",
    institution: INSTITUTION_NAME,
    admissionNo,
    academicData: null,
    guardianData: null,
    onboardingStep: 0,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(userRef(uid), data);
}

export async function getUserDoc(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(userRef(uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

/** Persist Form Phase 1 and advance the wizard. */
export async function saveAcademicData(
  uid: string,
  academicData: AcademicData,
): Promise<void> {
  await updateDoc(userRef(uid), {
    academicData,
    admissionNo: academicData.admissionNo,
    onboardingStep: 1,
    updatedAt: new Date().toISOString(),
  });
}

/** Persist Form Phase 2 and submit the profile for verification. */
export async function saveGuardianData(
  uid: string,
  guardianData: GuardianData,
): Promise<void> {
  await updateDoc(userRef(uid), {
    guardianData,
    onboardingStep: 2,
    status: "pending",
    updatedAt: new Date().toISOString(),
  });
}

interface StudentQuery {
  grade?: string;
  classStream?: string;
  status?: UserDoc["status"];
}

/** Admin cohort listing with optional class/status filters (SRS §3). */
export async function listStudents(
  filters: StudentQuery = {},
): Promise<UserDoc[]> {
  const constraints: QueryConstraint[] = [where("role", "==", "STUDENT")];
  if (filters.grade) {
    constraints.push(where("academicData.grade", "==", filters.grade));
  }
  if (filters.classStream) {
    constraints.push(
      where("academicData.classStream", "==", filters.classStream),
    );
  }
  if (filters.status) constraints.push(where("status", "==", filters.status));

  const snap = await getDocs(query(usersCol, ...constraints));
  return snap.docs.map((d) => d.data() as UserDoc);
}

/** Admin/super-admin verification decision. */
export async function setApproval(
  uid: string,
  decision: "approved" | "rejected",
): Promise<void> {
  await updateDoc(userRef(uid), {
    status: decision,
    isApproved: decision === "approved",
    reviewedAt: serverTimestamp(),
    updatedAt: new Date().toISOString(),
  });
}
