import { useParams, Link } from "react-router-dom";
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
        <p className="text-sm text-muted-foreground">Conversation not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Link
        to="/conversations"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-5"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <PlatformBadge platform={conversation.platform} size="md" />
          <span className="text-xs text-muted-foreground">
            {new Date(conversation.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <h1 className="text-lg font-semibold tracking-tight">{conversation.title}</h1>
        {conversation.summary && (
          <p className="text-sm text-muted-foreground mt-1.5">{conversation.summary}</p>
        )}
        {conversation.tags && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {conversation.tags.map((tag) => (
              <span key={tag} className="text-[11px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-mono">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-5 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-card-foreground"
              }`}
            >
              <p className="text-[10px] font-medium mb-1 opacity-60 uppercase tracking-wider">
                {msg.role === "user" ? "You" : "AI"}
              </p>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-16">No messages available yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConversationDetail;
