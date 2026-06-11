import { getGalleryImages, getPageBySlug } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"
import { GalleryGrid, type GalleryItem } from "./GalleryGrid"

const fallbackImages: GalleryItem[] = [
  { src: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&auto=format&fit=crop", category: "Shows", caption: "Regional Championship 2024" },
  { src: "https://images.unsplash.com/photo-1534891960444-baf0c40e8b39?w=800&auto=format&fit=crop", category: "Training", caption: "Morning training session" },
  { src: "https://images.unsplash.com/photo-1566197869012-e3e5fed6a1a5?w=800&auto=format&fit=crop", category: "Horses", caption: "Our beautiful sport horses" },
  { src: "https://images.unsplash.com/photo-1559310278-18a9192d7c03?w=800&auto=format&fit=crop", category: "Training", caption: "Jumping clinic" },
  { src: "https://images.unsplash.com/photo-1598677886878-a0b85f2e6f2a?w=800&auto=format&fit=crop", category: "Shows", caption: "Horse show day" },
  { src: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&auto=format&fit=crop", category: "Horses", caption: "Paddock time" },
  { src: "https://images.unsplash.com/photo-1553545985-1e0d8781d5db?w=800&auto=format&fit=crop", category: "Team", caption: "The RPF team" },
  { src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop", category: "Events", caption: "Summer camp 2024" },
  { src: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&auto=format&fit=crop&sat=-50", category: "Training", caption: "Cross-country schooling" },
]

export default async function GalleryPage() {
  const [cmsImages, page] = await Promise.all([getGalleryImages(), getPageBySlug("gallery")])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const images: GalleryItem[] = cmsImages.length > 0
    ? cmsImages
        .filter((img: any) => img.image?.asset)
        .map((img: any) => {
          const dims = img.dimensions
          const orientation: GalleryItem["orientation"] =
            dims && dims.height > dims.width ? "vertical" : "horizontal"
          return {
            src: urlFor(img.image).width(800).quality(85).url(),
            category: img.category || "Shows",
            caption: img.caption || img.title || "",
            orientation,
          }
        })
    : fallbackImages

  const heroEyebrow = page?.hero?.eyebrow || "Our Photo Gallery"
  const heroHeading = page?.hero?.heading || "Gallery"
  const heroSubheading = page?.hero?.subheading || "A glimpse into the world of RPF Sporthorses — from our training sessions to championship victories."

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-stone-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 uppercase tracking-widest text-xs font-semibold mb-3">{heroEyebrow}</p>
          <h1 className="font-serif text-5xl font-bold text-white mb-4">{heroHeading}</h1>
          <p className="text-stone-300 max-w-xl mx-auto">
            {heroSubheading}
          </p>
        </div>
      </section>

      <GalleryGrid images={images} />
    </>
  )
}
