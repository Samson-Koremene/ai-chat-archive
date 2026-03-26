import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { ConversationCard } from "@/components/ConversationCard";
import { PLATFORM_META } from "@/lib/mock-data";
import { useConversations } from "@/hooks/use-conversations";
import { MessageSquare, Layers, Brain, Zap } from "lucide-react";

const Index = () => {
  const { data: conversations = [], isLoading } = useConversations();

  const totalMessages = conversations.reduce((sum, c) => sum + c.message_count, 0);
  const platformCount = new Set(conversations.map((c) => c.platform)).size;
  const recent = conversations.slice(0, 4);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const conversationsChartData = last7Days.map((date) => 
    conversations.filter((c) => c.created_at.startsWith(date)).length
  );

  const messagesChartData = last7Days.map((date) => 
    conversations
      .filter((c) => c.created_at.startsWith(date))
      .reduce((sum, c) => sum + (c.message_count || 0), 0)
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Your AI conversation memory at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard icon={MessageSquare} title="Conversations" value={conversations.length} chartData={conversationsChartData} />
        <StatCard icon={Layers} title="Messages" value={totalMessages} chartData={messagesChartData} />
        <StatCard icon={Brain} title="Platforms" value={platformCount} />
        <StatCard icon={Zap} title="Saved Today" value={conversations.filter(c => {
          const today = new Date().toDateString();
          return new Date(c.created_at).toDateString() === today;
        }).length} />
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium mb-3">Platforms</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PLATFORM_META).map(([key, meta]) => {
            const count = conversations.filter((c) => c.platform === key).length;
            return (
              <div key={key} className="flex items-center gap-2 bg-card rounded-md border border-border px-3 py-2">
                <span className={`w-2 h-2 rounded-full ${meta.color}`} />
                <span className="text-[13px] font-medium text-foreground">{meta.label}</span>
                <span className="text-[13px] text-muted-foreground tabular-nums">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3">Recent conversations</h2>
        <div className="space-y-1.5">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-16">Loading…</p>
          ) : recent.length > 0 ? (
            recent.map((conv) => (
              <ConversationCard key={conv.id} conversation={conv} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-16">No conversations yet. Start capturing from your browser extension!</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
