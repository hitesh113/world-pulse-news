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
      // Using mock data for development
      const mockArticles: Article[] = [
        {
          id: "1",
          title: "Global Climate Summit Reaches Historic Agreement",
          slug: "global-climate-summit-agreement",
          category: "world",
          author: "World Pulse News",
          excerpt: "World leaders unite on ambitious carbon reduction targets in unprecedented climate accord.",
          body: "In a groundbreaking development, representatives from 195 countries have reached a consensus on aggressive climate action measures. The agreement, signed at the Global Climate Summit in Geneva, commits nations to reduce carbon emissions by 50% by 2030 and achieve net-zero emissions by 2050. The pact includes provisions for technology transfer to developing nations and a $100 billion annual fund for climate adaptation projects.",
          status: "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          source: "manual"
        },
        {
          id: "2",
          title: "Revolutionary AI Breakthrough in Medical Diagnostics",
          slug: "ai-breakthrough-medical-diagnostics",
          category: "tech",
          author: "Tech Correspondent",
          excerpt: "New AI system achieves 99.7% accuracy in early cancer detection, potentially saving millions of lives.",
          body: "A team of researchers at Stanford University has developed an AI system that can detect early-stage cancers with unprecedented accuracy. The system, trained on millions of medical images and patient data, achieved a 99.7% success rate in clinical trials. The technology uses advanced machine learning algorithms to identify subtle patterns that human doctors might miss, potentially revolutionizing preventive healthcare worldwide.",
          status: "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          source: "manual"
        },
        {
          id: "3",
          title: "Champions League Final: Underdogs Claim Victory",
          slug: "champions-league-final-underdogs-win",
          category: "sports",
          author: "Sports Editor",
          excerpt: "In a stunning upset, the underdog team defeats the heavily favored champions in dramatic fashion.",
          body: "The football world was shaken as the unexpected champions lifted the prestigious Champions League trophy. Coming from behind twice in the match, the team's resilience and tactical brilliance turned the game around in the final minutes. The victory marks a new era for the club and has inspired fans worldwide with its message of determination and belief.",
          status: "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          source: "manual"
        },
        {
          id: "4",
          title: "Stock Markets Surge on Economic Recovery News",
          slug: "stock-markets-surge-economic-recovery",
          category: "business",
          author: "Business Analyst",
          excerpt: "Major indices hit record highs as positive economic indicators boost investor confidence.",
          body: "Global stock markets experienced a significant rally today following the release of stronger-than-expected economic data. The Dow Jones Industrial Average climbed 2.3%, while the S&P 500 and Nasdaq Composite also posted substantial gains. Analysts attribute the surge to improved employment figures, rising consumer spending, and positive manufacturing data that suggest a robust economic recovery.",
          status: "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          source: "manual"
        },
        {
          id: "5",
          title: "Election Results Spark National Debate",
          slug: "election-results-national-debate",
          category: "politics",
          author: "Political Correspondent",
          excerpt: "Close election results lead to intense discussions about democratic processes and future policies.",
          body: "The nation remains divided following the closely contested election results. With votes still being counted in several key districts, political analysts are examining the implications for policy directions and governance. The outcome has sparked widespread debate about electoral reforms, campaign financing, and the role of social media in modern politics. Both major parties have called for unity while preparing for potential legal challenges.",
          status: "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          source: "manual"
        }
      ];

      return category
        ? mockArticles.filter(article => article.category === category)
        : mockArticles;
    },
  });
}

export function useArticleBySlug(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      // Using mock data for development
      const mockArticles = [
        {
          id: "1",
          title: "Global Climate Summit Reaches Historic Agreement",
          slug: "global-climate-summit-agreement",
          category: "world",
          author: "World Pulse News",
          excerpt: "World leaders unite on ambitious carbon reduction targets in unprecedented climate accord.",
          body: "In a groundbreaking development, representatives from 195 countries have reached a consensus on aggressive climate action measures. The agreement, signed at the Global Climate Summit in Geneva, commits nations to reduce carbon emissions by 50% by 2030 and achieve net-zero emissions by 2050. The pact includes provisions for technology transfer to developing nations and a $100 billion annual fund for climate adaptation projects.\n\nThe historic accord represents a turning point in international climate cooperation, with unprecedented commitments from both developed and developing nations. Environmental experts have hailed the agreement as a critical step toward limiting global warming to 1.5 degrees Celsius above pre-industrial levels.",
          status: "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          source: "manual"
        },
        {
          id: "2",
          title: "Revolutionary AI Breakthrough in Medical Diagnostics",
          slug: "ai-breakthrough-medical-diagnostics",
          category: "tech",
          author: "Tech Correspondent",
          excerpt: "New AI system achieves 99.7% accuracy in early cancer detection, potentially saving millions of lives.",
          body: "A team of researchers at Stanford University has developed an AI system that can detect early-stage cancers with unprecedented accuracy. The system, trained on millions of medical images and patient data, achieved a 99.7% success rate in clinical trials. The technology uses advanced machine learning algorithms to identify subtle patterns that human doctors might miss, potentially revolutionizing preventive healthcare worldwide.\n\nThe AI system has been tested across multiple cancer types including breast, lung, and skin cancers. Early results show it can detect malignancies up to six months earlier than traditional screening methods, significantly improving patient outcomes and survival rates.",
          status: "published",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          source: "manual"
        }
      ];

      const article = mockArticles.find(a => a.slug === slug);
      if (!article) throw new Error("Article not found");
      return article;
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
      return data as Article[];
    },
    enabled: !!query,
  });
}

export function useAllArticlesAdmin() {
  return useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data as Article[];
      } catch (error) {
        // Fallback to mock data
        console.warn("Using mock data for admin articles:", error);
        return [
          {
            id: "1",
            title: "Global Climate Summit Reaches Historic Agreement",
            slug: "global-climate-summit-agreement",
            category: "world",
            author: "World Pulse News",
            excerpt: "World leaders unite on ambitious carbon reduction targets in unprecedented climate accord.",
            body: "In a groundbreaking development...",
            status: "published",
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            source: "manual"
          },
          {
            id: "2",
            title: "Revolutionary AI Breakthrough in Medical Diagnostics",
            slug: "ai-breakthrough-medical-diagnostics",
            category: "tech",
            author: "Tech Correspondent",
            excerpt: "New AI system achieves 99.7% accuracy in early cancer detection.",
            body: "A team of researchers at Stanford University...",
            status: "draft",
            published_at: null,
            created_at: new Date().toISOString(),
            source: "manual"
          }
        ];
      }
    },
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (article: Omit<Article, "id" | "created_at">) => {
      const { data, error } = await supabase.from("articles").insert(article).select().single();
      if (error) throw error;
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
      const { data, error } = await supabase.from("articles").update(updates).eq("id", id).select().single();
      if (error) throw error;
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
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    },
  });
}
