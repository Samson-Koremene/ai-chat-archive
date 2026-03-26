import { LucideIcon } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  chartData?: number[];
}

export function StatCard({ title, value, subtitle, icon: Icon, chartData }: StatCardProps) {
  const formattedChartData = chartData?.map((val, index) => ({ index, value: val }));

  return (
    <SpotlightCard className="bg-card rounded-lg p-4 shadow-card border border-border group transition-colors hover:border-primary/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] text-muted-foreground font-medium group-hover:text-foreground transition-colors">{title}</p>
          <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>

      {formattedChartData && formattedChartData.length > 0 && (
        <div className="h-[35px] mt-4 w-full opacity-60 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedChartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="currentColor" 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </SpotlightCard>
  );
}
