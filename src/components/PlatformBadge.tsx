import { PLATFORM_META, type Platform } from "@/lib/mock-data";

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "md";
}

export function PlatformBadge({ platform, size = "sm" }: PlatformBadgeProps) {
  const meta = PLATFORM_META[platform];
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`${meta.color} text-primary-foreground font-medium rounded-full ${sizeClasses} inline-flex items-center`}
    >
      {meta.label}
    </span>
  );
}
