"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentForm } from "@/features/students/student-form";
import {
  getStudent,
  toFormValues,
  updateStudent,
} from "@/lib/services/students";
import { useTranslation } from "@/lib/i18n/provider";
import type { StudentInput } from "@/lib/validations/student";
import type { StudentRecord } from "@/types";

export default function EditStudentPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [record, setRecord] = useState<StudentRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );

  useEffect(() => {
    getStudent(id)
      .then((r) => {
        setRecord(r);
        setStatus(r ? "ready" : "missing");
      })
      .catch(() => setStatus("missing"));
  }, [id]);

  async function onSubmit(values: StudentInput) {
    try {
      await updateStudent(id, values);
      toast.success("Student updated.");
      router.push("/students");
    } catch {
      toast.error("Could not update student.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {t("student.editTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="space-y-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-2/3" />
            </div>
          )}
          {status === "missing" && (
            <p className="text-muted-foreground py-6 text-center">
              {t("common.noResults")}
            </p>
          )}
          {status === "ready" && record && (
            <StudentForm
              defaultValues={toFormValues(record)}
              onSubmit={onSubmit}
              submitLabel={t("btn.save")}
              lockAdmissionNo
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
