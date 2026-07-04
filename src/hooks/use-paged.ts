"use client";

import { useCallback, useEffect, useState } from "react";

import type { Cursor, Page } from "@/lib/pagination";

/**
 * Cursor-based pagination over a Firestore query. `fetchPage(after)` runs a
 * query starting after the given cursor; the hook tracks per-page start cursors
 * so it can page forward and back. It re-fetches from page 1 whenever
 * `resetKey` changes (e.g. when filters change).
 */
export function usePaged<T>(
  fetchPage: (after: Cursor) => Promise<Page<T>>,
  resetKey: string,
) {
  const [records, setRecords] = useState<T[]>([]);
  const [starts, setStarts] = useState<Cursor[]>([null]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastCursor, setLastCursor] = useState<Cursor>(null);

  const loadPage = useCallback(
    async (after: Cursor) => {
      setLoading(true);
      try {
        const res = await fetchPage(after);
        setRecords(res.records);
        setHasMore(res.hasMore);
        setLastCursor(res.cursor);
      } finally {
        setLoading(false);
      }
    },
    [fetchPage],
  );

  useEffect(() => {
    setStarts([null]);
    setPage(0);
    void loadPage(null);
    // Reset only when the caller signals it (filters/query changed).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const next = useCallback(() => {
    if (!hasMore) return;
    setStarts((s) => {
      const n = [...s];
      n[page + 1] = lastCursor;
      return n;
    });
    setPage((p) => p + 1);
    void loadPage(lastCursor);
  }, [hasMore, lastCursor, page, loadPage]);

  const prev = useCallback(() => {
    if (page === 0) return;
    const target = page - 1;
    setPage(target);
    void loadPage(starts[target]);
  }, [page, starts, loadPage]);

  const reload = useCallback(() => loadPage(starts[page]), [loadPage, starts, page]);

  return { records, loading, page, hasMore, next, prev, reload };
}
