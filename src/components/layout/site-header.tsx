"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { ROLE_HOME } from "@/lib/constants/roles";
import { useTranslation } from "@/lib/i18n/provider";

export function SiteHeader() {
  const { t } = useTranslation();
  const { user, profile, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-2">
          <LanguageSwitcher />
          {user && profile ? (
            <>
              <Button
                render={<Link href={ROLE_HOME[profile.role]} />}
                variant="ghost"
                size="sm"
              >
                {t("nav.dashboard")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <>
              <Button render={<Link href="/login" />} variant="ghost" size="sm">
                {t("btn.login")}
              </Button>
              <Button render={<Link href="/register" />} size="sm">
                {t("btn.register")}
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
