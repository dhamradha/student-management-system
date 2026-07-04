"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/features/auth/auth-provider";
import { ROLE_HOME } from "@/lib/constants/roles";
import { useTranslation } from "@/lib/i18n/provider";

/** Post-login router: sends each user to their role's home (SRS §3). */
export default function DashboardRedirect() {
  const { user, profile, loading } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (profile) router.replace(ROLE_HOME[profile.role]);
  }, [loading, user, profile, router]);

  return (
    <div className="text-muted-foreground flex min-h-svh items-center justify-center">
      {t("common.loading")}
    </div>
  );
}
