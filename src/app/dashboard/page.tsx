"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { ROLE_HOME } from "@/lib/constants/roles";
import { useTranslation } from "@/lib/i18n/provider";

/** Post-login router: sends each user to their role's home (SRS §3). */
export default function DashboardRedirect() {
  const { user, profile, loading, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (profile?.mustChangePassword) router.replace("/change-password");
    else if (profile) router.replace(ROLE_HOME[profile.role]);
  }, [loading, user, profile, router]);

  // Signed in, finished loading, but no profile could be read/created — most
  // likely the Firestore security rules haven't been deployed. Surface it
  // instead of spinning forever.
  if (!loading && user && !profile) {
    return (
      <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold">Could not load your profile</p>
        <p className="text-muted-foreground text-sm">
          Your account exists but its data could not be read. If you are the
          administrator, deploy the Firestore security rules
          (<code>firebase deploy --only firestore:rules</code>) and try again.
        </p>
        <Button
          variant="outline"
          onClick={async () => {
            await logout();
            router.replace("/login");
          }}
        >
          {t("nav.logout")}
        </Button>
      </div>
    );
  }

  return (
    <div className="text-muted-foreground flex min-h-svh items-center justify-center">
      {t("common.loading")}
    </div>
  );
}
