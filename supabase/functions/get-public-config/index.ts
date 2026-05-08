import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const onesignalAppId = Deno.env.get("ONESIGNAL_APP_ID") ?? "";
  return new Response(JSON.stringify({ onesignalAppId }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
