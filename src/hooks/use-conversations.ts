import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export function useUpdateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, title, summary, tags }: { 
      id: string; 
      title: string; 
      summary: string | null; 
      tags: string[] 
    }) => {
      const { data, error } = await supabase
        .from("conversations")
        .update({ title, summary, tags, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", data.id] });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
