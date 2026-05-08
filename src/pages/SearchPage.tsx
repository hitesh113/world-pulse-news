import { useState } from "react";
import { useSearchArticles } from "@/hooks/useArticles";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleGrid from "@/components/ArticleGrid";
import BackButton from "@/components/BackButton";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data: results, isLoading } = useSearchArticles(query);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <BackButton />
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>
        </div>

        {!query ? (
          <p className="text-center text-muted-foreground">Type to search articles.</p>
        ) : isLoading ? (
          <p className="text-center text-muted-foreground">Searching...</p>
        ) : results && results.length > 0 ? (
          <ArticleGrid articles={results} />
        ) : (
          <p className="text-center text-muted-foreground">No results found for "{query}".</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
