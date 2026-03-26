import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useConversations } from "@/hooks/use-conversations";
import { ConversationCard } from "@/components/ConversationCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Tag as TagIcon } from "lucide-react";

const Tags = () => {
  const { data: conversations = [], isLoading } = useConversations();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { allTags, filteredConversations } = useMemo(() => {
    // Extract all unique tags with counts
    const tagCounts: Record<string, number> = {};
    conversations.forEach((c) => {
      c.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const allTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Filter conversations by selected tag
    const filteredConversations = selectedTag
      ? conversations.filter((c) => c.tags?.includes(selectedTag))
      : [];

    return { allTags, filteredConversations };
  }, [conversations, selectedTag]);

  const displayedTags = searchQuery
    ? allTags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allTags;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Tags</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse conversations by tag</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tags…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {displayedTags.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-8">
          {displayedTags.map((tag) => (
            <Badge
              key={tag.name}
              variant={selectedTag === tag.name ? "default" : "secondary"}
              className="cursor-pointer text-sm px-3 py-1.5 hover:opacity-80 transition-opacity"
              onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
            >
              <TagIcon className="w-3 h-3 mr-1.5" />
              {tag.name}
              <span className="ml-2 opacity-60">({tag.count})</span>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          {searchQuery ? `No tags found for "${searchQuery}"` : "No tags yet. Add tags to your conversations!"}
        </p>
      )}

      {selectedTag && (
        <div>
          <h2 className="text-sm font-medium mb-3">
            Conversations tagged with "{selectedTag}" ({filteredConversations.length})
          </h2>
          <div className="space-y-1.5">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-16">Loading…</p>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <ConversationCard key={conv.id} conversation={conv} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-16">No conversations found.</p>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Tags;
