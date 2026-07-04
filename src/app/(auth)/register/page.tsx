"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/auth-provider";
import { useTranslation } from "@/lib/i18n/provider";
import { registerSchema, type RegisterInput } from "@/lib/validations/student";

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  if (code.includes("email-already-in-use"))
    return "An account with this admission number already exists.";
  if (code.includes("weak-password")) return "Password is too weak.";
  return "Registration failed. Please try again.";
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const { registerStudent } = useAuth();
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { admissionNo: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterInput) {
    try {
      await registerStudent(values.admissionNo, values.password);
      toast.success("Account created. Let's complete your profile.");
      router.push("/dashboard");
    } catch (err) {
      toast.error(friendlyError(err));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary text-2xl">
          {t("auth.registerTitle")}
        </CardTitle>
        <CardDescription>{t("app.institution")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="admissionNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.admissionNo")}</FormLabel>
                  <FormControl>
                    <Input inputMode="numeric" placeholder="9732" {...field} />
                  </FormControl>
                  <FormDescription>
                    You will use this number to log in.
                  </FormDescription>
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
              {t("btn.register")}
            </Button>
          </form>
        </Form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="text-primary font-medium underline">
            {t("btn.login")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
