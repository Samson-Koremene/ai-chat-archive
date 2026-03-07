import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { ConversationCard } from "@/components/ConversationCard";
import { mockConversations, PLATFORM_META } from "@/lib/mock-data";
import { MessageSquare, Layers, Brain, Zap } from "lucide-react";

const Index = () => {
  const totalMessages = mockConversations.reduce((sum, c) => sum + c.messageCount, 0);
  const platformCount = new Set(mockConversations.map((c) => c.platform)).size;
  const recent = mockConversations.slice(0, 4);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Your AI conversation memory at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard icon={MessageSquare} title="Conversations" value={mockConversations.length} />
        <StatCard icon={Layers} title="Messages" value={totalMessages} />
        <StatCard icon={Brain} title="Platforms" value={platformCount} />
        <StatCard icon={Zap} title="Saved Today" value={2} subtitle="+2 from yesterday" />
      </div>

      {/* Platform breakdown */}
      <div className="mb-8">
        <h2 className="text-sm font-medium mb-3">Platforms</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PLATFORM_META).map(([key, meta]) => {
            const count = mockConversations.filter((c) => c.platform === key).length;
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

      {/* Recent conversations */}
      <div>
        <h2 className="text-sm font-medium mb-3">Recent conversations</h2>
        <div className="space-y-1.5">
          {recent.map((conv) => (
            <ConversationCard key={conv.id} conversation={conv} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
