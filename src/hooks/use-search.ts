import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { DbConversation } from "./use-conversations";

export function useFullTextSearch(query: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query.trim()) return [];

      // Use PostgreSQL full-text search
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .textSearch("search_vector", query, {
          type: "websearch",
          config: "english",
        })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as DbConversation[]) ?? [];
    },
    enabled: !!user && query.trim().length > 0,
  });
}

export function useMessageSearch(query: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["message-search", query],
    queryFn: async () => {
      if (!query.trim()) return [];

      const { data, error } = await supabase
        .from("messages")
        .select("*, conversations!inner(*)")
        .textSearch("search_vector", query, {
          type: "websearch",
          config: "english",
        })
        .order("timestamp", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && query.trim().length > 0,
  });
}
