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
  where,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { Cursor, Page } from "@/lib/pagination";
import type { FormDoc } from "@/types/forms";

const formsCol = collection(db, "forms");

function formRef(id: string) {
  return doc(db, "forms", id);
}

/** Backfill defaults for forms created before a field existed (e.g. target). */
function normalizeForm(data: DocumentData): FormDoc {
  return {
    ...(data as FormDoc),
    target: data.target || "student",
    grades: data.grades ?? [],
    classStreams: data.classStreams ?? [],
    fields: data.fields ?? [],
  };
}

export type FormInput = Pick<
  FormDoc,
  | "title"
  | "description"
  | "target"
  | "grades"
  | "classStreams"
  | "status"
  | "fields"
>;

/** Create a form; returns the generated id (used in the share link). */
export async function createForm(
  input: FormInput,
  createdBy: string,
  createdByName: string,
): Promise<string> {
  const ref = doc(formsCol);
  const now = new Date().toISOString();
  const record: FormDoc = {
    id: ref.id,
    ...input,
    createdBy,
    createdByName,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(ref, record);
  return ref.id;
}

export async function updateForm(id: string, input: FormInput): Promise<void> {
  await updateDoc(formRef(id), {
    ...input,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteForm(id: string): Promise<void> {
  await deleteDoc(formRef(id));
}

export async function getForm(id: string): Promise<FormDoc | null> {
  const snap = await getDoc(formRef(id));
  return snap.exists() ? normalizeForm(snap.data()) : null;
}

/** Public read — returns the form only if it is published. */
export async function getPublishedForm(id: string): Promise<FormDoc | null> {
  const form = await getForm(id);
  return form && form.status === "published" ? form : null;
}

/** One page of forms, most recently updated first. */
export async function pageForms(
  pageSize: number,
  after: Cursor,
): Promise<Page<FormDoc>> {
  const constraints: QueryConstraint[] = [orderBy("updatedAt", "desc")];
  if (after) constraints.push(startAfter(after));
  constraints.push(limit(pageSize + 1));

  const snap = await getDocs(query(formsCol, ...constraints));
  const docs = snap.docs;
  const hasMore = docs.length > pageSize;
  const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;
  return {
    records: pageDocs.map((d) => normalizeForm(d.data())),
    cursor: pageDocs[pageDocs.length - 1] ?? null,
    hasMore,
  };
}

export async function countPending(formId: string): Promise<number> {
  const snap = await getDocs(
    query(
      collection(db, "submissions"),
      where("formId", "==", formId),
      where("status", "==", "pending"),
    ),
  );
  return snap.size;
}
