"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth/auth-provider";
import { TeacherRecordForm } from "@/features/teacher-records/teacher-record-form";
import { createTeacherRecord } from "@/lib/services/teacher-records";
import type { TeacherInput } from "@/lib/validations/student";

export default function NewTeacherRecordPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  async function onSubmit(values: TeacherInput) {
    if (!user || !profile) return;
    try {
      await createTeacherRecord(values, user.uid, profile.displayName);
      toast.success("Teacher record added.");
      router.push("/teacher-records");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not add teacher record.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">New Teacher Record</CardTitle>
        </CardHeader>
        <CardContent>
          <TeacherRecordForm onSubmit={onSubmit} submitLabel="Add teacher" />
        </CardContent>
      </Card>
    </div>
  );
}
