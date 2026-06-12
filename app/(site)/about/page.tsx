import { PortableText } from "@portabletext/react"
import { Card, CardContent } from "@/components/ui/card"
import { getPageBySlug, getTrainers } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"

export default async function AboutPage() {
  const [page, trainers] = await Promise.all([getPageBySlug("about"), getTrainers()])

  const heroEyebrow = page?.hero?.eyebrow || "Who We Are"
  const heroHeading = page?.hero?.heading || "About RPF Sporthorses"
  const heroSubheading = page?.hero?.subheading || "A legacy of excellence rooted in passion, discipline, and an unwavering love for the sport."
  const heroImage = page?.hero?.image?.asset
    ? urlFor(page.hero.image).width(1200).quality(80).url()
    : "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&auto=format&fit=crop"
  const hasContent = Array.isArray(page?.content) && page.content.length > 0

  const storyEyebrow = page?.primarySection?.eyebrow || "Our History"
  const storyHeading = page?.primarySection?.heading || "Where It All Began"
  const fallbackStoryImages = [
    "https://images.unsplash.com/photo-1534891960444-baf0c40e8b39?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566197869012-e3e5fed6a1a5?w=600&auto=format&fit=crop",
  ]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storyImages = page?.primarySection?.images?.length > 0
    ? page.primarySection.images.map((img: any) => urlFor(img).width(600).quality(85).url())
    : fallbackStoryImages

  return (
    <>
      {/* Page hero */}
      <section className="relative pt-32 pb-20 bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 uppercase tracking-widest text-xs font-semibold mb-3">{heroEyebrow}</p>
          <h1 className="font-serif text-5xl font-bold text-white mb-4">{heroHeading}</h1>
          <p className="text-stone-300 max-w-2xl mx-auto">
            {heroSubheading}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-3">{storyEyebrow}</p>
              <h2 className="font-serif text-4xl font-bold text-stone-900 mb-6">{storyHeading}</h2>
              {hasContent ? (
                <div className="space-y-4 text-stone-600 leading-relaxed">
                  <PortableText value={page.content} />
                </div>
              ) : (
                <div className="space-y-4 text-stone-600 leading-relaxed">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src={storyImages[0]}
                alt="Horse and rider"
                className="rounded-xl w-full h-64 object-cover"
              />
              {storyImages[1] && (
                <img
                  src={storyImages[1]}
                  alt="Training session"
                  className="rounded-xl w-full h-64 object-cover mt-8"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trainers */}
      {trainers.length > 0 && (
        <section className="py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-3">Our People</p>
              <h2 className="font-serif text-4xl font-bold text-stone-900">Meet Our Trainers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {trainers.map((t: any) => (
                <Card key={t._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {t.photo?.asset && (
                    <img
                      src={urlFor(t.photo).width(500).height(400).quality(85).url()}
                      alt={t.name}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-bold text-stone-900">{t.name}</h3>
                    {t.title && <div className="text-amber-600 text-sm font-medium mb-3">{t.title}</div>}
                    {Array.isArray(t.bio) && t.bio.length > 0 && (
                      <div className="text-stone-500 text-sm leading-relaxed space-y-2 max-h-80 overflow-y-auto pr-2">
                        <PortableText value={t.bio} />
                      </div>
                    )}
                    {t.specialties?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {t.specialties.map((s: string) => (
                          <span key={s} className="text-xs bg-blue-50 text-blue-900 px-2 py-1 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

    </>
  )
}
