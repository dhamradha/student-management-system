"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADES, getSubDivisions } from "@/lib/constants/academic";
import { useTranslation } from "@/lib/i18n/provider";
import { academicSchema, type AcademicInput } from "@/lib/validations/student";

interface Props {
  defaultValues?: Partial<AcademicInput>;
  onSubmit: (values: AcademicInput) => Promise<void> | void;
}

const GENDERS = ["Male", "Female", "Other"] as const;

export function AcademicForm({ defaultValues, onSubmit }: Props) {
  const { t } = useTranslation();

  const form = useForm<AcademicInput>({
    resolver: zodResolver(academicSchema),
    defaultValues: {
      fullName: "",
      nameWithInitials: "",
      admissionNo: "",
      grade: undefined,
      classStream: "",
      dob: "",
      gender: undefined,
      ...defaultValues,
    },
  });

  const grade = form.watch("grade");
  const subDivisions = grade ? getSubDivisions(grade) : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("form1.fullName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameWithInitials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form1.nameWithInitials")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admissionNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form1.admissionNo")}</FormLabel>
                <FormControl>
                  <Input inputMode="numeric" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form1.grade")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    form.setValue("classStream", "");
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("common.selectPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classStream"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form1.classStream")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!grade}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("common.selectPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subDivisions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form1.dob")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form1.gender")}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("common.selectPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {t(`gender.${g}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {t("btn.next")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
