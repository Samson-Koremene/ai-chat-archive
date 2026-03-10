import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ConversationCard } from "@/components/ConversationCard";
import { PLATFORM_META, type Platform } from "@/lib/mock-data";
import { useConversations } from "@/hooks/use-conversations";

const Conversations = () => {
  const [filter, setFilter] = useState<Platform | "all">("all");
  const { data: conversations = [], isLoading } = useConversations(filter);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Conversations</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse all captured AI conversations</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
            filter === "all"
              ? "bg-foreground text-background"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All
        </button>
        {(Object.keys(PLATFORM_META) as Platform[]).map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              filter === p
                ? "bg-foreground text-background"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {PLATFORM_META[p].label}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-16">Loading…</p>
        ) : conversations.length > 0 ? (
          conversations.map((conv) => (
            <ConversationCard key={conv.id} conversation={conv} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-16">No conversations found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
