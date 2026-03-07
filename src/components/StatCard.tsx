import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ title, value, subtitle, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg p-4 shadow-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] text-muted-foreground font-medium">{title}</p>
        <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}
