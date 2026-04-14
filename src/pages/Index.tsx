import { useArticles } from "@/hooks/useArticles";
import Navbar from "@/components/Navbar";
import HeroCard from "@/components/HeroCard";
import ArticleGrid from "@/components/ArticleGrid";
import SubscribeBanner from "@/components/SubscribeBanner";
import Footer from "@/components/Footer";

export default function Index() {
  const { data: articles, isLoading } = useArticles();

  const hero = articles?.[0];
  const grid = articles?.slice(1, 10) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6">
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">Loading...</div>
          ) : hero ? (
            <>
              <HeroCard article={hero} />
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
