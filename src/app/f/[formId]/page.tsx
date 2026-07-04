"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicForm } from "@/features/forms/public-form";
import { getPublishedForm } from "@/lib/services/forms";
import { useTranslation } from "@/lib/i18n/provider";
import type { FormDoc } from "@/types/forms";

export default function PublicFormPage() {
  const { t } = useTranslation();
  const params = useParams<{ formId: string }>();
  const [form, setForm] = useState<FormDoc | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    "loading",
  );

  useEffect(() => {
    getPublishedForm(params.formId)
      .then((f) => {
        setForm(f);
        setStatus(f ? "ready" : "unavailable");
      })
      .catch(() => setStatus("unavailable"));
  }, [params.formId]);

  return (
    <div className="from-primary/5 flex min-h-svh flex-col bg-gradient-to-b to-transparent">
      <header className="flex items-center justify-between px-4 py-4">
        <Logo />
        <LanguageSwitcher />
      </header>

      <main className="flex flex-1 justify-center p-4">
        <div className="w-full max-w-2xl">
          {status === "loading" && (
            <Card>
              <CardContent className="space-y-4 py-6">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          )}
          {status === "unavailable" && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-lg font-semibold">Form unavailable</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  This form is closed or the link is invalid.
                </p>
              </CardContent>
            </Card>
          )}
          {status === "ready" && form && <PublicForm form={form} />}
        </div>
      </main>

      <footer className="text-muted-foreground py-6 text-center text-sm">
        © {t("app.institution")}
      </footer>
    </div>
  );
}
