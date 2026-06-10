import Link from "next/link"
import { notFound } from "next/navigation"
import { PortableText } from "@portabletext/react"
import { Button } from "@/components/ui/button"
import { Clock, User, Calendar, CheckCircle, type LucideIcon } from "lucide-react"
import { getPageBySlug } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"

const cardIconMap: Record<string, LucideIcon> = { Clock, User, Calendar, CheckCircle }

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const heroEyebrow = page.hero?.eyebrow
  const heroHeading = page.hero?.heading || page.title
  const heroSubheading = page.hero?.subheading
  const heroImage = page.hero?.image?.asset
    ? urlFor(page.hero.image).width(1200).quality(80).url()
    : null

  const hasContent = Array.isArray(page.content) && page.content.length > 0
  const cards = page.cards?.length > 0 ? page.cards : []
  const cta = page.ctaSection

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-stone-900 overflow-hidden">
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {heroEyebrow && (
            <p className="text-amber-400 uppercase tracking-widest text-xs font-semibold mb-3">{heroEyebrow}</p>
          )}
          <h1 className="font-serif text-5xl font-bold text-white mb-4">{heroHeading}</h1>
          {heroSubheading && (
            <p className="text-stone-300 max-w-2xl mx-auto">{heroSubheading}</p>
          )}
        </div>
      </section>

      {/* Content */}
      {hasContent && (
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed space-y-4">
              <PortableText value={page.content} />
            </div>
          </div>
        </section>
      )}

      {/* Cards */}
      {cards.length > 0 && (
        <section className="py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {cards.map((c: any) => {
                const Icon = c.icon ? cardIconMap[c.icon] : null
                return (
                  <div key={c.title} className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
                    {Icon ? (
                      <Icon className="h-8 w-8 text-amber-500 mb-4" />
                    ) : (
                      <div className="w-1 h-8 bg-amber-500 rounded mb-4" />
                    )}
                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">{c.title}</h3>
                    {c.description && <p className="text-stone-500 leading-relaxed">{c.description}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {cta?.heading && (
        <section className="py-20 bg-blue-900">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl font-bold text-white mb-4">{cta.heading}</h2>
            {cta.description && <p className="text-blue-100 mb-8">{cta.description}</p>}
            {cta.buttonText && (
              <Link href={cta.buttonLink || "/"}>
                <Button variant="gold" size="lg">{cta.buttonText}</Button>
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  )
}
