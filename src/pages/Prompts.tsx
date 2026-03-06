import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
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
        <h1 className="text-3xl font-bold">Prompt Library</h1>
        <p className="text-muted-foreground mt-1">Your best prompts extracted from conversations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SAMPLE_PROMPTS.map((prompt, i) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl p-5 shadow-card border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                {prompt.category}
              </span>
              <button
                onClick={() => handleCopy(prompt.id, prompt.text)}
                className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                {copied === prompt.id ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm font-mono leading-relaxed text-card-foreground">{prompt.text}</p>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Prompts;
