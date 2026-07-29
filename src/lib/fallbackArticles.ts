import type { Article } from "@/hooks/useArticles";

const fallbackArticles: Article[] = [
  {
    id: "fallback-1",
    title: "World Pulse: Global stories are now available offline",
    slug: "world-pulse-global-stories-available-offline",
    category: "world",
    author: "World Pulse Team",
    cover_image_url: null,
    excerpt: "Your local feed is ready to display while the live news sync is being configured.",
    body: "The app now includes built-in fallback content so the experience remains useful while the Supabase Edge Function is being deployed.",
    status: "published",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    source: "fallback",
  },
  {
    id: "fallback-2",
    title: "AI in creative work is reshaping modern media",
    slug: "ai-in-creative-work",
    category: "technology",
    author: "World Pulse Team",
    cover_image_url: null,
    excerpt: "A quick look at how intelligent tools are changing the way stories are produced and consumed.",
    body: "Fallback content keeps the browse experience active and polished while your live news source is being connected.",
    status: "published",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    source: "fallback",
  },
  {
    id: "fallback-3",
    title: "The next era of local journalism starts with better tools",
    slug: "next-era-local-journalism",
    category: "business",
    author: "World Pulse Team",
    cover_image_url: null,
    excerpt: "Reliable publishing workflows and faster discovery are now part of the foundation.",
    body: "This fallback feed is intentionally simple so visitors can still explore the app while the upstream data source is restored.",
    status: "published",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    source: "fallback",
  },
];

export function getFallbackArticles() {
  return fallbackArticles;
}

export function getFallbackArticleBySlug(slug: string) {
  return fallbackArticles.find((article) => article.slug === slug) ?? null;
}
