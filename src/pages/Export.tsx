import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useConversations } from "@/hooks/use-conversations";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileJson, FileText, Database } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ExportFormat = "json" | "csv" | "markdown";

const Export = () => {
  const { data: conversations = [], isLoading } = useConversations();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<ExportFormat>("json");
  const [includeMessages, setIncludeMessages] = useState(true);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    setSelectedIds(new Set(conversations.map((c) => c.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const exportData = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one conversation");
      return;
    }

    try {
      const selectedConversations = conversations.filter((c) => selectedIds.has(c.id));
      let exportContent = "";
      let filename = "";
      let mimeType = "";

      if (includeMessages) {
        // Fetch messages for selected conversations
        const { data: messages } = await supabase
          .from("messages")
          .select("*")
          .in("conversation_id", Array.from(selectedIds))
          .order("timestamp", { ascending: true });

        const conversationsWithMessages = selectedConversations.map((conv) => ({
          ...conv,
          messages: messages?.filter((m) => m.conversation_id === conv.id) || [],
        }));

        if (format === "json") {
          exportContent = JSON.stringify(conversationsWithMessages, null, 2);
          filename = `conversations-export-${new Date().toISOString().split("T")[0]}.json`;
          mimeType = "application/json";
        } else if (format === "csv") {
          // CSV with flattened messages
          const csvRows = ["Conversation ID,Title,Platform,Message Role,Message Content,Timestamp"];
          conversationsWithMessages.forEach((conv) => {
            conv.messages.forEach((msg: any) => {
              csvRows.push(
                `"${conv.id}","${conv.title}","${conv.platform}","${msg.role}","${msg.content.replace(/"/g, '""')}","${msg.timestamp}"`
              );
            });
          });
          exportContent = csvRows.join("\n");
          filename = `conversations-export-${new Date().toISOString().split("T")[0]}.csv`;
          mimeType = "text/csv";
        } else if (format === "markdown") {
          exportContent = conversationsWithMessages
            .map((conv) => {
              let md = `# ${conv.title}\n\n`;
              md += `**Platform:** ${conv.platform}\n`;
              md += `**Created:** ${new Date(conv.created_at).toLocaleString()}\n`;
              if (conv.summary) md += `**Summary:** ${conv.summary}\n`;
              if (conv.tags && conv.tags.length > 0) md += `**Tags:** ${conv.tags.join(", ")}\n`;
              md += `\n---\n\n`;
              conv.messages.forEach((msg: any) => {
                md += `### ${msg.role === "user" ? "User" : "Assistant"}\n\n${msg.content}\n\n`;
              });
              return md;
            })
            .join("\n\n---\n\n");
          filename = `conversations-export-${new Date().toISOString().split("T")[0]}.md`;
          mimeType = "text/markdown";
        }
      } else {
        // Export only conversation metadata
        if (format === "json") {
          exportContent = JSON.stringify(selectedConversations, null, 2);
          filename = `conversations-metadata-${new Date().toISOString().split("T")[0]}.json`;
          mimeType = "application/json";
        } else if (format === "csv") {
          const csvRows = ["ID,Title,Platform,Message Count,Created At,Tags"];
          selectedConversations.forEach((conv) => {
            csvRows.push(
              `"${conv.id}","${conv.title}","${conv.platform}",${conv.message_count},"${conv.created_at}","${conv.tags?.join("; ") || ""}"`
            );
          });
          exportContent = csvRows.join("\n");
          filename = `conversations-metadata-${new Date().toISOString().split("T")[0]}.csv`;
          mimeType = "text/csv";
        }
      }

      // Download file
      const blob = new Blob([exportContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Exported ${selectedIds.size} conversation(s)`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export conversations");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Export</h1>
        <p className="text-sm text-muted-foreground mt-1">Export your conversations in various formats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFormat("json")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <FileJson className="w-8 h-8 text-primary" />
              <Checkbox checked={format === "json"} />
            </div>
            <CardTitle className="text-base">JSON</CardTitle>
            <CardDescription>Structured data format, ideal for importing into other tools</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFormat("csv")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Database className="w-8 h-8 text-primary" />
              <Checkbox checked={format === "csv"} />
            </div>
            <CardTitle className="text-base">CSV</CardTitle>
            <CardDescription>Spreadsheet format, works with Excel and Google Sheets</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFormat("markdown")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <FileText className="w-8 h-8 text-primary" />
              <Checkbox checked={format === "markdown"} />
            </div>
            <CardTitle className="text-base">Markdown</CardTitle>
            <CardDescription>Human-readable format, great for documentation</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox id="include-messages" checked={includeMessages} onCheckedChange={(checked) => setIncludeMessages(!!checked)} />
            <label htmlFor="include-messages" className="text-sm font-medium cursor-pointer">
              Include message content (not just metadata)
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium">Select Conversations</h2>
          <p className="text-xs text-muted-foreground">{selectedIds.size} of {conversations.length} selected</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={deselectAll}>
            Deselect All
          </Button>
          <Button onClick={exportData} disabled={selectedIds.size === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-16">Loading…</p>
        ) : conversations.length > 0 ? (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedIds.has(conv.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => toggleSelection(conv.id)}
            >
              <Checkbox checked={selectedIds.has(conv.id)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{conv.title}</p>
                <p className="text-xs text-muted-foreground">
                  {conv.platform} • {conv.message_count} messages • {new Date(conv.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-16">No conversations to export</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Export;
