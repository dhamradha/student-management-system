"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useConfirm } from "@/components/confirm-dialog";
import { PaginationControls } from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { usePaged } from "@/hooks/use-paged";
import { PAGE_SIZE, type Cursor } from "@/lib/pagination";
import {
  createTeacher,
  deleteTeacher,
  pageTeachers,
} from "@/lib/services/staff";
import { useTranslation } from "@/lib/i18n/provider";
import { newTeacherSchema, type NewTeacherInput } from "@/lib/validations/student";
import type { UserDoc } from "@/types";

export function TeachersManager() {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const [busyUid, setBusyUid] = useState<string | null>(null);

  const form = useForm<NewTeacherInput>({
    resolver: zodResolver(newTeacherSchema),
    defaultValues: { displayName: "", email: "", password: "" },
  });

  const fetchPage = useCallback(
    (after: Cursor) => pageTeachers(PAGE_SIZE, after),
    [],
  );
  const {
    records: teachers,
    loading,
    page,
    hasMore,
    next,
    prev,
    reload,
  } = usePaged<UserDoc>(fetchPage, "teachers");

  async function onAdd(values: NewTeacherInput) {
    try {
      await createTeacher(values);
      toast.success(`${values.displayName} can now sign in.`);
      form.reset();
      reload();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not add teacher.",
      );
    }
  }

  async function onDelete(teacher: UserDoc) {
    const ok = await confirm({
      title: "Revoke access?",
      description: `${teacher.displayName} will lose access and their account will be removed. This cannot be undone.`,
      confirmLabel: t("btn.delete"),
      destructive: true,
    });
    if (!ok) return;
    setBusyUid(teacher.uid);
    try {
      await deleteTeacher(teacher.uid);
      toast.success("Access revoked.");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove.");
    } finally {
      setBusyUid(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="text-primary size-5" />
            {t("teacher.newTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAdd)} className="space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("teacher.name")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.email")}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.password")}</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {t("btn.addTeacher")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("teacher.name")}</TableHead>
              <TableHead>{t("auth.email")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={3}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-muted-foreground py-8 text-center"
                >
                  {t("common.noResults")}
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher.uid}>
                  <TableCell className="font-medium">
                    {teacher.displayName}
                  </TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell className="text-right">
                    <Tooltip label="Remove teacher" className="ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busyUid === teacher.uid}
                        onClick={() => onDelete(teacher)}
                        aria-label={t("btn.delete")}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
        <PaginationControls
          page={page}
          hasMore={hasMore}
          loading={loading}
          onPrev={prev}
          onNext={next}
        />
      </div>
    </div>
  );
}
