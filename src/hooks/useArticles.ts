import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Article = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  author: string | null;
  cover_image_url: string | null;
  excerpt: string | null;
  body: string | null;
  status: string | null;
  published_at: string | null;
  created_at: string;
  source: string | null;
};

export function useArticles(category?: string) {
  return useQuery({
    queryKey: ["articles", category],
    queryFn: async () => {
      let q = supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (category) q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Article[];
    },
  });
}

export function useArticleBySlug(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Article not found");
      return data as Article;
    },
    enabled: !!slug,
  });
}

export function useSearchArticles(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Article[];
    },
    enabled: !!query,
  });
}

// Admin-only functions with authorization checks
export function useAllArticlesAdmin() {
  return useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");

      // Check admin authorization
      const isAdmin = session.user.user_metadata?.role === 'admin' ||
                     session.user.email === 'admin@worldpulse.app';
      if (!isAdmin) throw new Error("Admin access required");

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Article[];
    },
  });
}

async function notifyIfPublished(article: Partial<Article>) {
  if (article.status !== "published" || !article.title || !article.slug) return;
  try {
    await supabase.functions.invoke("notify-subscribers", {
      body: {
        title: article.title,
        excerpt: article.excerpt ?? "",
        slug: article.slug,
      },
    });
  } catch (err) {
    console.warn("notify-subscribers failed:", err);
  }
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (article: Omit<Article, "id" | "created_at">) => {
      // Check authentication and authorization
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");

      const isAdmin = session.user.user_metadata?.role === 'admin' ||
                     session.user.email === 'admin@worldpulse.app';
      if (!isAdmin) throw new Error("Admin access required");

      // Validate input
      if (!article.title?.trim()) throw new Error("Title is required");
      if (!article.slug?.trim()) throw new Error("Slug is required");
      if (article.title.length > 200) throw new Error("Title too long");
      if (article.excerpt && article.excerpt.length > 500) throw new Error("Excerpt too long");

      const { data, error } = await supabase.from("articles").insert(article).select().single();
      if (error) throw error;
      await notifyIfPublished(data as Article);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Article> & { id: string }) => {
      // Check authentication and authorization
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");

      const isAdmin = session.user.user_metadata?.role === 'admin' ||
                     session.user.email === 'admin@worldpulse.app';
      if (!isAdmin) throw new Error("Admin access required");

      // Validate input
      if (updates.title && updates.title.length > 200) throw new Error("Title too long");
      if (updates.excerpt && updates.excerpt.length > 500) throw new Error("Excerpt too long");

      const { data: prev } = await supabase.from("articles").select("status").eq("id", id).maybeSingle();
      const { data, error } = await supabase.from("articles").update(updates).eq("id", id).select().single();
      if (error) throw error;
      // Only notify when transitioning to published
      if (prev?.status !== "published" && (data as Article).status === "published") {
        await notifyIfPublished(data as Article);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Check authentication and authorization
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");

      const isAdmin = session.user.user_metadata?.role === 'admin' ||
                     session.user.email === 'admin@worldpulse.app';
      if (!isAdmin) throw new Error("Admin access required");

      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    },
  });
}
