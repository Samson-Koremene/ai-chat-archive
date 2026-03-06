import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlatformBadge } from "@/components/PlatformBadge";
import { mockConversations, mockMessages } from "@/lib/mock-data";

const ConversationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const conversation = mockConversations.find((c) => c.id === id);
  const messages = id ? mockMessages[id] || [] : [];

  if (!conversation) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Conversation not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Link to="/conversations" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Conversations
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <PlatformBadge platform={conversation.platform} size="md" />
        </div>
        <h1 className="text-2xl font-bold">{conversation.title}</h1>
        {conversation.summary && (
          <p className="text-muted-foreground mt-2 text-sm">{conversation.summary}</p>
        )}
        {conversation.tags && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {conversation.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-mono">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-card-foreground"
              }`}
            >
              <p className="text-[10px] font-medium mb-1 opacity-70">
                {msg.role === "user" ? "You" : "AI"}
              </p>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {messages.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No messages available for this conversation yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConversationDetail;
