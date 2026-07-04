"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { FormBuilder } from "@/features/forms/form-builder";
import { getForm } from "@/lib/services/forms";
import { useTranslation } from "@/lib/i18n/provider";
import type { FormDoc } from "@/types/forms";

export default function EditFormPage() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [form, setForm] = useState<FormDoc | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );

  useEffect(() => {
    getForm(id)
      .then((f) => {
        setForm(f);
        setStatus(f ? "ready" : "missing");
      })
      .catch(() => setStatus("missing"));
  }, [id]);

  return (
    <div className="space-y-6">
      <h1 className="text-primary text-2xl font-bold">Edit Form</h1>
      {status === "loading" && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}
      {status === "missing" && (
        <p className="text-muted-foreground py-6 text-center">
          {t("common.noResults")}
        </p>
      )}
      {status === "ready" && form && <FormBuilder initial={form} formId={id} />}
    </div>
  );
}
