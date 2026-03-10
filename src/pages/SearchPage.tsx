import { useState } from "react";
import { Search } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ConversationCard } from "@/components/ConversationCard";
import { useConversations } from "@/hooks/use-conversations";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const { data: conversations = [] } = useConversations();

  const results = query.trim()
    ? conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.summary?.toLowerCase().includes(query.toLowerCase()) ||
          c.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">Find conversations across all platforms</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by title, summary, or tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
        />
      </div>

      {query.trim() ? (
        <div className="space-y-1.5">
          {results.length > 0 ? (
            results.map((conv) => (
              <ConversationCard key={conv.id} conversation={conv} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-16">
              No results for "{query}"
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-16">Start typing to search</p>
      )}
    </DashboardLayout>
  );
};

export default SearchPage;
