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
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/provider";
import { guardianSchema, type GuardianInput } from "@/lib/validations/student";

interface Props {
  defaultValues?: Partial<GuardianInput>;
  onSubmit: (values: GuardianInput) => Promise<void> | void;
  onBack: () => void;
}

export function GuardianForm({ defaultValues, onSubmit, onBack }: Props) {
  const { t } = useTranslation();

  const form = useForm<GuardianInput>({
    resolver: zodResolver(guardianSchema),
    defaultValues: {
      guardianName: "",
      contactNo: "",
      address: "",
      emergencyName: "",
      emergencyPhone: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="guardianName"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("form2.guardianName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form2.contactNo")}</FormLabel>
                <FormControl>
                  <Input inputMode="tel" placeholder="0771234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergencyPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form2.emergencyPhone")}</FormLabel>
                <FormControl>
                  <Input inputMode="tel" placeholder="0771234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergencyName"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("form2.emergencyName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("form2.address")}</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            {t("btn.back")}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {t("btn.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
