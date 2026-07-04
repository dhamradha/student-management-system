"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { ApprovalStatus } from "@/types";

const STYLES: Record<ApprovalStatus, string> = {
  incomplete: "bg-muted text-muted-foreground",
  pending: "bg-gold/20 text-gold-foreground border-gold/40",
  approved: "bg-green-600/15 text-green-700 border-green-600/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const LABEL_KEY = {
  incomplete: "status.incomplete",
  pending: "status.pending",
  approved: "status.approved",
  rejected: "status.rejected",
} as const;

export function StatusBadge({ status }: { status: ApprovalStatus }) {
  const { t } = useTranslation();
  return (
    <Badge variant="outline" className={cn("font-medium", STYLES[status])}>
      {t(LABEL_KEY[status])}
    </Badge>
  );
}
