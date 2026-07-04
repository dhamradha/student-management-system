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
  type QueryConstraint,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { Cursor, Page } from "@/lib/pagination";
import type { FormDoc, FormField, FormSubmission } from "@/types/forms";

const submissionsCol = collection(db, "submissions");

function submissionRef(id: string) {
  return doc(db, "submissions", id);
}

/** Build the mapped-attribute view from raw answers + the form's field map. */
function buildMapped(
  fields: FormField[],
  answers: Record<string, string | string[]>,
): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const field of fields) {
    if (!field.mapTo) continue;
    const value = answers[field.id];
    if (value == null) continue;
    mapped[field.mapTo] = Array.isArray(value) ? value.join(", ") : value;
  }
  return mapped;
}

/** Public — a student submits a response to a published form. */
export async function createSubmission(
  form: FormDoc,
  answers: Record<string, string | string[]>,
  grade: string,
  classStream: string | null,
): Promise<void> {
  const mapped = buildMapped(form.fields, answers);

  // Deterministic id keyed on the natural identity (admission no / NIC) so a
  // repeat submission for the same person becomes an update — which the public
  // is not allowed to do, blocking duplicates. Falls back to a random id when
  // the form has no identity field.
  const identity = form.target === "teacher" ? mapped.nic : mapped.admissionNo;
  const id = identity
    ? `${form.id}__${identity.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`
    : doc(submissionsCol).id;

  const record: FormSubmission = {
    id,
    formId: form.id,
    formTitle: form.title,
    target: form.target,
    grade,
    classStream,
    answers,
    mapped,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  await setDoc(doc(submissionsCol, id), record);
}

/** One page of submissions for a form, newest first, filtered by status. */
export async function pageSubmissions(
  filters: { formId: string; status?: FormSubmission["status"] },
  pageSize: number,
  after: Cursor,
): Promise<Page<FormSubmission>> {
  const constraints: QueryConstraint[] = [
    where("formId", "==", filters.formId),
  ];
  if (filters.status) constraints.push(where("status", "==", filters.status));
  constraints.push(orderBy("submittedAt", "desc"));
  if (after) constraints.push(startAfter(after));
  constraints.push(limit(pageSize + 1));

  const snap = await getDocs(query(submissionsCol, ...constraints));
  const docs = snap.docs;
  const hasMore = docs.length > pageSize;
  const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;
  return {
    records: pageDocs.map((d) => d.data() as FormSubmission),
    cursor: pageDocs[pageDocs.length - 1] ?? null,
    hasMore,
  };
}

export async function getSubmission(
  id: string,
): Promise<FormSubmission | null> {
  const snap = await getDoc(submissionRef(id));
  return snap.exists() ? (snap.data() as FormSubmission) : null;
}

export async function setSubmissionStatus(
  id: string,
  status: FormSubmission["status"],
): Promise<void> {
  await updateDoc(submissionRef(id), { status });
}

export async function deleteSubmission(id: string): Promise<void> {
  await deleteDoc(submissionRef(id));
}
