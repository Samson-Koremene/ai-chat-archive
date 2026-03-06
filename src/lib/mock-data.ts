export type Platform = "chatgpt" | "claude" | "gemini" | "perplexity" | "poe";

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  platform: Platform;
  title: string;
  createdAt: string;
  messageCount: number;
  summary?: string;
  tags?: string[];
}

export const PLATFORM_META: Record<Platform, { label: string; color: string }> = {
  chatgpt: { label: "ChatGPT", color: "bg-platform-chatgpt" },
  claude: { label: "Claude", color: "bg-platform-claude" },
  gemini: { label: "Gemini", color: "bg-platform-gemini" },
  perplexity: { label: "Perplexity", color: "bg-platform-perplexity" },
  poe: { label: "Poe", color: "bg-platform-poe" },
};

export const mockConversations: Conversation[] = [
  {
    id: "1",
    platform: "chatgpt",
    title: "Building a React dashboard with Tailwind",
    createdAt: "2026-03-06T10:30:00Z",
    messageCount: 12,
    summary: "Discussion about best practices for building dashboards with React and Tailwind CSS.",
    tags: ["react", "tailwind", "dashboard"],
  },
  {
    id: "2",
    platform: "claude",
    title: "Understanding transformer architecture",
    createdAt: "2026-03-05T15:20:00Z",
    messageCount: 8,
    summary: "Deep dive into the self-attention mechanism and positional encoding in transformers.",
    tags: ["ml", "transformers", "architecture"],
  },
  {
    id: "3",
    platform: "gemini",
    title: "PostgreSQL query optimization tips",
    createdAt: "2026-03-05T09:00:00Z",
    messageCount: 6,
    summary: "Techniques for optimizing slow PostgreSQL queries including indexing and EXPLAIN ANALYZE.",
    tags: ["postgresql", "optimization", "database"],
  },
  {
    id: "4",
    platform: "perplexity",
    title: "Latest trends in browser extension development",
    createdAt: "2026-03-04T14:45:00Z",
    messageCount: 4,
    summary: "Overview of Manifest V3 changes and best practices for Chrome extensions.",
    tags: ["browser-extension", "chrome", "mv3"],
  },
  {
    id: "5",
    platform: "chatgpt",
    title: "Designing a REST API for multi-tenant SaaS",
    createdAt: "2026-03-04T08:10:00Z",
    messageCount: 15,
    summary: "API design patterns for tenant isolation, authentication, and rate limiting.",
    tags: ["api", "saas", "multi-tenant"],
  },
  {
    id: "6",
    platform: "poe",
    title: "Creative writing prompts for sci-fi stories",
    createdAt: "2026-03-03T20:00:00Z",
    messageCount: 10,
    tags: ["creative", "writing", "sci-fi"],
  },
];

export const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", conversationId: "1", role: "user", content: "How should I structure a React dashboard with multiple widgets?", timestamp: "2026-03-06T10:30:00Z" },
    { id: "m2", conversationId: "1", role: "assistant", content: "I'd recommend using a component-based architecture with a grid layout. Each widget should be its own self-contained component that fetches its own data. You can use CSS Grid or a library like react-grid-layout for drag-and-drop repositioning.", timestamp: "2026-03-06T10:30:15Z" },
    { id: "m3", conversationId: "1", role: "user", content: "What about state management for the widgets?", timestamp: "2026-03-06T10:31:00Z" },
    { id: "m4", conversationId: "1", role: "assistant", content: "For a dashboard, React Query (TanStack Query) works great since each widget typically fetches independent data. Use it for server state. For UI state like widget positions or filters, React context or Zustand keeps things simple without over-engineering.", timestamp: "2026-03-06T10:31:20Z" },
  ],
  "2": [
    { id: "m5", conversationId: "2", role: "user", content: "Can you explain the self-attention mechanism in transformers?", timestamp: "2026-03-05T15:20:00Z" },
    { id: "m6", conversationId: "2", role: "assistant", content: "Self-attention lets each token in a sequence attend to every other token, computing relevance scores. It works by projecting inputs into Query (Q), Key (K), and Value (V) matrices, then computing Attention(Q,K,V) = softmax(QK^T / √d_k)V. This allows the model to capture long-range dependencies regardless of position.", timestamp: "2026-03-05T15:20:30Z" },
  ],
};
