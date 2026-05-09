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

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!form.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(form.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (form.author && form.author.length > 100) {
      newErrors.author = "Author name must be less than 100 characters";
    }

    if (form.excerpt && form.excerpt.length > 500) {
      newErrors.excerpt = "Excerpt must be less than 500 characters";
    }

    if (form.cover_image_url && !/^https?:\/\/.+/.test(form.cover_image_url)) {
      newErrors.cover_image_url = "Cover image URL must be a valid HTTP/HTTPS URL";
    }

    if (!categories.includes(form.category)) {
      newErrors.category = "Invalid category selected";
    }

    if (!["draft", "published"].includes(form.status)) {
      newErrors.status = "Invalid status selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      if (isEdit) {
        await updateArticle.mutateAsync({ id: article.id, ...form });
        toast.success("Article updated successfully");
      } else {
        await createArticle.mutateAsync(form);
        toast.success("Article created successfully");
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save article");
    }
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : slugify(title)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            maxLength={200}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            pattern="[a-z0-9-]+"
          />
          {errors.slug && <p className="text-sm text-red-500 mt-1">{errors.slug}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            maxLength={100}
          />
          {errors.author && <p className="text-sm text-red-500 mt-1">{errors.author}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status *</label>
          <select
            value={form.status}
            onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input
            type="url"
            value={form.cover_image_url}
            onChange={(e) => setForm(prev => ({ ...prev, cover_image_url: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="https://example.com/image.jpg"
          />
          {errors.cover_image_url && <p className="text-sm text-red-500 mt-1">{errors.cover_image_url}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            rows={3}
            maxLength={500}
            placeholder="Brief summary of the article..."
          />
          <p className="text-xs text-muted-foreground mt-1">{form.excerpt.length}/500 characters</p>
          {errors.excerpt && <p className="text-sm text-red-500 mt-1">{errors.excerpt}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Body</label>
          <textarea
            value={form.body}
            onChange={(e) => setForm(prev => ({ ...prev, body: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            rows={10}
            placeholder="Full article content..."
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={createArticle.isPending || updateArticle.isPending}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {createArticle.isPending || updateArticle.isPending ? "Saving..." : (isEdit ? "Update" : "Create")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-input rounded-md hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
