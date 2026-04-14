import { Link } from "react-router-dom";
import type { Article } from "@/hooks/useArticles";
import CategoryBadge from "./CategoryBadge";

export default function HeroCard({ article }: { article: Article }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg aspect-[16/9] md:aspect-[21/9] bg-muted">
        {article.cover_image_url && (
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          {article.category && <CategoryBadge category={article.category} />}
          <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground mt-2 leading-tight">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-primary-foreground/80 mt-2 text-sm md:text-base line-clamp-2 max-w-2xl">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3 text-xs text-primary-foreground/60">
            {article.author && <span>{article.author}</span>}
            {article.author && date && <span>·</span>}
            {date && <span>{date}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
