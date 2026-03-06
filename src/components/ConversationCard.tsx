import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Clock } from "lucide-react";
import { PlatformBadge } from "./PlatformBadge";
import type { Conversation } from "@/lib/mock-data";

interface ConversationCardProps {
  conversation: Conversation;
  index?: number;
}

export function ConversationCard({ conversation, index = 0 }: ConversationCardProps) {
  const date = new Date(conversation.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/conversation/${conversation.id}`}
        className="block bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all border border-border hover:border-primary/20 group"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <PlatformBadge platform={conversation.platform} />
            </div>
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
              {conversation.title}
            </h3>
            {conversation.summary && (
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{conversation.summary}</p>
            )}
            {conversation.tags && conversation.tags.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {conversation.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5 text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{date}</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{conversation.messageCount}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
