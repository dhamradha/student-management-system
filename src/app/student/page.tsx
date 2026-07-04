"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/auth-provider";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}

export default function StudentDashboard() {
  const { t } = useTranslation();
  const { profile } = useAuth();

  if (!profile) return null;

  const incomplete = profile.onboardingStep < 2;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary text-2xl font-bold">
            {profile.academicData?.fullName || t("nav.dashboard")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("form1.admissionNo")}: {profile.admissionNo ?? "—"}
          </p>
        </div>
        <StatusBadge status={profile.status} />
      </div>

      {incomplete ? (
        <Card className="border-gold/40 bg-gold/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="text-gold-foreground size-5" />
              {t("form1.title")}
            </CardTitle>
            <CardDescription>
              Complete the two-step onboarding to submit your profile for
              verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/student/onboarding"
              className={cn(buttonVariants(), "gap-2")}
            >
              {t("btn.next")} <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {profile.status === "approved" && (
            <Card className="border-green-600/30 bg-green-600/5">
              <CardContent className="flex items-center gap-3 pt-6">
                <CheckCircle2 className="size-5 text-green-700" />
                <p className="text-sm font-medium text-green-800">
                  {t("status.approved")}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("form1.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={t("form1.fullName")}
                  value={profile.academicData?.fullName}
                />
                <Field
                  label={t("form1.nameWithInitials")}
                  value={profile.academicData?.nameWithInitials}
                />
                <Field
                  label={t("form1.grade")}
                  value={profile.academicData?.grade}
                />
                <Field
                  label={t("form1.classStream")}
                  value={profile.academicData?.classStream}
                />
                <Field
                  label={t("form1.dob")}
                  value={profile.academicData?.dob}
                />
                <Field
                  label={t("form1.gender")}
                  value={
                    profile.academicData
                      ? t(`gender.${profile.academicData.gender}`)
                      : "—"
                  }
                />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("form2.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={t("form2.guardianName")}
                  value={profile.guardianData?.guardianName}
                />
                <Field
                  label={t("form2.contactNo")}
                  value={profile.guardianData?.contactNo}
                />
                <div className="sm:col-span-2">
                  <Field
                    label={t("form2.address")}
                    value={profile.guardianData?.address}
                  />
                </div>
                <Separator className="sm:col-span-2" />
                <Field
                  label={t("form2.emergencyName")}
                  value={profile.guardianData?.emergencyName}
                />
                <Field
                  label={t("form2.emergencyPhone")}
                  value={profile.guardianData?.emergencyPhone}
                />
              </dl>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
