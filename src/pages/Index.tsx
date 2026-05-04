import { useArticles } from "@/hooks/useArticles";
import Navbar from "@/components/Navbar";
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import ArticleGrid from "@/components/ArticleGrid";
import SubscribeBanner from "@/components/SubscribeBanner";
import Footer from "@/components/Footer";

export default function Index() {
  const { data: articles, isLoading } = useArticles();

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
            <div className="text-center py-20 text-muted-foreground">
              No articles yet. Check back soon.
            </div>
          )}
          <SubscribeBanner />
        </div>
      </main>
      <Footer />
    </div>
  );
}

