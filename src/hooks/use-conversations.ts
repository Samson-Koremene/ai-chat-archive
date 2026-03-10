import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Platform } from "@/lib/mock-data";

export interface DbConversation {
  id: string;
  user_id: string;
  platform: Platform;
  title: string;
  summary: string | null;
  tags: string[];
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function useConversations(platform?: Platform | "all") {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["conversations", platform],
    queryFn: async () => {
      let query = supabase
        .from("conversations")
        .select("*")
        .order("created_at", { ascending: false });

      if (platform && platform !== "all") {
        query = query.eq("platform", platform);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as DbConversation[]) ?? [];
    },
    enabled: !!user,
  });
}

export function useConversation(id: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as DbConversation;
    },
    enabled: !!user && !!id,
  });
}

export function useMessages(conversationId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("timestamp", { ascending: true });
      if (error) throw error;
      return (data as DbMessage[]) ?? [];
    },
    enabled: !!user && !!conversationId,
  });
}
