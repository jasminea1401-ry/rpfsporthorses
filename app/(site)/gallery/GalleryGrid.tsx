"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/ux/Reveal"

const categories = ["All", "Show Series", "Regionals", "Lessons/Training", "Others"]

export type GalleryItem = { src: string; category: string; caption: string; orientation?: "horizontal" | "vertical" }

function ImageTile({ img, onClick }: { img: GalleryItem; onClick: () => void }) {
  return (
    <div
      className="group cursor-pointer relative overflow-hidden rounded-xl w-full h-full"
      onClick={onClick}
    >
      <img
        src={img.src}
        alt={img.caption}
        className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-xl flex items-end">
        <p className="text-white text-sm font-medium p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {img.caption}
        </p>
      </div>
    </div>
  )
}

export function GalleryGrid({ images }: { images: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [lightbox, setLightbox] = useState<string | null>(null)

  const filtered = activeCategory === "All" ? images : images.filter((i) => i.category === activeCategory)
  const horizontal = filtered.filter((i) => i.orientation !== "vertical")
  const vertical = filtered.filter((i) => i.orientation === "vertical")

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
            <div className="space-y-4">
              {horizontal.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4">
                  {horizontal.map((img, i) => (
                    <Reveal
                      key={`${activeCategory}-${i}`}
                      delay={(i % 3) * 100}
                      className="aspect-[4/3] w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
                    >
                      <ImageTile img={img} onClick={() => setLightbox(img.src)} />
                    </Reveal>
                  ))}
                </div>
              )}
              {vertical.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4">
                  {vertical.map((img, i) => (
                    <Reveal
                      key={`${activeCategory}-${i}`}
                      delay={(i % 4) * 100}
                      className="aspect-[3/4] w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]"
                    >
                      <ImageTile img={img} onClick={() => setLightbox(img.src)} />
                    </Reveal>
                  ))}
                </div>
              )}
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
