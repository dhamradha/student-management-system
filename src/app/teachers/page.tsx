"use client";

import { TeachersManager } from "@/features/teachers/teachers-manager";
import { useTranslation } from "@/lib/i18n/provider";

export default function TeachersPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary text-2xl font-bold">{t("teacher.title")}</h1>
        <p className="text-muted-foreground text-sm">
          Grant or revoke teacher access to the system.
        </p>
      </div>
      <TeachersManager />
    </div>
  );
}
