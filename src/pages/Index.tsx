import { useState, useEffect } from "react";
import { useArticles } from "@/hooks/useArticles";
import Navbar from "@/components/Navbar";
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import ArticleGrid from "@/components/ArticleGrid";
import SubscribeBanner from "@/components/SubscribeBanner";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

export default function Index() {
  const { data: articles, isLoading, refetch } = useArticles();
  const [isFetching, setIsFetching] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const handleFetchNews = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-news");
      if (error) throw error;
      toast.success(`Fetched ${data.inserted} new articles from GNews API!`);
      refetch();
      setLastUpdate(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch news";
      toast.error(message);
    } finally {
      setIsFetching(false);
    }
  };

  // Auto-fetch news every 30 minutes if live mode is enabled
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      handleFetchNews();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [isLiveMode]);

  // Initial fetch on mount
  useEffect(() => {
    if (articles && articles.length === 0) {
      handleFetchNews();
    }
  }, []);

  const grid = articles?.slice(0, 20) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6">
          {/* Live Updates Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                isLiveMode
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              }`}>
                {isLiveMode ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                {isLiveMode ? "Live Updates" : "Manual Mode"}
              </div>
              <span className="text-sm text-muted-foreground">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isLiveMode
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {isLiveMode ? "Disable Live" : "Enable Live"}
              </button>
              <button
                onClick={handleFetchNews}
                disabled={isFetching}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                {isFetching ? "Fetching..." : "Refresh News"}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="text-muted-foreground">Loading latest news...</span>
              </div>
            </div>
          ) : articles && articles.length > 0 ? (
            <>
              <div className="mb-12 md:mb-20">
                <ScrollMorphHero articles={articles} />
              </div>
              <div className="mt-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-foreground">Latest Articles</h2>
                  <span className="text-sm text-muted-foreground">
                    {articles.length} articles available
                  </span>
                </div>
                <ArticleGrid articles={grid} />
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📰</div>
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

