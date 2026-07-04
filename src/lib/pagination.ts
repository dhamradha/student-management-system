import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

/** A Firestore cursor: the last document snapshot of a page (or null for start). */
export type Cursor = QueryDocumentSnapshot<DocumentData> | null;

export interface Page<T> {
  records: T[];
  cursor: Cursor;
  hasMore: boolean;
}

export const PAGE_SIZE = 20;
