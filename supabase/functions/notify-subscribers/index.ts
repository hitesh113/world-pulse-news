const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ONESIGNAL_APP_ID = Deno.env.get("ONESIGNAL_APP_ID");
    const ONESIGNAL_API_KEY = Deno.env.get("ONESIGNAL_API_KEY");

    if (!ONESIGNAL_APP_ID) throw new Error("ONESIGNAL_APP_ID is not configured");
    if (!ONESIGNAL_API_KEY) throw new Error("ONESIGNAL_API_KEY is not configured");

    const body = await req.json();
    const { title, excerpt, slug } = body;

    if (!title || !slug) {
      return new Response(
        JSON.stringify({ error: "title and slug are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const heading = title.length > 60 ? title.substring(0, 57) + "..." : title;
    const message = excerpt
      ? excerpt.length > 100
        ? excerpt.substring(0, 97) + "..."
        : excerpt
      : title;

    const siteUrl = Deno.env.get("SITE_URL") || "https://worldpulse.app";

    const notification = {
      app_id: ONESIGNAL_APP_ID,
      included_segments: ["Subscribed Users"],
      headings: { en: heading },
      contents: { en: message },
      url: `${siteUrl}/article/${slug}`,
    };

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${ONESIGNAL_API_KEY}`,
      },
      body: JSON.stringify(notification),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`OneSignal API failed [${response.status}]: ${JSON.stringify(result)}`);
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("notify-subscribers error:", msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
