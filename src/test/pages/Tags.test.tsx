import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Tags from "@/pages/Tags";

vi.mock("@/hooks/use-conversations", () => ({
  useConversations: () => ({
    data: [
      {
        id: "1",
        title: "React Tutorial",
        tags: ["react", "javascript"],
        platform: "chatgpt",
        message_count: 5,
        created_at: "2026-03-12",
      },
      {
        id: "2",
        title: "Python Guide",
        tags: ["python", "backend"],
        platform: "claude",
        message_count: 8,
        created_at: "2026-03-11",
      },
      {
        id: "3",
        title: "More React",
        tags: ["react", "hooks"],
        platform: "chatgpt",
        message_count: 3,
        created_at: "2026-03-10",
      },
    ],
    isLoading: false,
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "test-user" }, signOut: vi.fn() }),
}));

const queryClient = new QueryClient();

describe("Tags Page", () => {
  it("displays all unique tags with counts", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Tags />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/react/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\(2\)/)[0]).toBeInTheDocument(); // react appears in 2 conversations
    expect(screen.getByText(/python/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\(1\)/)[0]).toBeInTheDocument();
  });

  it("filters conversations when tag is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Tags />
        </BrowserRouter>
      </QueryClientProvider>
    );

    const reactTag = screen.getByText(/react/i).closest("span");
    if (reactTag) fireEvent.click(reactTag);

    // Wait for the UI to update and check for conversation titles
    await waitFor(() => {
      expect(screen.getByText("React Tutorial")).toBeInTheDocument();
    });
    expect(screen.getByText("More React")).toBeInTheDocument();
  });

  it("allows searching tags", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Tags />
        </BrowserRouter>
      </QueryClientProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search tags/i);
    fireEvent.change(searchInput, { target: { value: "python" } });

    expect(screen.getByText(/python/i)).toBeInTheDocument();
    expect(screen.queryByText(/react/i)).not.toBeInTheDocument();
  });
});
