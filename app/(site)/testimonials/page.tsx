import { Star, Quote } from "lucide-react"
import { getTestimonials, getPageBySlug } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"
import { Reveal } from "@/components/ux/Reveal"

type Testimonial = {
  key: string
  name: string
  role?: string
  rating?: number
  quote?: string
  photo: string | null
}

const fallbackTestimonials: Testimonial[] = [
  {
    key: "fallback-1",
    name: "A Happy Rider",
    role: "Lesson Student",
    rating: 5,
    quote:
      "RPF Sporthorses has been such a wonderful place to learn and grow as a rider. The trainers are patient, knowledgeable, and truly care about every student.",
    photo: null,
  },
]

function Stars({ rating }: { rating?: number }) {
  if (!rating) return null
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
      ))}
    </div>
  )
}

function Avatar({ photo, name, size }: { photo: string | null; name: string; size: number }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="rounded-full object-cover shrink-0 ring-2 ring-amber-100"
        style={{ width: size, height: size }}
      />
    )
  }
  const initial = name?.trim()?.[0]?.toUpperCase() || "♥"
  return (
    <div
      className="rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-serif font-bold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  )
}

export default async function TestimonialsPage() {
  const [cmsTestimonials, page] = await Promise.all([getTestimonials(), getPageBySlug("testimonials")])

  const testimonials: Testimonial[] =
    cmsTestimonials.length > 0
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cmsTestimonials.map((t: any) => ({
          key: t._id,
          name: t.name,
          role: t.role,
          rating: t.rating,
          quote: t.quote,
          photo: t.photo?.asset ? urlFor(t.photo).width(400).height(400).quality(85).url() : null,
        }))
      : fallbackTestimonials

  // Feature the most substantial testimonial (longest quote) up top
  const featured = testimonials.reduce(
    (best, t) => ((t.quote?.length || 0) > (best?.quote?.length || 0) ? t : best),
    testimonials[0]
  )
  const rest = testimonials.filter((t) => t.key !== featured?.key)

  const heroEyebrow = page?.hero?.eyebrow || "What Our Riders Say"
  const heroHeading = page?.hero?.heading || "Testimonials"
  const heroSubheading =
    page?.hero?.subheading || "Hear from the families and riders who are part of the RPF Sporthorses community."

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-stone-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 uppercase tracking-widest text-xs font-semibold mb-3">{heroEyebrow}</p>
          <h1 className="font-serif text-5xl font-bold text-white mb-4">{heroHeading}</h1>
          <p className="text-stone-300 max-w-xl mx-auto">{heroSubheading}</p>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured testimonial */}
          {featured && featured.quote && (
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 mb-12 bg-white rounded-3xl overflow-hidden shadow-md border border-stone-100">
                <div className="lg:col-span-2 relative min-h-[280px] bg-[#13233f]">
                  {featured.photo ? (
                    <img src={featured.photo} alt={featured.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Avatar photo={null} name={featured.name} size={140} />
                    </div>
                  )}
                </div>
                <div className="lg:col-span-3 p-8 sm:p-12 flex flex-col justify-center">
                  <Quote className="h-10 w-10 text-amber-400 mb-5" />
                  <Stars rating={featured.rating} />
                  <blockquote className="font-serif text-xl sm:text-2xl text-stone-800 leading-relaxed mt-4 mb-6">
                    &ldquo;{featured.quote}&rdquo;
                  </blockquote>
                  <div>
                    <div className="font-semibold text-stone-900">{featured.name}</div>
                    {featured.role && <div className="text-sm text-stone-500">{featured.role}</div>}
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* Masonry of the rest */}
          {rest.length > 0 && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
              {rest.map((t, i) => (
                <Reveal key={t.key} delay={(i % 3) * 100} className="break-inside-avoid mb-6">
                  <div className="bg-white rounded-2xl border border-stone-100 p-7 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar photo={t.photo} name={t.name} size={52} />
                      <div className="min-w-0">
                        <div className="font-semibold text-stone-900 truncate">{t.name}</div>
                        {t.role && <div className="text-sm text-stone-500 truncate">{t.role}</div>}
                      </div>
                    </div>
                    <Stars rating={t.rating} />
                    {t.quote && (
                      <p className="text-stone-600 leading-relaxed mt-3 italic">&ldquo;{t.quote}&rdquo;</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
