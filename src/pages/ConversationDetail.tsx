import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Download, Save, X } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PlatformBadge } from "@/components/PlatformBadge";
import { useConversation, useMessages, useUpdateConversation, useDeleteConversation } from "@/hooks/use-conversations";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ConversationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: conversation, isLoading: convLoading } = useConversation(id);
  const { data: messages = [], isLoading: msgsLoading } = useMessages(id);
  const updateConversation = useUpdateConversation();
  const deleteConversation = useDeleteConversation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editTags, setEditTags] = useState("");

  const handleEdit = () => {
    if (conversation) {
      setEditTitle(conversation.title);
      setEditSummary(conversation.summary || "");
      setEditTags(conversation.tags?.join(", ") || "");
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      await updateConversation.mutateAsync({
        id,
        title: editTitle,
        summary: editSummary || null,
        tags: editTags.split(",").map(t => t.trim()).filter(Boolean),
      });
      toast.success("Conversation updated");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update conversation");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteConversation.mutateAsync(id);
      toast.success("Conversation deleted");
      navigate("/conversations");
    } catch (error) {
      toast.error("Failed to delete conversation");
    }
  };

  const handleExport = () => {
    if (!conversation || !messages) return;
    const exportData = {
      conversation,
      messages,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${conversation.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Conversation exported");
  };

  if (convLoading) {
    return (
      <DashboardLayout>
        <p className="text-sm text-muted-foreground text-center py-16">Loading…</p>
      </DashboardLayout>
    );
  }

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
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PlatformBadge platform={conversation.platform} size="md" />
            <span className="text-xs text-muted-foreground">
              {new Date(conversation.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSave} disabled={updateConversation.isPending}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={handleExport}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleEdit}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this conversation and all its messages. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={deleteConversation.isPending}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-y-3 mt-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Summary</label>
              <Textarea
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
              <Input
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="ai, coding, research"
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-semibold tracking-tight">{conversation.title}</h1>
            {conversation.summary && (
              <p className="text-sm text-muted-foreground mt-1.5">{conversation.summary}</p>
            )}
            {conversation.tags && conversation.tags.length > 0 && (
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {conversation.tags.map((tag) => (
                  <span key={tag} className="text-[11px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t border-border pt-5 space-y-3">
        {msgsLoading ? (
          <p className="text-sm text-muted-foreground text-center py-16">Loading messages…</p>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
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
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-16">No messages available yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConversationDetail;
