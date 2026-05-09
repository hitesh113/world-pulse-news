import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Article } from "@/hooks/useArticles";
import CategoryBadge from "./CategoryBadge";
import { Clock, User } from "lucide-react";

export default function ArticleCard({ article }: { article: Article }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/article/${article.slug}`} className="group block">
        <div className="overflow-hidden rounded-lg aspect-[16/10] bg-muted shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          {article.cover_image_url ? (
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <div className="text-4xl font-bold text-primary/40">
                {article.title.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-2">
          {article.category && <CategoryBadge category={article.category} />}
          <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{article.author}</span>
                </div>
              )}
              {date && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{date}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
