"use client";

import { StudentsTable } from "@/features/students/students-table";
import { useTranslation } from "@/lib/i18n/provider";

export default function StudentsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary text-2xl font-bold">{t("nav.students")}</h1>
        <p className="text-muted-foreground text-sm">
          Manage student records, filter by grade and class.
        </p>
      </div>
      <StudentsTable />
    </div>
  );
}
