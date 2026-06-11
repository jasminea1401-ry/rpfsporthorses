import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getTestimonials, getPageBySlug } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"

const fallbackTestimonials = [
  {
    key: "fallback-1",
    name: "A Happy Rider",
    role: "Lesson Student",
    rating: 5,
    quote: "RPF Sporthorses has been such a wonderful place to learn and grow as a rider. The trainers are patient, knowledgeable, and truly care about every student.",
    photo: null,
  },
]

export default async function TestimonialsPage() {
  const [cmsTestimonials, page] = await Promise.all([getTestimonials(), getPageBySlug("testimonials")])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testimonials = cmsTestimonials.length > 0
    ? cmsTestimonials.map((t: any) => ({
        key: t._id,
        name: t.name,
        role: t.role,
        rating: t.rating,
        quote: t.quote,
        photo: t.photo?.asset ? urlFor(t.photo).width(100).height(100).quality(85).url() : null,
      }))
    : fallbackTestimonials

  const heroEyebrow = page?.hero?.eyebrow || "What Our Riders Say"
  const heroHeading = page?.hero?.heading || "Testimonials"
  const heroSubheading = page?.hero?.subheading || "Hear from the families and riders who are part of the RPF Sporthorses community."

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

      {/* Testimonials grid */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <Card key={t.key} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-amber-400 mb-4" />
                  {t.rating && (
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`}
                        />
                      ))}
                    </div>
                  )}
                  {t.quote && (
                    <p className="text-stone-600 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                  )}
                  <div className="flex items-center gap-3">
                    {t.photo && (
                      <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div>
                      <div className="font-semibold text-stone-900">{t.name}</div>
                      {t.role && <div className="text-sm text-stone-400">{t.role}</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
