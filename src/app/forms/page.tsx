"use client";

import { FormsList } from "@/features/forms/forms-list";
import { useTranslation } from "@/lib/i18n/provider";

export default function FormsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary text-2xl font-bold">{t("nav.forms")}</h1>
        <p className="text-muted-foreground text-sm">
          Build forms, share the link with students, and review submissions.
        </p>
      </div>
      <FormsList />
    </div>
  );
}
