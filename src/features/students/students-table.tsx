"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AL_STREAMS, GRADES, OL_CLASSES } from "@/lib/constants/academic";
import { deleteStudent, listStudents } from "@/lib/services/students";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { StudentRecord } from "@/types";

const ALL = "all";
const SUB_DIVISIONS = [...OL_CLASSES, ...AL_STREAMS];

export function StudentsTable() {
  const { t } = useTranslation();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [grade, setGrade] = useState(ALL);
  const [classStream, setClassStream] = useState(ALL);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setStudents(
        await listStudents({
          grade: grade === ALL ? undefined : grade,
          classStream: classStream === ALL ? undefined : classStream,
        }),
      );
    } catch {
      toast.error("Could not load students.");
    } finally {
      setLoading(false);
    }
  }, [grade, classStream]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(record: StudentRecord) {
    if (!window.confirm(t("common.confirmDelete"))) return;
    setBusyId(record.id);
    try {
      await deleteStudent(record.id);
      setStudents((prev) => prev.filter((s) => s.id !== record.id));
      toast.success("Student removed.");
    } catch {
      toast.error("Could not delete this student.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <FilterSelect
            label={t("form1.grade")}
            value={grade}
            onChange={setGrade}
            options={GRADES as readonly string[]}
          />
          <FilterSelect
            label={t("form1.classStream")}
            value={classStream}
            onChange={setClassStream}
            options={SUB_DIVISIONS}
          />
        </div>
        <Link
          href="/students/new"
          className={cn(buttonVariants(), "gap-2")}
        >
          <Plus className="size-4" />
          {t("btn.addStudent")}
        </Link>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("form1.fullName")}</TableHead>
              <TableHead>{t("form1.admissionNo")}</TableHead>
              <TableHead>{t("form1.grade")}</TableHead>
              <TableHead>{t("form1.classStream")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-8 text-center"
                >
                  {t("common.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    {s.academicData.fullName}
                  </TableCell>
                  <TableCell>{s.academicData.admissionNo}</TableCell>
                  <TableCell>{s.academicData.grade}</TableCell>
                  <TableCell>{s.academicData.classStream}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/students/${s.id}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                        aria-label={t("btn.edit")}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busyId === s.id}
                        onClick={() => handleDelete(s)}
                        aria-label={t("btn.delete")}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  const { t } = useTranslation();
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? "all")}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          {label}: {t("common.all")}
        </SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
