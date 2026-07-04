"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/features/auth/auth-provider";
import { useTranslation } from "@/lib/i18n/provider";
import type { Role } from "@/types";

/**
 * Client-side route guard. Firestore Security Rules are the real enforcement
 * boundary; this only controls what the UI renders / where it redirects.
 */
export function RoleGate({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (profile?.mustChangePassword) {
      router.replace("/change-password");
    } else if (profile && !allow.includes(profile.role)) {
      router.replace("/");
    }
  }, [loading, user, profile, allow, router]);

  if (
    loading ||
    !user ||
    !profile ||
    profile.mustChangePassword ||
    !allow.includes(profile.role)
  ) {
    return (
      <div className="text-muted-foreground flex min-h-svh items-center justify-center">
        {t("common.loading")}
      </div>
    );
  }

  return <>{children}</>;
}
