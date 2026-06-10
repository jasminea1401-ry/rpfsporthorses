"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

const categories = ["All", "Shows", "Training", "Horses", "Team", "Events"]

export type GalleryItem = { src: string; category: string; caption: string }

export function GalleryGrid({ images }: { images: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [lightbox, setLightbox] = useState<string | null>(null)

  const filtered = activeCategory === "All" ? images : images.filter((i) => i.category === activeCategory)

  return (
    <>
      {/* Filter tabs */}
      <section className="py-8 bg-white border-b border-stone-200 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeCategory === cat
                    ? "bg-blue-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-center text-stone-400 py-12">No images in this category yet.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filtered.map((img, i) => (
                <div
                  key={i}
                  className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-xl"
                  onClick={() => setLightbox(img.src)}
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-xl flex items-end">
                    <p className="text-white text-sm font-medium p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt=""
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-stone-300"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
