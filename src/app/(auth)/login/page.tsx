"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/auth-provider";
import { useTranslation } from "@/lib/i18n/provider";
import { loginSchema } from "@/lib/validations/student";

const staffSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  if (code.includes("invalid-credential") || code.includes("wrong-password"))
    return "Incorrect credentials. Please try again.";
  if (code.includes("user-not-found")) return "No account found.";
  if (code.includes("too-many-requests"))
    return "Too many attempts. Try again later.";
  return "Sign-in failed. Please try again.";
}

export default function LoginPage() {
  const { t } = useTranslation();
  const { loginWithAdmission, loginWithEmail } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("student");

  const studentForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { admissionNo: "", password: "" },
  });

  const staffForm = useForm<z.infer<typeof staffSchema>>({
    resolver: zodResolver(staffSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onStudent(values: z.infer<typeof loginSchema>) {
    try {
      await loginWithAdmission(values.admissionNo, values.password);
      router.push("/dashboard");
    } catch (err) {
      toast.error(friendlyError(err));
    }
  }

  async function onStaff(values: z.infer<typeof staffSchema>) {
    try {
      await loginWithEmail(values.email, values.password);
      router.push("/dashboard");
    } catch (err) {
      toast.error(friendlyError(err));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary text-2xl">
          {t("auth.loginTitle")}
        </CardTitle>
        <CardDescription>{t("app.institution")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="student">{t("nav.students")}</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <Form {...studentForm}>
              <form
                onSubmit={studentForm.handleSubmit(onStudent)}
                className="space-y-4"
              >
                <FormField
                  control={studentForm.control}
                  name="admissionNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.admissionNo")}</FormLabel>
                      <FormControl>
                        <Input inputMode="numeric" placeholder="9732" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={studentForm.control}
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
                  disabled={studentForm.formState.isSubmitting}
                >
                  {t("btn.login")}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="staff">
            <Form {...staffForm}>
              <form
                onSubmit={staffForm.handleSubmit(onStaff)}
                className="space-y-4"
              >
                <FormField
                  control={staffForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@school.lk" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={staffForm.control}
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
                  disabled={staffForm.formState.isSubmitting}
                >
                  {t("btn.login")}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="text-primary font-medium underline">
            {t("btn.register")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
