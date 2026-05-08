import { useState } from "react";
import { useAllArticlesAdmin, useDeleteArticle } from "@/hooks/useArticles";
import AdminForm from "@/components/AdminForm";
import { Pencil, Trash2, Plus, RefreshCw } from "lucide-react";
import type { Article } from "@/hooks/useArticles";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function AdminPage() {
  const { data: articles, isLoading, refetch } = useAllArticlesAdmin();
  const deleteArticle = useDeleteArticle();
  const [editing, setEditing] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchNews = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-news");
      if (error) throw error;
      toast.success(`Fetched ${data.inserted} new articles from GNews API!`);
      refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch news";
      toast.error(message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this article?")) return;
    deleteArticle.mutate(id, {
      onSuccess: () => toast.success("Article deleted."),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFetchNews}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Fetching..." : "Fetch News"}
            </button>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" /> Add Article
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 p-6 border border-border rounded-lg bg-card">
            <AdminForm
              article={editing}
              onClose={() => { setShowForm(false); setEditing(null); }}
            />
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-medium text-muted-foreground">Title</th>
                  <th className="py-3 pr-4 font-medium text-muted-foreground">Category</th>
                  <th className="py-3 pr-4 font-medium text-muted-foreground">Author</th>
                  <th className="py-3 pr-4 font-medium text-muted-foreground">Status</th>
                  <th className="py-3 pr-4 font-medium text-muted-foreground">Date</th>
                  <th className="py-3 font-medium text-muted-foreground w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles?.map((article) => (
                  <tr key={article.id} className="border-b border-border">
                    <td className="py-3 pr-4 font-medium max-w-xs truncate">{article.title}</td>
                    <td className="py-3 pr-4 capitalize">{article.category}</td>
                    <td className="py-3 pr-4">{article.author}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        article.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditing(article); setShowForm(true); }}
                          className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
