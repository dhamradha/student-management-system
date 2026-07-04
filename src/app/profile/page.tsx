"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/auth-provider";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  TEACHER: "Teacher",
};

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="text-sm font-medium">{value || "—"}</dd>
    </div>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-primary text-2xl font-bold">{t("nav.profile")}</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground flex size-14 items-center justify-center rounded-full text-lg font-semibold">
              {initials(profile.displayName)}
            </div>
            <div>
              <CardTitle className="text-lg">{profile.displayName}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {ROLE_LABEL[profile.role] ?? profile.role}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <Field label={t("auth.email")} value={profile.email} />
            <Field label="Role" value={ROLE_LABEL[profile.role] ?? profile.role} />
            <Field label="Institution" value={profile.institution} />
          </dl>

          <Separator />

          <div>
            <Link
              href="/change-password"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <KeyRound className="size-4" />
              Change password
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
