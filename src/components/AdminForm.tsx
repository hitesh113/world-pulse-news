import { useState, useEffect } from "react";
import { useCreateArticle, useUpdateArticle, type Article } from "@/hooks/useArticles";
import { toast } from "sonner";

const categories = ["world", "tech", "sports", "business", "politics"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface AdminFormProps {
  article: Article | null;
  onClose: () => void;
}

export default function AdminForm({ article, onClose }: AdminFormProps) {
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const isEdit = !!article;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "world",
    author: "",
    cover_image_url: "",
    excerpt: "",
    body: "",
    status: "draft",
  });

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title,
        slug: article.slug,
        category: article.category || "world",
        author: article.author || "",
        cover_image_url: article.cover_image_url || "",
        excerpt: article.excerpt || "",
        body: article.body || "",
        status: article.status || "draft",
      });
    }
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && !isEdit ? { slug: slugify(value) } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      published_at: form.status === "published" ? new Date().toISOString() : null,
      source: "manual" as string,
    };

    if (isEdit) {
      updateArticle.mutate(
        { id: article.id, ...payload },
        {
          onSuccess: () => {
            toast.success("Article updated.");
            onClose();
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createArticle.mutate(payload, {
        onSuccess: () => {
          toast.success("Article created.");
          onClose();
        },
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">{isEdit ? "Edit Article" : "New Article"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Slug</label>
          <input name="slug" value={form.slug} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            {categories.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Author</label>
          <input name="author" value={form.author} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Cover Image URL</label>
          <input name="cover_image_url" value={form.cover_image_url} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Excerpt</label>
        <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className={inputClass} />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">Body</label>
        <textarea name="body" value={form.body} onChange={handleChange} rows={8} className={inputClass} />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={createArticle.isPending || updateArticle.isPending}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isEdit ? "Update" : "Create"}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
