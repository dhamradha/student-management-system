import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type QueryConstraint,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase/client";
import type { Cursor, Page } from "@/lib/pagination";
import type { UserDoc } from "@/types";
import type { NewTeacherInput } from "@/lib/validations/student";

const usersCol = collection(db, "users");

/** One page of TEACHER accounts (SUPER_ADMIN only), ordered by name. */
export async function pageTeachers(
  pageSize: number,
  after: Cursor,
): Promise<Page<UserDoc>> {
  const constraints: QueryConstraint[] = [
    where("role", "==", "TEACHER"),
    orderBy("displayName"),
  ];
  if (after) constraints.push(startAfter(after));
  constraints.push(limit(pageSize + 1));

  const snap = await getDocs(query(usersCol, ...constraints));
  const docs = snap.docs;
  const hasMore = docs.length > pageSize;
  const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;
  return {
    records: pageDocs.map((d) => d.data() as UserDoc),
    cursor: pageDocs[pageDocs.length - 1] ?? null,
    hasMore,
  };
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
