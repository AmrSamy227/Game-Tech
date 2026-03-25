"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import type { Game } from "@/lib/gamesData"

export default function MediaGallery({ game }: { game: Game }) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])

  // ✅ Ensure images and videos resolve from public/assets or remote URLs
  const resolvePath = (src: string) => {
    if (!src) return ""
    if (src.startsWith("http")) return src // remote image or video
    return `/assets/${src.replace(/^\/assets\//, "")}` // local asset
  }

  const allMedia = [
    { type: "video", src: game.trailer || "", thumbnail: game.image }, // added thumbnail field for video
    ...game.screenshots.map((src) => ({ type: "image", src, thumbnail: src })),
  ]
    .filter((media) => media.src)
    .map((media) => ({ ...media, src: resolvePath(media.src), thumbnail: resolvePath(media.thumbnail) }))

  const scrollThumbnails = (direction: number) => {
    const newIndex = activeMediaIndex + direction
    if (newIndex >= 0 && newIndex < allMedia.length) {
      setActiveMediaIndex(newIndex)
    }
  }

  useEffect(() => {
    if (scrollContainerRef.current && thumbnailRefs.current[activeMediaIndex]) {
      const activeButton = thumbnailRefs.current[activeMediaIndex]
      const container = scrollContainerRef.current

      const activeRect = activeButton.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // Check if thumbnail is outside visible area and scroll it into view
      if (activeRect.left < containerRect.left) {
        // Thumbnail is to the left, scroll left
        container.scrollLeft -= containerRect.left - activeRect.left + 10
      } else if (activeRect.right > containerRect.right) {
        // Thumbnail is to the right, scroll right
        container.scrollLeft += activeRect.right - containerRect.right + 10
      }
    }
  }, [activeMediaIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        scrollThumbnails(-1)
      } else if (e.key === "ArrowRight") {
        scrollThumbnails(1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeMediaIndex, allMedia.length])

  if (allMedia.length === 0) return null

  return (
    <div ref={containerRef}>
      {/* 🎥 Main Media Display */}
      <div className="relative w-full pb-[50%] mb-3 bg-black rounded overflow-hidden">
        {allMedia[activeMediaIndex].type === "video" && allMedia[activeMediaIndex].src ? (
          <iframe
            src={allMedia[activeMediaIndex].src}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Image
            src={allMedia[activeMediaIndex].src || resolvePath(game.image)}
            alt={`${game.title} media ${activeMediaIndex}`}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* 🎞️ Thumbnail Carousel */}
      <div className="relative">
        {activeMediaIndex > 0 && (
          <button
            onClick={() => scrollThumbnails(-1)}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {activeMediaIndex < allMedia.length - 1 && (
          <button
            onClick={() => scrollThumbnails(1)}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div ref={scrollContainerRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
          {allMedia.map((media, index) => (
            <button
              ref={(el) => {
                thumbnailRefs.current[index] = el
              }}
              key={index}
              onClick={() => setActiveMediaIndex(index)}
             className={`
  relative flex-shrink-0 rounded overflow-hidden transition-all
  w-28 h-16            /*  Mobile size */
  md:w-40 md:h-24      /*  Desktop size */
  ${activeMediaIndex === index ? "ring-2 ring-red-600" : ""}
`}

            >
              {media.type === "video" ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <Play size={24} className="text-white" />
                </div>
              ) : null}
              <Image
                src={media.thumbnail || "/placeholder.svg"} // use thumbnail field instead of media.src
                alt={`Thumbnail ${index}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
