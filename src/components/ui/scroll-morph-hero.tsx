import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Article } from "@/hooks/useArticles";

interface NewsCardProps {
  article: Article;
  index: number;
}

const NewsCard = ({ article, index }: NewsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300"
    >
      <div className="aspect-[16/10] overflow-hidden">
        {article.cover_image_url ? (
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <div className="text-4xl font-bold text-muted-foreground/30">
              {article.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm text-white/80 line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface ScrollMorphHeroProps {
  articles: Article[];
}

export default function ScrollMorphHero({ articles }: ScrollMorphHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredArticles = articles.slice(0, 6);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(featuredArticles.length, 3));
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredArticles.length]);

  if (featuredArticles.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">World Pulse News</h2>
          <p className="text-muted-foreground">Loading latest news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-4">
            World Pulse News
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest global headlines, breaking news, and in-depth analysis from around the world.
          </p>
        </motion.div>

        {/* Featured Articles Carousel */}
        <div className="relative mb-12">
          <div className="overflow-hidden rounded-2xl">
            <motion.div
              animate={{ x: -currentIndex * 100 + "%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex"
            >
              {featuredArticles.slice(0, 3).map((article, index) => (
                <div key={article.id} className="w-full flex-shrink-0">
                  <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                    {article.cover_image_url ? (
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <div className="text-6xl font-bold text-primary/30">
                          {article.title.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                      >
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                          {article.title}
                        </h2>
                        {article.excerpt && (
                          <p className="text-lg text-white/90 mb-4 max-w-2xl">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-white/70">
                          {article.author && <span>By {article.author}</span>}
                          {article.published_at && (
                            <span>
                              {new Date(article.published_at).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {featuredArticles.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  currentIndex === index
                    ? "bg-primary scale-125"
                    : "bg-primary/30 hover:bg-primary/50"
                )}
              />
            ))}
          </div>
        </div>

        {/* Recent Articles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {articles.slice(3, 9).map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}