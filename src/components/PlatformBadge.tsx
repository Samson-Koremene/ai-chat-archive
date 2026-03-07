import { PLATFORM_META, type Platform } from "@/lib/mock-data";

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "md";
}

export function PlatformBadge({ platform, size = "sm" }: PlatformBadgeProps) {
  const meta = PLATFORM_META[platform];
  const sizeClasses = size === "sm" ? "text-[11px] px-1.5 py-0.5 gap-1" : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span className={`inline-flex items-center font-medium rounded-md bg-secondary text-secondary-foreground ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.color}`} />
      {meta.label}
    </span>
  );
}
