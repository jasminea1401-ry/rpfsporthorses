import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, ChevronRight } from "lucide-react"
import { getServices, getPageBySlug } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"

const fallbackServices = [
  {
    title: "Private Lessons",
    description: "One-on-one instruction tailored entirely to you and your horse. Whether you are a beginner picking up the reins for the first time or an experienced competitor looking to sharpen your edge, our trainers design each session around your specific goals.",
    duration: "30 or 60 minutes",
    level: "All levels",
    features: ["Personalized curriculum", "Video analysis available", "Homework & exercises", "Progress tracking"],
  },
  {
    title: "Group Lessons",
    description: "A dynamic learning environment where riders develop skills alongside their peers. Group lessons are a great way to build camaraderie, learn from watching others, and get quality instruction at a lower price point.",
    duration: "60 minutes",
    level: "Beginner – Intermediate",
    features: ["Max 4 riders per group", "Level-matched groupings", "Social atmosphere", "Cost-effective option"],
  },
  {
    title: "Show Preparation",
    description: "Intensive coaching designed to prepare horse and rider for competition. We cover ring strategy, course walking, show-day nerves, and everything in between to ensure you enter the ring with confidence.",
    duration: "60 minutes",
    level: "Intermediate – Advanced",
    features: ["Course strategy", "Warmup protocols", "Mental preparation", "Show management support"],
  },
  {
    title: "Training Board",
    description: "Leave your horse in our professional hands. Our trainers provide daily rides, conditioning work, and skill development. Monthly progress reports keep you informed every step of the way.",
    duration: "Ongoing – monthly",
    level: "All horses",
    features: ["Daily training rides", "Fitness conditioning", "Monthly progress reports", "Show preparation included"],
  },
  {
    title: "Summer Camps",
    description: "Immersive multi-day equestrian camps for youth riders. Campers receive daily lessons, horse care education, barn management, and plenty of fun with horses and new friends.",
    duration: "Multi-day sessions",
    level: "Youth riders",
    features: ["Daily lessons", "Horse care basics", "Barn management", "Fun activities & crafts"],
  },
  {
    title: "Clinics & Events",
    description: "We host clinics with visiting clinicians and special events throughout the year. Follow our social media or check back here for upcoming dates.",
    duration: "Varies",
    level: "All levels",
    features: ["Guest clinicians", "Focused topics", "Video & feedback", "Open to non-boarders"],
  },
]

export default async function ServicesPage() {
  const [cmsServices, page] = await Promise.all([getServices(), getPageBySlug("services")])
  const useCms = cmsServices.length > 0

  const heroEyebrow = page?.hero?.eyebrow || "What We Offer"
  const heroHeading = page?.hero?.heading || "Our Services"
  const heroSubheading = page?.hero?.subheading || "From first rides to championship rounds — we have a program designed for every horse and rider."
  const heroImage = page?.hero?.image?.asset
    ? urlFor(page.hero.image).width(1200).quality(80).url()
    : "https://images.unsplash.com/photo-1566197869012-e3e5fed6a1a5?w=1200&auto=format&fit=crop"

  const cta = page?.ctaSection
  const ctaHeading = cta?.heading || "Not sure where to start?"
  const ctaDescription = cta?.description || "Book a trial lesson and let us find the right program for you."

  return (
    <>
      {/* Hero */}
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

      {/* Services grid */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCms ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cmsServices.map((s: any) => (
                <Card key={s._id} className="hover:shadow-md transition-shadow overflow-hidden">
                  {s.image?.asset && (
                    <img
                      src={urlFor(s.image).width(600).height(360).quality(85).url()}
                      alt={s.title}
                      className="w-full h-44 object-cover"
                    />
                  )}
                  <CardContent className="p-8">
                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">{s.title}</h3>
                    {s.description && (
                      <div className="text-stone-500 text-sm leading-relaxed mb-6 space-y-3">
                        <PortableText value={s.description} />
                      </div>
                    )}
                    {s.price && (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-900 bg-blue-50 px-2 py-1 rounded-full font-medium">
                        {s.price}
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              fallbackServices.map((s) => (
                <Card key={s.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">{s.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed mb-6">{s.description}</p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
                        <Clock className="h-3 w-3" /> {s.duration}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
                        <Users className="h-3 w-3" /> {s.level}
                      </span>
                    </div>
                    <ul className="space-y-1 mb-6">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-stone-600">
                          <ChevronRight className="h-3 w-3 text-blue-700 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">{ctaHeading}</h2>
          <p className="text-blue-100 mb-8">
            {ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trial">
              <Button variant="gold" size="lg">Book a Trial Lesson</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-stone-100">
                Schedule a Lesson
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
