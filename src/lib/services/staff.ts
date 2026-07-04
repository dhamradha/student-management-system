import { collection, getDocs, query, where } from "firebase/firestore";

import { auth, db } from "@/lib/firebase/client";
import type { UserDoc } from "@/types";
import type { NewTeacherInput } from "@/lib/validations/student";

const usersCol = collection(db, "users");

/** List all TEACHER accounts (SUPER_ADMIN only, enforced by rules). */
export async function listTeachers(): Promise<UserDoc[]> {
  const snap = await getDocs(query(usersCol, where("role", "==", "TEACHER")));
  return snap.docs.map((d) => d.data() as UserDoc);
}

async function authorizedFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(input, {
    ...init,
    headers: {
      ...init.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? "Request failed");
  return body;
}

/** Provision a new teacher — runs server-side via the Admin SDK. */
export async function createTeacher(input: NewTeacherInput): Promise<void> {
  await authorizedFetch("/api/teachers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** Revoke a teacher's access (deletes the auth user + staff doc). */
export async function deleteTeacher(uid: string): Promise<void> {
  await authorizedFetch(`/api/teachers/${uid}`, { method: "DELETE" });
}
