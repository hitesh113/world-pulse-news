"use client"

import { ImageCarouselHero } from "@/components/ui/ai-image-generator-hero"
import { useArticles } from "@/hooks/useArticles"

export default function AiImageGeneratorHeroDemo() {
  const { data: articles } = useArticles()

  const handleCtaClick = () => {
    window.location.href = "/search"
  }

  return (
    <ImageCarouselHero
      articles={articles || []}
      title="World Pulse News"
      subtitle="Global Headlines Live"
      description="Breaking stories from around the world, delivered instantly"
      ctaText="Browse All Stories"
      onCtaClick={handleCtaClick}
    />
  )
}

