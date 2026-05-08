import { useState } from "react";
import { useArticles } from "@/hooks/useArticles";
import Navbar from "@/components/Navbar";
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import ArticleGrid from "@/components/ArticleGrid";
import SubscribeBanner from "@/components/SubscribeBanner";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function Index() {
  const { data: articles, isLoading, refetch } = useArticles();
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchNews = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-news");
      if (error) throw error;
      toast.success(`Fetched ${data.inserted} new articles from GNews API!`);
      refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch news";
      toast.error(message);
    } finally {
      setIsFetching(false);
    }
  };

  const grid = articles?.slice(0, 20) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6">
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">Loading...</div>
          ) : articles && articles.length > 0 ? (
            <>
              <div className="mb-12 md:mb-20">
                <ScrollMorphHero articles={articles} />
              </div>
              <div className="mt-10">
                <ArticleGrid articles={grid} />
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No articles yet. Let's fetch some news!</p>
              <button
                onClick={handleFetchNews}
                disabled={isFetching}
                className="flex items-center gap-2 px-6 py-3 mx-auto text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                {isFetching ? "Fetching News..." : "Fetch News from GNews"}
              </button>
            </div>
          )}
          <SubscribeBanner />
        </div>
      </main>
      <Footer />
    </div>
  );
}

