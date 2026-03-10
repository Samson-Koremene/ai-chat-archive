import { Link } from "react-router-dom";
import { MessageSquare, ArrowUpRight } from "lucide-react";
import { PlatformBadge } from "./PlatformBadge";
import type { Platform } from "@/lib/mock-data";

interface ConversationLike {
  id: string;
  platform: Platform;
  title: string;
  created_at?: string;
  createdAt?: string;
  message_count?: number;
  messageCount?: number;
  summary?: string | null;
  tags?: string[];
}

interface ConversationCardProps {
  conversation: ConversationLike;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const dateStr = conversation.created_at || conversation.createdAt || "";
  const date = new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const msgCount = conversation.message_count ?? conversation.messageCount ?? 0;

  return (
    <Link
      to={`/conversation/${conversation.id}`}
      className="group flex items-center gap-4 bg-card rounded-lg px-4 py-3.5 border border-border hover:border-primary/30 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <PlatformBadge platform={conversation.platform} />
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
          {conversation.title}
        </h3>
        {conversation.summary && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{conversation.summary}</p>
        )}
        {conversation.tags && conversation.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {conversation.tags.map((tag) => (
              <span key={tag} className="text-[11px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-mono">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" />
          {msgCount}
        </span>
        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
      </div>
    </Link>
  );
}
