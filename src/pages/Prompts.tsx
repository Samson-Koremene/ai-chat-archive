import { DashboardLayout } from "@/components/DashboardLayout";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const SAMPLE_PROMPTS = [
  {
    id: "1",
    text: "Explain the concept of [TOPIC] as if I'm a 10-year-old, then as a college student, then as an expert.",
    category: "Learning",
    platform: "chatgpt" as const,
  },
  {
    id: "2",
    text: "Review this code for bugs, performance issues, and security vulnerabilities. Suggest fixes with explanations.",
    category: "Code Review",
    platform: "claude" as const,
  },
  {
    id: "3",
    text: "Generate a detailed comparison table of [OPTION A] vs [OPTION B] across these dimensions: cost, performance, scalability, ease of use.",
    category: "Analysis",
    platform: "gemini" as const,
  },
  {
    id: "4",
    text: "Summarize the latest research on [TOPIC] from the past 6 months, including key findings and their implications.",
    category: "Research",
    platform: "perplexity" as const,
  },
];

const Prompts = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Prompt Library</h1>
        <p className="text-sm text-muted-foreground mt-1">Your best prompts, extracted from conversations</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {SAMPLE_PROMPTS.map((prompt) => (
          <div
            key={prompt.id}
            className="bg-card rounded-lg p-4 border border-border group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium uppercase tracking-wider">
                {prompt.category}
              </span>
              <button
                onClick={() => handleCopy(prompt.id, prompt.text)}
                className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
              >
                {copied === prompt.id ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[13px] font-mono leading-relaxed text-card-foreground">{prompt.text}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Prompts;
