"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
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
import {
  AL_STREAMS,
  GRADES,
  OL_CLASSES,
} from "@/lib/constants/academic";
import { listStudents, setApproval } from "@/lib/services/users";
import { useTranslation } from "@/lib/i18n/provider";
import type { ApprovalStatus, UserDoc } from "@/types";

const ALL = "all";
const SUB_DIVISIONS = [...OL_CLASSES, ...AL_STREAMS];
const STATUSES: ApprovalStatus[] = [
  "incomplete",
  "pending",
  "approved",
  "rejected",
];

export function StudentsTable() {
  const { t } = useTranslation();
  const [students, setStudents] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyUid, setBusyUid] = useState<string | null>(null);
  const [grade, setGrade] = useState(ALL);
  const [classStream, setClassStream] = useState(ALL);
  const [status, setStatus] = useState(ALL);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listStudents({
        grade: grade === ALL ? undefined : grade,
        classStream: classStream === ALL ? undefined : classStream,
        status: status === ALL ? undefined : (status as ApprovalStatus),
      });
      setStudents(data);
    } catch {
      toast.error("Could not load students. Check your access / rules.");
    } finally {
      setLoading(false);
    }
  }, [grade, classStream, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function decide(uid: string, decision: "approved" | "rejected") {
    setBusyUid(uid);
    try {
      await setApproval(uid, decision);
      setStudents((prev) =>
        prev.map((s) =>
          s.uid === uid
            ? { ...s, status: decision, isApproved: decision === "approved" }
            : s,
        ),
      );
      toast.success(
        decision === "approved" ? t("status.approved") : t("status.rejected"),
      );
    } catch {
      toast.error("Action failed.");
    } finally {
      setBusyUid(null);
    }
  }

  return (
    <div className="space-y-4">
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
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={STATUSES}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("form1.fullName")}</TableHead>
              <TableHead>{t("form1.admissionNo")}</TableHead>
              <TableHead>{t("form1.grade")}</TableHead>
              <TableHead>{t("form1.classStream")}</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground py-8 text-center"
                >
                  No students match these filters.
                </TableCell>
              </TableRow>
            ) : (
              students.map((s) => (
                <TableRow key={s.uid}>
                  <TableCell className="font-medium">
                    {s.academicData?.fullName ?? "—"}
                  </TableCell>
                  <TableCell>{s.admissionNo ?? "—"}</TableCell>
                  <TableCell>{s.academicData?.grade ?? "—"}</TableCell>
                  <TableCell>{s.academicData?.classStream ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {s.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          disabled={busyUid === s.uid}
                          onClick={() => decide(s.uid, "approved")}
                        >
                          {t("btn.approve")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyUid === s.uid}
                          onClick={() => decide(s.uid, "rejected")}
                        >
                          {t("btn.reject")}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
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
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? ALL)}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label}: All</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
