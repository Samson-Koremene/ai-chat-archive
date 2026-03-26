import { useState } from "react";
import { Search } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ConversationCard } from "@/components/ConversationCard";
import { useFullTextSearch, useMessageSearch } from "@/hooks/use-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const { data: conversations = [], isLoading: convLoading } = useFullTextSearch(query);
  const { data: messages = [], isLoading: msgLoading } = useMessageSearch(query);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Search</h1>
        <p className="text-sm text-muted-foreground mt-1">Find conversations and messages across all platforms</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by title, summary, tags, or message content…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
        />
      </div>

      {query.trim() ? (
        <Tabs defaultValue="conversations" className="w-full">
          <TabsList>
            <TabsTrigger value="conversations">
              Conversations ({conversations.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Messages ({messages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="mt-4">
            <div className="space-y-1.5">
              {convLoading ? (
                <p className="text-sm text-muted-foreground text-center py-16">Searching…</p>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => (
                  <ConversationCard key={conv.id} conversation={conv} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-16">
                  No conversations found for "{query}"
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            <div className="space-y-3">
              {msgLoading ? (
                <p className="text-sm text-muted-foreground text-center py-16">Searching…</p>
              ) : messages.length > 0 ? (
                messages.map((msg: any) => (
                  <div key={msg.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase">
                        {msg.role}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-3 mb-2">{msg.content}</p>
                    <a
                      href={`/conversation/${msg.conversation_id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      View conversation: {msg.conversations.title}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-16">
                  No messages found for "{query}"
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-16">Start typing to search</p>
      )}
    </DashboardLayout>
  );
};

export default SearchPage;
