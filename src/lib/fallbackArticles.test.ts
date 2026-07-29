import { describe, expect, it } from "vitest";
import { getFallbackArticles, getFallbackArticleBySlug } from "./fallbackArticles";

describe("fallback articles", () => {
  it("returns a non-empty fallback feed", () => {
    const articles = getFallbackArticles();

    expect(articles.length).toBeGreaterThan(0);
    expect(articles[0].title).toContain("World Pulse");
  });

  it("finds a fallback article by slug", () => {
    const article = getFallbackArticleBySlug("ai-in-creative-work");

    expect(article?.slug).toBe("ai-in-creative-work");
  });
});
