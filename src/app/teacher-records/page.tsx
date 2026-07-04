"use client";

import { TeacherRecordsTable } from "@/features/teacher-records/teacher-records-table";
import { useTranslation } from "@/lib/i18n/provider";

export default function TeacherRecordsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary text-2xl font-bold">
          {t("nav.teacherRecords")}
        </h1>
        <p className="text-muted-foreground text-sm">
          Directory of teacher details (profile data — not login accounts).
        </p>
      </div>
      <TeacherRecordsTable />
    </div>
  );
}
