export default function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-news-badge text-news-badge-foreground rounded-sm">
      {category}
    </span>
  );
}
