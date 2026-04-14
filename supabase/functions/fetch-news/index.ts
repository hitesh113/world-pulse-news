import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.4/cors";

const GNEWS_CATEGORY_MAP: Record<string, string> = {
  world: "world",
  technology: "tech",
  sports: "sports",
  business: "business",
  politics: "nation",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const GNEWS_API_KEY = Deno.env.get("GNEWS_API_KEY");
    if (!GNEWS_API_KEY) {
      throw new Error("GNEWS_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let totalInserted = 0;

    for (const [gnewsTopic, localCategory] of Object.entries(GNEWS_CATEGORY_MAP)) {
      const url = `https://gnews.io/api/v4/top-headlines?category=${gnewsTopic}&lang=en&max=5&apikey=${GNEWS_API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`GNews API error for ${gnewsTopic}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const articles = data.articles || [];

      for (const article of articles) {
        const slug = slugify(article.title);

        // Check for duplicates
        const { data: existing } = await supabase
          .from("articles")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();

        if (existing) continue;

        const { error } = await supabase.from("articles").insert({
          title: article.title,
          slug,
          category: localCategory,
          author: article.source?.name || "GNews",
          cover_image_url: article.image || null,
          excerpt: article.description || "",
          body: article.content || article.description || "",
          status: "published",
          published_at: article.publishedAt || new Date().toISOString(),
          source: "gnews",
        });

        if (error) {
          console.error(`Insert error for "${slug}":`, error.message);
        } else {
          totalInserted++;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, inserted: totalInserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("fetch-news error:", msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
