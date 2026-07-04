import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  withText?: boolean;
  className?: string;
  size?: number;
}

/** School emblem + wordmark. Emblem asset per SRS §1. */
export function Logo({
  href = "/",
  withText = true,
  className,
  size = 40,
}: LogoProps) {
  const content = (
    <span className={cn("flex items-center gap-3", className)}>
      <Image
        src="/brand/emblem.jpg"
        alt="Hunuwala Dharmaraja Vidyalaya emblem"
        width={size}
        height={size}
        className="rounded-full ring-1 ring-gold/40"
        priority
      />
      {withText && (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-primary">
            Hunuwala Dharmaraja Vidyalaya
          </span>
          <span className="text-muted-foreground text-xs">
            Student Data Management System
          </span>
        </span>
      )}
    </span>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
