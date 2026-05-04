import React, { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Article } from "@/hooks/useArticles"

export interface ImageCard {
  id: string
  src: string
  alt: string
  rotation: number
}

export interface ImageCarouselHeroProps {
  articles?: Article[]
  title?: string
  subtitle?: string
  description?: string
  ctaText?: string
  onCtaClick?: () => void
  features?: Array<{
    title: string
    description: string
  }>
}

export function ImageCarouselHero({
  articles = [],
  title = "World News Coverage",
  subtitle = "Global Headlines", 
  description = "Stay updated with breaking news from around the world, curated daily by our expert journalists.",
  ctaText = "Explore Latest",
  onCtaClick,
  features = [
    {
      title: "Breaking News",
      description: "Real-time updates as stories unfold",
    },
    {
      title: "Verified Sources", 
      description: "Curated from trusted global outlets",
    },
    {
      title: "Diverse Coverage",
      description: "Politics, tech, science, culture & more",
    },
  ],
}: ImageCarouselHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [rotatingCards, setRotatingCards] = useState<number[]>([])

  // Images from articles or demo
  const images: ImageCard[] = React.useMemo(() => 
    articles.slice(0, 8).map((article, i) => ({
      id: article.id,
      src: article.cover_image_url || "/placeholder.svg",
      alt: article.title,
      rotation: (i * 45) - 90,
    }))
  , [articles])

  // Continuous rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingCards((prev) => prev.map((_, i) => (prev[i] || 0) + 0.5 % 360))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Init rotation
  useEffect(() => {
    setRotatingCards(images.map((_, i) => i * (360 / images.length)))
  }, [images.length])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <div className="relative w-full py-20 md:py-32 bg-gradient-to-b from-background via-background/50 to-background overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center text-center">
        {/* Carousel */}
        <div
          className="relative w-full max-w-4xl h-64 md:h-80 mb-12"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="absolute inset-0 flex items-center justify-center" style={{perspective: '1000px'}}>
            {images.map((image, index) => {
              const angle = (rotatingCards[index] || 0) * (Math.PI / 180)
              const radius = 160
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              const perspectiveX = (mousePosition.x - 0.5) * 20
              const perspectiveY = (mousePosition.y - 0.5) * 20

              return (
                <div
                  key={image.id}
                  className="absolute w-24 h-32 md:w-32 md:h-40 transition-all duration-300"
                  style={{
                    transform: `
                      translate(${x}px, ${y}px)
                      rotateX(${perspectiveY}deg) 
                      rotateY(${perspectiveX}deg)
                      rotateZ(${image.rotation}deg)
                    `,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className={cn(
                      "relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border",
                      "transition-all duration-300 hover:shadow-3xl hover:scale-110 cursor-pointer group",
                    )}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-2xl"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            {subtitle} - {description}
          </p>
          
          <button
            onClick={onCtaClick}
            className={cn(
              "inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
              "active:scale-95 focus-visible:outline-none focus-visible:ring-2 ring-ring ring-offset-2",
              "group"
            )}
          >
            {ctaText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Features */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group p-8 rounded-2xl border bg-card hover:bg-card/80",
                "hover:border-primary/50 hover:shadow-xl transition-all duration-300",
                "backdrop-blur-sm"
              )}
            >
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

