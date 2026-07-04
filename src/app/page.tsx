"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck, Users } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: GraduationCap,
      title: t("form1.title"),
      body: "Academic profiles for every grade and class.",
    },
    {
      icon: Users,
      title: t("form2.title"),
      body: "Guardian and emergency contact records.",
    },
    {
      icon: ShieldCheck,
      title: t("nav.teachers"),
      body: "Role-based access, managed by the administrator.",
    },
  ];

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
            <div className="space-y-6">
              <span className="bg-gold/15 text-gold-foreground ring-gold/30 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1">
                {t("app.institution")}
              </span>
              <h1 className="text-primary text-4xl font-bold tracking-tight text-balance md:text-5xl">
                {t("app.title")}
              </h1>
              <p className="text-muted-foreground max-w-prose text-lg">
                {t("app.tagline")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ size: "lg" }), "gap-2")}
                >
                  {t("btn.login")} <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-gold/10 ring-gold/20 rounded-full p-6 ring-1">
                <Image
                  src="/brand/emblem.jpg"
                  alt="Hunuwala Dharmaraja Vidyalaya emblem"
                  width={280}
                  height={280}
                  className="rounded-full shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardContent className="space-y-2 pt-6">
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-muted-foreground text-sm">{body}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="text-muted-foreground mx-auto max-w-6xl px-4 text-center text-sm">
          © {t("app.institution")}
        </div>
      </footer>
    </div>
  );
}
