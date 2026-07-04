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
import { StudentForm } from "@/features/students/student-form";
import { createStudent } from "@/lib/services/students";
import { useTranslation } from "@/lib/i18n/provider";
import type { StudentInput } from "@/lib/validations/student";

export default function NewStudentPage() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const router = useRouter();

  async function onSubmit(values: StudentInput) {
    if (!user || !profile) return;
    try {
      await createStudent(values, user.uid, profile.displayName);
      toast.success("Student added.");
      router.push("/students");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not add student.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{t("student.newTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentForm onSubmit={onSubmit} submitLabel={t("btn.addStudent")} />
        </CardContent>
      </Card>
    </div>
  );
}
