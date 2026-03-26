import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { KeyRound, Copy, Puzzle } from "lucide-react";
import { toast } from "sonner";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const Extension = () => {
  const { session } = useAuth();
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateKey = async () => {
    if (!session?.access_token) {
      toast.error("You must be signed in.");
      return;
    }
    setLoading(true);
    setGeneratedKey(null);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-extension-key`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: PUBLISHABLE_KEY,
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
      }
      const key = (data as { key?: string }).key;
      if (!key) throw new Error("No key returned");
      setGeneratedKey(key);
      toast.success("Key created. Copy it now — open the extension popup and paste it under “Extension key”.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate key");
    } finally {
      setLoading(false);
    }
  };

  const copyKey = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    toast.success("Copied to clipboard");
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Puzzle className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Browser extension</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1 max-w-xl">
          Sign in with Google (or any method) in this dashboard, then generate a one-time key and paste it into the
          Memory AI Capture extension. Generating a new key replaces the previous one.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-6 max-w-xl space-y-4">
        <div className="flex items-start gap-3">
          <KeyRound className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Extension key</p>
            <p className="text-xs text-muted-foreground">
              Requires the <code className="text-[11px] bg-muted px-1 py-0.5 rounded">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
              secret on the Edge Functions (see README). Without it, key generation will fail.
            </p>
          </div>
        </div>

        <Button type="button" onClick={generateKey} disabled={loading || !session}>
          {loading ? "Generating…" : "Generate new extension key"}
        </Button>

        {generatedKey && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Copy this key now. It is not stored in plain text and cannot be shown again.
            </p>
            <div className="flex gap-2">
              <code className="flex-1 text-[11px] break-all rounded-md border border-border bg-muted/50 px-3 py-2">
                {generatedKey}
              </code>
              <Button type="button" variant="outline" size="icon" onClick={copyKey} title="Copy">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Extension;
