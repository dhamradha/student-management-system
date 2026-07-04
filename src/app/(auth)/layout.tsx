import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-primary/5 flex min-h-svh flex-col bg-gradient-to-b to-transparent">
      <header className="flex items-center justify-between px-4 py-4">
        {/* Logo already renders its own link (href="/"). */}
        <Logo />
        <LanguageSwitcher />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
