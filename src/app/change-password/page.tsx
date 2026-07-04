"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
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
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/features/auth/auth-provider";
import { auth, db } from "@/lib/firebase/client";
import { ROLE_HOME } from "@/lib/constants/roles";
import { useTranslation } from "@/lib/i18n/provider";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const { t } = useTranslation();
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: FormValues) {
    const current = auth.currentUser;
    if (!current) return;
    try {
      await updatePassword(current, values.password);
      await updateDoc(doc(db, "users", current.uid), {
        mustChangePassword: false,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Password updated.");
      router.replace(profile ? ROLE_HOME[profile.role] : "/dashboard");
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code.includes("requires-recent-login")) {
        toast.error("Please log out and log in again, then change your password.");
      } else if (code.includes("weak-password")) {
        toast.error("Password is too weak.");
      } else {
        toast.error("Could not update password. Please try again.");
      }
    }
  }

  const forced = profile?.mustChangePassword;

  return (
    <div className="from-primary/5 flex min-h-svh flex-col bg-gradient-to-b to-transparent">
      <header className="flex items-center justify-between px-4 py-4">
        <Logo />
        <LanguageSwitcher />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary text-2xl">
                {forced ? "Set a new password" : "Change password"}
              </CardTitle>
              <CardDescription>
                {forced
                  ? "For security, please replace the temporary password you were given."
                  : "Choose a new password for your account."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New {t("auth.password")}</FormLabel>
                        <FormControl>
                          <PasswordInput
                            autoComplete="new-password"
                            {...field}
                          />
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
                        <FormLabel>Confirm new password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            autoComplete="new-password"
                            {...field}
                          />
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
                    {t("btn.save")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
