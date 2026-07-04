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
import { TeacherRecordForm } from "@/features/teacher-records/teacher-record-form";
import {
  getTeacherRecord,
  toTeacherFormValues,
  updateTeacherRecord,
} from "@/lib/services/teacher-records";
import { useTranslation } from "@/lib/i18n/provider";
import type { TeacherInput } from "@/lib/validations/student";
import type { TeacherRecord } from "@/types";

export default function EditTeacherRecordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [record, setRecord] = useState<TeacherRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );

  useEffect(() => {
    getTeacherRecord(id)
      .then((r) => {
        setRecord(r);
        setStatus(r ? "ready" : "missing");
      })
      .catch(() => setStatus("missing"));
  }, [id]);

  async function onSubmit(values: TeacherInput) {
    try {
      await updateTeacherRecord(id, values);
      toast.success("Teacher record updated.");
      router.push("/teacher-records");
    } catch {
      toast.error("Could not update the record.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Edit Teacher Record</CardTitle>
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
            <TeacherRecordForm
              defaultValues={toTeacherFormValues(record)}
              onSubmit={onSubmit}
              submitLabel={t("btn.save")}
              lockNic
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
