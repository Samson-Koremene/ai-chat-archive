import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ConversationCard } from "@/components/ConversationCard";
import type { DbConversation } from "@/hooks/use-conversations";

const mockConversation: DbConversation = {
  id: "1",
  user_id: "user-1",
  platform: "chatgpt",
  title: "Test Conversation",
  summary: "This is a test summary",
  tags: ["react", "testing"],
  message_count: 10,
  created_at: "2026-03-12T10:00:00Z",
  updated_at: "2026-03-12T10:00:00Z",
};

describe("ConversationCard", () => {
  it("renders conversation title", () => {
    render(
      <BrowserRouter>
        <ConversationCard conversation={mockConversation} />
      </BrowserRouter>
    );

    expect(screen.getByText("Test Conversation")).toBeInTheDocument();
  });

  it("renders message count", () => {
    render(
      <BrowserRouter>
        <ConversationCard conversation={mockConversation} />
      </BrowserRouter>
    );

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders tags", () => {
    render(
      <BrowserRouter>
        <ConversationCard conversation={mockConversation} />
      </BrowserRouter>
    );

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("testing")).toBeInTheDocument();
  });

  it("renders summary when provided", () => {
    render(
      <BrowserRouter>
        <ConversationCard conversation={mockConversation} />
      </BrowserRouter>
    );

    expect(screen.getByText("This is a test summary")).toBeInTheDocument();
  });

  it("links to conversation detail page", () => {
    render(
      <BrowserRouter>
        <ConversationCard conversation={mockConversation} />
      </BrowserRouter>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/conversation/1");
  });
});
