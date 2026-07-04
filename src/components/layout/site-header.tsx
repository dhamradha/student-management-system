"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth/auth-provider";
import { isSuperAdmin } from "@/lib/constants/roles";
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

export function SiteHeader() {
  const { t } = useTranslation();
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const navLinks =
    user && profile
      ? [
          { href: "/students", label: t("nav.students") },
          { href: "/teacher-records", label: t("nav.teacherRecords") },
          { href: "/forms", label: t("nav.forms") },
          ...(isSuperAdmin(profile.role)
            ? [{ href: "/teachers", label: t("nav.teachers") }]
            : []),
        ]
      : [];

  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {user && profile ? (
            <>
              <Tooltip
                label={`${profile.displayName} · ${t("nav.profile")}`}
                side="bottom"
              >
                <Link
                  href="/profile"
                  aria-label={t("nav.profile")}
                  className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-xs font-semibold hover:opacity-90"
                >
                  {initials(profile.displayName)}
                </Link>
              </Tooltip>
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
            <Link href="/login" className={buttonVariants({ size: "sm" })}>
              {t("btn.login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
