import { useState } from "react";
import { Search } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ConversationCard } from "@/components/ConversationCard";
import { mockConversations } from "@/lib/mock-data";

const SearchPage = () => {
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? mockConversations.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.summary?.toLowerCase().includes(query.toLowerCase()) ||
          c.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground mt-1">Find conversations across all platforms</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by title, summary, or tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        />
      </div>

      {query.trim() ? (
        <div className="grid gap-3">
          {results.length > 0 ? (
            results.map((conv, i) => (
              <ConversationCard key={conv.id} conversation={conv} index={i} />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-12">No results found for "{query}"</p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-12">Start typing to search your conversations</p>
      )}
    </DashboardLayout>
  );
};

export default SearchPage;
