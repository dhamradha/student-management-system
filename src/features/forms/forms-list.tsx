"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Copy, Inbox, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useConfirm } from "@/components/confirm-dialog";
import { PaginationControls } from "@/components/pagination-controls";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { usePaged } from "@/hooks/use-paged";
import { PAGE_SIZE, type Cursor } from "@/lib/pagination";
import { deleteForm, pageForms } from "@/lib/services/forms";
import { useTranslation } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { FormDoc } from "@/types/forms";

export function FormsList() {
  const { t } = useTranslation();
  const router = useRouter();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchPage = useCallback(
    (after: Cursor) => pageForms(PAGE_SIZE, after),
    [],
  );
  const { records: forms, loading, page, hasMore, next, prev, reload } =
    usePaged<FormDoc>(fetchPage, "forms");

  async function copyLink(id: string) {
    const url = `${window.location.origin}/f/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied.");
    } catch {
      toast.message(url);
    }
  }

  async function handleEdit(form: FormDoc) {
    if (form.status === "published") {
      const ok = await confirm({
        title: "Edit a published form?",
        description:
          "This form is live and may already have student responses. Editing " +
          "its fields can change or misalign those submissions.",
        confirmLabel: "Continue editing",
      });
      if (!ok) return;
    }
    router.push(`/forms/${form.id}/edit`);
  }

  async function handleDelete(form: FormDoc) {
    const ok = await confirm({
      title: "Delete this form?",
      description:
        form.status === "published"
          ? "This published form may already have student responses. Deleting it " +
            "removes the form and unlinks its submissions. This cannot be undone."
          : "This form will be permanently removed. This cannot be undone.",
      confirmLabel: t("btn.delete"),
      destructive: true,
    });
    if (!ok) return;
    setBusyId(form.id);
    try {
      await deleteForm(form.id);
      toast.success("Form deleted.");
      reload();
    } catch {
      toast.error("Could not delete the form.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/forms/new" className={cn(buttonVariants(), "gap-2")}>
          <Plus className="size-4" /> New form
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : forms.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed py-16 text-center">
          {t("common.noResults")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="flex flex-col overflow-visible">
              <CardHeader className="gap-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">
                    {form.title}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 font-medium capitalize",
                      form.status === "published"
                        ? "border-green-600/30 bg-green-600/15 text-green-700"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {form.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-primary font-medium capitalize"
                  >
                    {form.target}
                  </Badge>
                  {form.grades.map((g) => (
                    <Badge key={g} variant="secondary" className="font-normal">
                      Grade {g}
                    </Badge>
                  ))}
                  {form.classStreams.map((c) => (
                    <Badge
                      key={c}
                      variant="outline"
                      className="text-muted-foreground font-normal"
                    >
                      {c}
                    </Badge>
                  ))}
                </div>
                <p className="text-muted-foreground mt-3 text-xs">
                  {form.fields.length} field{form.fields.length === 1 ? "" : "s"}
                </p>
              </CardContent>

              <CardFooter className="gap-1.5">
                {form.status === "published" && (
                  <Tooltip label="Copy share link">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyLink(form.id)}
                      aria-label="Copy share link"
                    >
                      <Copy className="size-4" />
                    </Button>
                  </Tooltip>
                )}
                <Tooltip label="Submissions">
                  <Link
                    href={`/forms/${form.id}/submissions`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                    aria-label="Submissions"
                  >
                    <Inbox className="size-4" />
                  </Link>
                </Tooltip>
                <Tooltip label={t("btn.edit")}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(form)}
                    aria-label={t("btn.edit")}
                  >
                    <Pencil className="size-4" />
                  </Button>
                </Tooltip>
                <Tooltip label={t("btn.delete")} className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busyId === form.id}
                    onClick={() => handleDelete(form)}
                    aria-label={t("btn.delete")}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </Tooltip>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <PaginationControls
        page={page}
        hasMore={hasMore}
        loading={loading}
        onPrev={prev}
        onNext={next}
      />
    </div>
  );
}
