import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Parse body
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

    // Insert conversation
    const { data: conversation, error: convError } = await supabase
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

    // Insert messages
    const messageRows = messages.map((msg: { role: string; content: string; timestamp?: string }) => ({
      conversation_id: conversation.id,
      user_id: userId,
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
      timestamp: msg.timestamp || new Date().toISOString(),
    }));

    const { error: msgsError } = await supabase.from("messages").insert(messageRows);

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
