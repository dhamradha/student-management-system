"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { useConfirm } from "@/components/confirm-dialog";
import { PaginationControls } from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/features/auth/auth-provider";
import { StudentForm } from "@/features/students/student-form";
import { TeacherRecordForm } from "@/features/teacher-records/teacher-record-form";
import { usePaged } from "@/hooks/use-paged";
import { PAGE_SIZE, type Cursor } from "@/lib/pagination";
import { getForm } from "@/lib/services/forms";
import { createStudent } from "@/lib/services/students";
import { createTeacherRecord } from "@/lib/services/teacher-records";
import {
  deleteSubmission,
  pageSubmissions,
  setSubmissionStatus,
} from "@/lib/services/submissions";
import { useTranslation } from "@/lib/i18n/provider";
import type { StudentInput, TeacherInput } from "@/lib/validations/student";
import type { FormDoc, FormSubmission } from "@/types/forms";

export function SubmissionsReview({ formId }: { formId: string }) {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const confirm = useConfirm();

  const [form, setForm] = useState<FormDoc | null>(null);
  const [active, setActive] = useState<FormSubmission | null>(null);

  useEffect(() => {
    getForm(formId).then(setForm).catch(() => setForm(null));
  }, [formId]);

  const fetchPage = useCallback(
    (after: Cursor) =>
      pageSubmissions({ formId, status: "pending" }, PAGE_SIZE, after),
    [formId],
  );
  const { records, loading, page, hasMore, next, prev, reload } =
    usePaged<FormSubmission>(fetchPage, `submissions:${formId}`);

  async function reject(sub: FormSubmission) {
    const ok = await confirm({
      title: "Reject this submission?",
      description:
        "The submission will be removed. The person can then submit the form " +
        "again with corrected details.",
      confirmLabel: t("btn.reject"),
      destructive: true,
    });
    if (!ok) return;
    try {
      // Delete so the identity slot frees up and a corrected resubmission is
      // possible.
      await deleteSubmission(sub.id);
      toast.success("Submission rejected.");
      reload();
    } catch {
      toast.error("Action failed.");
    }
  }

  async function finalizeApproval(id: string) {
    // Keep the (now approved) submission so its identity-keyed id stays
    // reserved — this blocks the same person from submitting the form again.
    await setSubmissionStatus(id, "approved");
    toast.success("Record added from submission.");
    setActive(null);
    reload();
  }

  async function approveStudent(values: StudentInput) {
    if (!user || !profile || !active) return;
    try {
      await createStudent(values, user.uid, profile.displayName);
      await finalizeApproval(active.id);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not approve submission.",
      );
    }
  }

  async function approveTeacher(values: TeacherInput) {
    if (!user || !profile || !active) return;
    try {
      await createTeacherRecord(values, user.uid, profile.displayName);
      await finalizeApproval(active.id);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not approve submission.",
      );
    }
  }

  if (active && form) {
    const isTeacher = form.target === "teacher";
    const studentDefaults = {
      ...active.mapped,
      grade: active.grade,
      classStream: active.classStream ?? active.mapped.classStream ?? "",
    } as unknown as Partial<StudentInput>;
    const teacherDefaults = {
      ...active.mapped,
    } as unknown as Partial<TeacherInput>;
    return (
      <div className="space-y-4">
        <Button variant="ghost" className="gap-2" onClick={() => setActive(null)}>
          <ArrowLeft className="size-4" /> {t("btn.back")}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submitted answers</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              {form.fields.map((field) => {
                const v = active.answers[field.id];
                return (
                  <div key={field.id}>
                    <dt className="text-muted-foreground text-xs">
                      {field.label}
                    </dt>
                    <dd className="text-sm font-medium">
                      {Array.isArray(v) ? v.join(", ") : v || "—"}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Review & save as {isTeacher ? "teacher" : "student"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isTeacher ? (
              <TeacherRecordForm
                defaultValues={teacherDefaults}
                onSubmit={approveTeacher}
                submitLabel="Approve & save"
              />
            ) : (
              <StudentForm
                defaultValues={studentDefaults}
                onSubmit={approveStudent}
                submitLabel="Approve & save"
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submitted</TableHead>
              <TableHead>{t("form1.fullName")}</TableHead>
              <TableHead>{t("form1.admissionNo")}</TableHead>
              <TableHead>{t("form1.grade")}</TableHead>
              <TableHead className="text-right">
                {t("common.actions")}
              </TableHead>
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
                  No pending submissions.
                </TableCell>
              </TableRow>
            ) : (
              records.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {sub.mapped.fullName ?? "—"}
                  </TableCell>
                  <TableCell>{sub.mapped.admissionNo ?? "—"}</TableCell>
                  <TableCell>
                    {sub.grade}
                    {sub.classStream ? ` / ${sub.classStream}` : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={() => setActive(sub)}>
                        Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => reject(sub)}
                      >
                        {t("btn.reject")}
                      </Button>
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
