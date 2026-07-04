"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useConfirm } from "@/components/confirm-dialog";
import { PaginationControls } from "@/components/pagination-controls";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { usePaged } from "@/hooks/use-paged";
import { PAGE_SIZE, type Cursor } from "@/lib/pagination";
import {
  deleteTeacherRecord,
  pageTeacherRecords,
} from "@/lib/services/teacher-records";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { TeacherRecord } from "@/types";

export function TeacherRecordsTable() {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchPage = useCallback(
    (after: Cursor) => pageTeacherRecords(PAGE_SIZE, after),
    [],
  );
  const { records, loading, page, hasMore, next, prev, reload } =
    usePaged<TeacherRecord>(fetchPage, "teacher-records");

  async function handleDelete(record: TeacherRecord) {
    const ok = await confirm({
      title: "Delete this teacher record?",
      description: `${record.profile.fullName}'s record will be permanently removed. This cannot be undone.`,
      confirmLabel: t("btn.delete"),
      destructive: true,
    });
    if (!ok) return;
    setBusyId(record.id);
    try {
      await deleteTeacherRecord(record.id);
      toast.success("Teacher record removed.");
      reload();
    } catch {
      toast.error("Could not delete this record.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/teacher-records/new"
          className={cn(buttonVariants(), "gap-2")}
        >
          <Plus className="size-4" /> Add teacher
        </Link>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>NIC</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-8 text-center"
                >
                  {t("common.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    {r.profile.fullName}
                  </TableCell>
                  <TableCell>{r.profile.nic}</TableCell>
                  <TableCell>{r.profile.subject || "—"}</TableCell>
                  <TableCell>{r.profile.contactNo || "—"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Tooltip label={t("btn.edit")}>
                        <Link
                          href={`/teacher-records/${r.id}`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                          aria-label={t("btn.edit")}
                        >
                          <Pencil className="size-4" />
                        </Link>
                      </Tooltip>
                      <Tooltip label={t("btn.delete")}>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busyId === r.id}
                          onClick={() => handleDelete(r)}
                          aria-label={t("btn.delete")}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        page={page}
        hasMore={hasMore}
        loading={loading}
        onPrev={prev}
        onNext={next}
      />
    </div>
  );
}
