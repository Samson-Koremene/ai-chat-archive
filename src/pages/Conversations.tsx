import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ConversationCard } from "@/components/ConversationCard";
import { mockConversations, PLATFORM_META, type Platform } from "@/lib/mock-data";

const Conversations = () => {
  const [filter, setFilter] = useState<Platform | "all">("all");

  const filtered =
    filter === "all" ? mockConversations : mockConversations.filter((c) => c.platform === filter);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Conversations</h1>
        <p className="text-muted-foreground mt-1">Browse all captured AI conversations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All
        </button>
        {(Object.keys(PLATFORM_META) as Platform[]).map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === p ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {PLATFORM_META[p].label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((conv, i) => (
          <ConversationCard key={conv.id} conversation={conv} index={i} />
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No conversations found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Conversations;
