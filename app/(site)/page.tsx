import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Calendar, Star, Heart, Shield, CheckCircle, MapPin, ChevronRight, type LucideIcon } from "lucide-react"
import { getSiteSettings, getHeroImageUrl, getHomePage, getServices } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"

const iconMap: Record<string, LucideIcon> = {
  Award,
  Users,
  Calendar,
  Star,
  Heart,
  Shield,
  CheckCircle,
  MapPin,
}

const fallbackHighlights = [
  {
    icon: "Award",
    title: "Championship Results",
    description: "Decades of competitive success at regional and national levels.",
  },
  {
    icon: "Users",
    title: "Expert Trainers",
    description: "Our certified trainers bring years of professional experience to every lesson.",
  },
  {
    icon: "Calendar",
    title: "Flexible Scheduling",
    description: "30 and 60 minute lessons available 7 days a week to fit your schedule.",
  },
  {
    icon: "Star",
    title: "All Levels Welcome",
    description: "From first-time riders to experienced competitors — we meet you where you are.",
  },
]

const fallbackServicesPreview = [
  { title: "Private Lessons", description: "One-on-one instruction tailored to your goals and level.", href: "/services" },
  { title: "Group Clinics", description: "Learn alongside fellow riders in a dynamic group setting.", href: "/services" },
  { title: "Show Preparation", description: "Competition coaching and show management support.", href: "/services" },
  { title: "Training Board", description: "Professional training for your horse while in our care.", href: "/services" },
]

export default async function HomePage() {
  const [settings, home, cmsServices] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getServices(),
  ])
  const heroImage = getHeroImageUrl(settings)

  // Hero
  const heroTagline = home?.heroTagline || "Raeford, North Carolina"
  const heroHeading = home?.heroHeading || "RPF"
  const heroHeadingAccent = home?.heroHeadingAccent || "Sporthorses"
  const heroDescription = home?.heroDescription ||
    "A premier equestrian training facility dedicated to developing exceptional horse and rider partnerships. Where champions are made and lifelong bonds begin."
  const heroPrimaryButtonText = home?.heroPrimaryButtonText || "Book a Trial Lesson"
  const heroSecondaryButtonText = home?.heroSecondaryButtonText || "View Our Services"

  // Highlights
  const highlightsLabel = home?.highlightsLabel || "Why Choose RPF"
  const highlightsHeading = home?.highlightsHeading || "Excellence in Every Stride"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const highlights = (home?.highlights?.length > 0 ? home.highlights : fallbackHighlights).map((h: any) => ({
    Icon: iconMap[h.icon] || Award,
    title: h.title,
    description: h.description,
  }))

  // Story / About teaser
  const storyLabel = home?.storyLabel || "Our Story"
  const storyHeading = home?.storyHeading || "A Legacy Built on Passion"
  const hasStoryContent = Array.isArray(home?.storyContent) && home.storyContent.length > 0
  const storyImage = home?.storyImage?.asset
    ? urlFor(home.storyImage).width(800).quality(85).url()
    : "https://images.unsplash.com/photo-1534891960444-baf0c40e8b39?w=800&auto=format&fit=crop"
  const storyStatNumber = home?.storyStatNumber || "20+"
  const storyStatLabel = home?.storyStatLabel || "Years of Excellence"

  // Services preview
  const servicesLabel = home?.servicesLabel || "What We Offer"
  const servicesHeading = home?.servicesHeading || "Our Services"
  const servicesPreview = cmsServices.length > 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? cmsServices.slice(0, 4).map((s: any) => ({
        title: s.title,
        description: Array.isArray(s.description)
          ? s.description
          : null,
        href: "/services",
        isPortable: Array.isArray(s.description),
      }))
    : fallbackServicesPreview.map((s) => ({ ...s, isPortable: false }))

  // CTA
  const ctaHeading = home?.ctaHeading || "Ready to Start Your Journey?"
  const ctaDescription = home?.ctaDescription ||
    "Book a free trial lesson and experience the RPF difference. No experience necessary."

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="text-amber-400 uppercase tracking-[0.3em] text-sm font-medium mb-4 animate-fade-in">
            {heroTagline}
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in">
            {heroHeading} <span className="text-amber-400">{heroHeadingAccent}</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
            {heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay">
            <Link href="/trial">
              <Button variant="gold" size="lg" className="text-base">
                {heroPrimaryButtonText}
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="text-base border-white text-white hover:bg-white/10">
                {heroSecondaryButtonText}
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-3">{highlightsLabel}</p>
            <h2 className="font-serif text-4xl font-bold text-stone-900">{highlightsHeading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {highlights.map((item: any) => (
              <div key={item.title} className="text-center group">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <item.Icon className="h-8 w-8 text-blue-900" />
                </div>
                <h3 className="font-semibold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-24 section-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-3">{storyLabel}</p>
              <h2 className="font-serif text-4xl font-bold text-stone-900 mb-6">{storyHeading}</h2>
              {hasStoryContent ? (
                <div className="text-stone-600 leading-relaxed mb-8 space-y-4">
                  <PortableText value={home.storyContent} />
                </div>
              ) : (
                <>
                  <p className="text-stone-600 leading-relaxed mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-stone-600 leading-relaxed mb-8">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </>
              )}
              <Link href="/about">
                <Button variant="default">
                  Learn Our Story <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src={storyImage}
                alt="Horse and rider"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-blue-900 text-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold font-serif">{storyStatNumber}</div>
                <div className="text-sm text-blue-200">{storyStatLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-24 bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-amber-400 uppercase tracking-widest text-xs font-semibold mb-3">{servicesLabel}</p>
            <h2 className="font-serif text-4xl font-bold text-white">{servicesHeading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesPreview.map((s) => (
              <Card key={s.title} className="bg-stone-800 border-stone-700 hover:border-amber-600 transition-colors group">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">{s.title}</h3>
                  {s.isPortable ? (
                    <div className="text-stone-400 text-sm mb-4 leading-relaxed line-clamp-3">
                      <PortableText value={s.description} />
                    </div>
                  ) : (
                    <p className="text-stone-400 text-sm mb-4 leading-relaxed">{s.description}</p>
                  )}
                  <Link href={s.href} className="text-amber-400 text-sm hover:text-amber-300 flex items-center gap-1">
                    Learn more <ChevronRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services">
              <Button variant="outline" className="border-stone-400 text-stone-200 hover:bg-white/10">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#13233f]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">{ctaHeading}</h2>
          <p className="text-blue-100 mb-8 text-lg">
            {ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trial">
              <Button variant="gold" size="lg">Book a Trial Lesson</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-stone-100">
                Client Portal Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </>
  )
}
