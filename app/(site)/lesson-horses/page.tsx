import { Card, CardContent } from "@/components/ui/card"
import { getLessonHorses, getPageBySlug } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"

const fallbackHorses = [
  {
    key: "fallback-1",
    name: "Lesson Horse",
    age: null,
    height: null,
    breed: null,
    bio: "Our lesson horses are the heart of our program — patient, well-schooled partners for riders of every level.",
    photo: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&auto=format&fit=crop",
  },
]

export default async function LessonHorsesPage() {
  const [cmsHorses, page] = await Promise.all([getLessonHorses(), getPageBySlug("lesson-horses")])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const horses = cmsHorses.length > 0
    ? cmsHorses.map((h: any) => ({
        key: h._id,
        name: h.name,
        age: h.age,
        height: h.height,
        breed: h.breed,
        bio: h.bio,
        photo: h.photo?.asset
          ? urlFor(h.photo).width(600).height(600).quality(85).url()
          : "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&auto=format&fit=crop",
      }))
    : fallbackHorses

  const heroEyebrow = page?.hero?.eyebrow || "Meet The Herd"
  const heroHeading = page?.hero?.heading || "Lesson Horses"
  const heroSubheading = page?.hero?.subheading || "The patient, talented school masters who teach our riders every day."

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

      {/* Horses grid */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {horses.map((horse) => (
              <Card key={horse.key} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={horse.photo}
                  alt={horse.name || "Lesson horse"}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">{horse.name}</h3>
                  {(horse.age || horse.height || horse.breed) && (
                    <div className="text-amber-600 text-sm font-medium mb-3">
                      {[
                        horse.age ? `${horse.age}-year-old` : null,
                        horse.height,
                        horse.breed,
                      ].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  {horse.bio && (
                    <p className="text-stone-500 text-sm leading-relaxed">{horse.bio}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
