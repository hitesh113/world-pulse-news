import { useParams, Link, useNavigate } from "react-router-dom";
import { useArticleBySlug, useArticles } from "@/hooks/useArticles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryBadge from "@/components/CategoryBadge";
import ArticleGrid from "@/components/ArticleGrid";
import { Twitter, Facebook, LinkIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: article, isLoading } = useArticleBySlug(slug || "");
  const { data: related } = useArticles(article?.category || undefined);

  const relatedArticles = related?.filter((a) => a.id !== article?.id).slice(0, 3) ?? [];

  const date = article?.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Article not found.</p>
          <Link to="/" className="text-sm text-foreground underline">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <article className="container max-w-3xl py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          {article.category && <CategoryBadge category={article.category} />}
          <h1 className="text-3xl md:text-4xl font-bold mt-3 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            {article.author && <span>{article.author}</span>}
            {article.author && date && <span>·</span>}
            {date && <span>{date}</span>}
          </div>

          {article.cover_image_url && (
            <div className="mt-6 rounded-lg overflow-hidden aspect-[16/9] bg-muted">
              <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="mt-8 prose prose-neutral max-w-none text-foreground leading-relaxed whitespace-pre-line">
            {article.body}
          </div>

          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
            <span className="text-xs text-muted-foreground mr-2">Share</span>
            <button onClick={copyLink} className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <LinkIcon className="h-4 w-4" />
            </button>
            <a href="#" className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="container py-8 border-t border-border">
            <h2 className="text-xl font-bold mb-6">Related Articles</h2>
            <ArticleGrid articles={relatedArticles} />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
