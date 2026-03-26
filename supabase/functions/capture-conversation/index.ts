import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-extension-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const extKeyHeader = req.headers.get("X-Extension-Key")?.trim();
    const authHeader = req.headers.get("Authorization");

    let userId: string;
    let db: SupabaseClient;

    if (extKeyHeader) {
      if (!serviceRole) {
        console.error("SUPABASE_SERVICE_ROLE_KEY is not set");
        return new Response(JSON.stringify({ error: "Server misconfigured" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const keyHash = await sha256Hex(extKeyHeader);
      const admin = createClient(supabaseUrl, serviceRole);
      const { data: row, error: lookupError } = await admin
        .from("extension_keys")
        .select("user_id")
        .eq("key_hash", keyHash)
        .maybeSingle();

      if (lookupError || !row?.user_id) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      userId = row.user_id as string;
      await admin
        .from("extension_keys")
        .update({ last_used_at: new Date().toISOString() })
        .eq("key_hash", keyHash);

      db = admin;
    } else if (authHeader?.startsWith("Bearer ")) {
      const supabase = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });

      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
      if (claimsError || !claimsData?.claims) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      userId = claimsData.claims.sub as string;
      db = supabase;
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { platform, title, summary, tags, messages } = await req.json();

    if (!platform || !title || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: platform, title, messages[]" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validPlatforms = ["chatgpt", "claude", "gemini", "perplexity", "poe"];
    if (!validPlatforms.includes(platform)) {
      return new Response(
        JSON.stringify({ error: `Invalid platform. Must be one of: ${validPlatforms.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: conversation, error: convError } = await db
      .from("conversations")
      .insert({
        user_id: userId,
        platform,
        title,
        summary: summary || null,
        tags: tags || [],
        message_count: messages.length,
      })
      .select("id")
      .single();

    if (convError) {
      console.error("Conversation insert error:", convError);
      return new Response(JSON.stringify({ error: "Failed to create conversation" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messageRows = messages.map((msg: { role: string; content: string; timestamp?: string }) => ({
      conversation_id: conversation.id,
      user_id: userId,
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
      timestamp: msg.timestamp || new Date().toISOString(),
    }));

    const { error: msgsError } = await db.from("messages").insert(messageRows);

    if (msgsError) {
      console.error("Messages insert error:", msgsError);
      return new Response(JSON.stringify({ error: "Failed to insert messages" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, conversation_id: conversation.id, message_count: messages.length }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
