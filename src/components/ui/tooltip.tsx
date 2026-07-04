import { cn } from "@/lib/utils";

/**
 * Lightweight hover/focus tooltip. Wraps a single interactive child and shows a
 * label on the chosen side. Pure CSS (no portal) — intended for icon buttons.
 */
export function Tooltip({
  label,
  children,
  className,
  side = "top",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom";
}) {
  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "bg-foreground text-background pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 scale-95 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap opacity-0 shadow-md transition-all duration-100 group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100 group-focus-within/tooltip:scale-100 group-focus-within/tooltip:opacity-100",
          side === "bottom" ? "top-full mt-1.5" : "bottom-full mb-1.5",
        )}
      >
        {label}
      </span>
    </span>
  );
}
