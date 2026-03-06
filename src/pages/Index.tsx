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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your AI conversation memory at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={MessageSquare} title="Total Conversations" value={mockConversations.length} delay={0} />
        <StatCard icon={Layers} title="Messages Captured" value={totalMessages} delay={0.05} />
        <StatCard icon={Brain} title="Platforms Connected" value={platformCount} delay={0.1} />
        <StatCard icon={Zap} title="Saved Today" value={2} subtitle="Keep going!" delay={0.15} />
      </div>

      {/* Platform breakdown */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-border mb-8">
        <h2 className="font-semibold mb-4">By Platform</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(PLATFORM_META).map(([key, meta]) => {
            const count = mockConversations.filter((c) => c.platform === key).length;
            return (
              <div key={key} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
                <span className={`w-2.5 h-2.5 rounded-full ${meta.color}`} />
                <span className="text-sm font-medium">{meta.label}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent conversations */}
      <div>
        <h2 className="font-semibold mb-4">Recent Conversations</h2>
        <div className="grid gap-3">
          {recent.map((conv, i) => (
            <ConversationCard key={conv.id} conversation={conv} index={i} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
