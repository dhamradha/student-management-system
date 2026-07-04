"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, ShieldAlert, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentsTable } from "@/features/admin/students-table";
import { listStudents } from "@/lib/services/users";
import { useTranslation } from "@/lib/i18n/provider";
import type { UserDoc } from "@/types";

export default function SuperAdminConsole() {
  const { t } = useTranslation();
  const [students, setStudents] = useState<UserDoc[] | null>(null);

  useEffect(() => {
    listStudents()
      .then(setStudents)
      .catch(() => setStudents([]));
  }, []);

  const stats = useMemo(() => {
    const list = students ?? [];
    return {
      total: list.length,
      pending: list.filter((s) => s.status === "pending").length,
      approved: list.filter((s) => s.status === "approved").length,
    };
  }, [students]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-primary text-2xl font-bold">{t("nav.dashboard")}</h1>
        <p className="text-muted-foreground text-sm">
          Full oversight — verify submissions, manage roles, review activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Users}
          label={t("nav.students")}
          value={stats.total}
          loading={students === null}
        />
        <StatCard
          icon={Clock}
          label={t("status.pending")}
          value={stats.pending}
          loading={students === null}
        />
        <StatCard
          icon={CheckCircle2}
          label={t("status.approved")}
          value={stats.approved}
          loading={students === null}
        />
      </div>

      <StudentsTable />

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldAlert className="text-primary size-5" />
            Manage Admin Roles
          </CardTitle>
          <CardDescription>
            Role changes run through a secured server action using the Firebase
            Admin SDK (see <code>src/lib/firebase/admin.ts</code>). Wire the
            role-assignment endpoint here to promote staff to ADMIN.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-muted-foreground text-xs">{label}</p>
          {loading ? (
            <Skeleton className="mt-1 h-7 w-12" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
