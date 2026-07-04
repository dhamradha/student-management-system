"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth/auth-provider";
import { AcademicForm } from "@/features/onboarding/academic-form";
import { GuardianForm } from "@/features/onboarding/guardian-form";
import { saveAcademicData, saveGuardianData } from "@/lib/services/users";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { AcademicInput, GuardianInput } from "@/lib/validations/student";

export function OnboardingWizard() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const router = useRouter();

  // Resume at the guardian phase if academic data is already saved.
  const [step, setStep] = useState<1 | 2>(
    profile && profile.onboardingStep >= 1 ? 2 : 1,
  );

  if (!user || !profile) return null;

  async function handleAcademic(values: AcademicInput) {
    if (!user) return;
    try {
      await saveAcademicData(user.uid, values);
      setStep(2);
    } catch {
      toast.error("Could not save academic details. Please try again.");
    }
  }

  async function handleGuardian(values: GuardianInput) {
    if (!user) return;
    try {
      await saveGuardianData(user.uid, values);
      toast.success("Application submitted for verification.");
      router.push("/student");
    } catch {
      toast.error("Could not submit application. Please try again.");
    }
  }

  const steps = [
    { n: 1, label: t("form1.title") },
    { n: 2, label: t("form2.title") },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex items-center gap-3">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                  step >= s.n
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {s.n}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  step === s.n ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s.label}
              </span>
              {i === 0 && <div className="bg-border h-px w-8" />}
            </div>
          ))}
        </div>
        <CardTitle className="text-primary">
          {step === 1 ? t("form1.title") : t("form2.title")}
        </CardTitle>
        <CardDescription>
          {t("app.institution")} · {t("status.pending")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <AcademicForm
            defaultValues={{
              admissionNo: profile.admissionNo ?? "",
              ...((profile.academicData ?? undefined) as
                | Partial<AcademicInput>
                | undefined),
            }}
            onSubmit={handleAcademic}
          />
        ) : (
          <GuardianForm
            defaultValues={profile.guardianData ?? {}}
            onSubmit={handleGuardian}
            onBack={() => setStep(1)}
          />
        )}
      </CardContent>
    </Card>
  );
}
