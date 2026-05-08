import { useParams } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import BackButton from "@/components/BackButton";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { data: articles, isLoading } = useArticles(category);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <BackButton />
        <h1 className="text-3xl font-bold capitalize mb-8">{category}</h1>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : articles && articles.length > 0 ? (
          <ArticleGrid articles={articles} />
        ) : (
          <p className="text-muted-foreground">No articles in this category yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
