"use client";

import { StudentsTable } from "@/features/admin/students-table";
import { useTranslation } from "@/lib/i18n/provider";

export default function AdminConsole() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary text-2xl font-bold">{t("nav.students")}</h1>
        <p className="text-muted-foreground text-sm">
          Verify inbound submissions and filter cohorts by class.
        </p>
      </div>
      <StudentsTable />
    </div>
  );
}
