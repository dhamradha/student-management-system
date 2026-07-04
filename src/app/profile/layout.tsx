import { SiteHeader } from "@/components/layout/site-header";
import { RoleGate } from "@/features/auth/role-gate";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allow={["TEACHER", "SUPER_ADMIN"]}>
      <div className="flex min-h-svh flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
          {children}
        </main>
      </div>
    </RoleGate>
  );
}
