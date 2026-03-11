import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

Deno.test("capture-conversation returns 401 without auth", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/capture-conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      platform: "chatgpt",
      title: "Test",
      messages: [{ role: "user", content: "hello" }],
    }),
  });
  assertEquals(response.status, 401);
  const body = await response.json();
  assertEquals(body.error, "Unauthorized");
});

Deno.test("capture-conversation returns 401 with invalid token", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/capture-conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer invalid-token",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      platform: "chatgpt",
      title: "Test",
      messages: [{ role: "user", content: "hello" }],
    }),
  });
  assertEquals(response.status, 401);
  await response.text();
});

Deno.test("capture-conversation CORS preflight works", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/capture-conversation`, {
    method: "OPTIONS",
    headers: {
      apikey: SUPABASE_ANON_KEY,
    },
  });
  assertEquals(response.status, 200);
  const allowHeaders = response.headers.get("access-control-allow-headers");
  assertEquals(allowHeaders?.includes("authorization"), true);
  await response.text();
});
