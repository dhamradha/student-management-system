"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  page: number; // zero-based
  hasMore: boolean;
  loading?: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function PaginationControls({
  page,
  hasMore,
  loading,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-muted-foreground text-sm">Page {page + 1}</span>
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={page === 0 || loading}
        onClick={onPrev}
      >
        <ChevronLeft className="size-4" /> Prev
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={!hasMore || loading}
        onClick={onNext}
      >
        Next <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
