import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  type QueryConstraint,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { Cursor, Page } from "@/lib/pagination";
import type { TeacherProfileData, TeacherRecord } from "@/types";
import type { TeacherInput } from "@/lib/validations/student";

const col = collection(db, "teacherRecords");

function ref(id: string) {
  return doc(db, "teacherRecords", id);
}

function toProfile(input: TeacherInput): TeacherProfileData {
  return {
    fullName: input.fullName,
    nameWithInitials: input.nameWithInitials,
    nic: input.nic,
    gender: input.gender,
    dob: input.dob,
    contactNo: input.contactNo,
    email: input.email,
    address: input.address,
    subject: input.subject,
    qualifications: input.qualifications,
  };
}

export function toTeacherFormValues(record: TeacherRecord): TeacherInput {
  return { ...record.profile };
}

export async function teacherRecordExists(nic: string): Promise<boolean> {
  return (await getDoc(ref(nic))).exists();
}

export async function createTeacherRecord(
  input: TeacherInput,
  createdBy: string,
  createdByName: string,
): Promise<void> {
  const id = input.nic;
  if (await teacherRecordExists(id)) {
    throw new Error("A teacher with this NIC already exists.");
  }
  const now = new Date().toISOString();
  const record: TeacherRecord = {
    id,
    profile: toProfile(input),
    createdBy,
    createdByName,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(ref(id), record);
}

export async function updateTeacherRecord(
  id: string,
  input: TeacherInput,
): Promise<void> {
  await updateDoc(ref(id), {
    profile: toProfile(input),
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteTeacherRecord(id: string): Promise<void> {
  await deleteDoc(ref(id));
}

export async function getTeacherRecord(
  id: string,
): Promise<TeacherRecord | null> {
  const snap = await getDoc(ref(id));
  return snap.exists() ? (snap.data() as TeacherRecord) : null;
}

/** One page of teacher records, ordered by name. */
export async function pageTeacherRecords(
  pageSize: number,
  after: Cursor,
): Promise<Page<TeacherRecord>> {
  const constraints: QueryConstraint[] = [orderBy("profile.fullName")];
  if (after) constraints.push(startAfter(after));
  constraints.push(limit(pageSize + 1));

  const snap = await getDocs(query(col, ...constraints));
  const docs = snap.docs;
  const hasMore = docs.length > pageSize;
  const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;
  return {
    records: pageDocs.map((d) => d.data() as TeacherRecord),
    cursor: pageDocs[pageDocs.length - 1] ?? null,
    hasMore,
  };
}
