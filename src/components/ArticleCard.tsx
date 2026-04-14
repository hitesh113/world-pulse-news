import { Link } from "react-router-dom";
import type { Article } from "@/hooks/useArticles";
import CategoryBadge from "./CategoryBadge";

export default function ArticleCard({ article }: { article: Article }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg aspect-[16/10] bg-muted">
        {article.cover_image_url ? (
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full bg-news-surface" />
        )}
      </div>
      <div className="mt-3">
        {article.category && <CategoryBadge category={article.category} />}
        <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground group-hover:text-muted-foreground transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          {article.author && <span>{article.author}</span>}
          {article.author && date && <span>·</span>}
          {date && <span>{date}</span>}
        </div>
      </div>
    </Link>
  );
}
