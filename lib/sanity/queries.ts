import { sanityClient, urlFor } from "./client"

const FALLBACK_HERO = "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1600&auto=format&fit=crop"

export async function getSiteSettings() {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "siteSettings"][0]{ barnName, tagline, logo, heroImages, heroVideo, "heroVideoFileUrl": heroVideoFile.asset->url, partnerLogos, phone, email, address, facebook, instagram }`,
      {},
      { next: { revalidate: 60 } }
    )
    return data
  } catch {
    return null
  }
}

export function getHeroImageUrl(settings: { heroImages?: { asset?: object }[] } | null): string {
  try {
    const first = settings?.heroImages?.[0]
    if (first?.asset) return urlFor(first).width(1600).quality(85).url()
  } catch {}
  return FALLBACK_HERO
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServices(): Promise<any[]> {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "service"] | order(order asc, _createdAt asc){ _id, title, description, icon, price, image }`,
      {},
      { next: { revalidate: 60 } }
    )
    return data || []
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getGalleryImages(): Promise<any[]> {
  try {
    const [singles, album] = await Promise.all([
      sanityClient.fetch(
        `*[_type == "galleryImage"] | order(order asc, _createdAt asc){ _id, title, image, alt, caption, category, "dimensions": image.asset->metadata.dimensions }`,
        {},
        { next: { revalidate: 60 } }
      ),
      sanityClient.fetch(
        `*[_type == "galleryAlbum"][0]{ images[]{ ..., "dimensions": asset->metadata.dimensions } }`,
        {},
        { next: { revalidate: 60 } }
      ),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const albumImages = (album?.images || []).map((img: any) => ({
      _id: img._key,
      title: "",
      image: img,
      alt: img.alt || "",
      caption: img.caption || "",
      category: img.category || "",
      dimensions: img.dimensions,
    }))

    return [...(singles || []), ...albumImages]
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAwards(): Promise<any[]> {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "award"] | order(year desc, _createdAt desc){ _id, title, year, show, horse, rider, placement, division, photo, description }`,
      {},
      { next: { revalidate: 60 } }
    )
    return data || []
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getShowTeam(): Promise<any[]> {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "showTeamMember"] | order(order asc, _createdAt asc){ _id, name, photo, horse, horsePhoto, division, bio, achievements }`,
      {},
      { next: { revalidate: 60 } }
    )
    return data || []
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getLessonHorses(): Promise<any[]> {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "lessonHorse"] | order(order asc, _createdAt asc){ _id, name, photo, age, height, breed, bio }`,
      {},
      { next: { revalidate: 60 } }
    )
    return data || []
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getTestimonials(): Promise<any[]> {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "testimonial"] | order(order asc, _createdAt asc){ _id, name, role, photo, quote, rating }`,
      {},
      { next: { revalidate: 60 } }
    )
    return data || []
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getNewsPosts(): Promise<any[]> {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "newsPost"] | order(date desc, _createdAt desc){ _id, title, "slug": slug.current, date, category, coverImage, excerpt }`,
      {},
      { next: { revalidate: 60 } }
    )
    return data || []
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getNewsPostBySlug(slug: string): Promise<any | null> {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "newsPost" && slug.current == $slug][0]{ _id, title, "slug": slug.current, date, category, coverImage, excerpt, body }`,
      { slug },
      { next: { revalidate: 60 } }
    )
    return data || null
  } catch {
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUpcomingEvents(): Promise<any[]> {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const data = await sanityClient.fetch(
      `*[_type == "event" && coalesce(endDate, date) >= $today] | order(date asc){ _id, title, eventType, date, endDate, location, description, link }`,
      { today },
      { next: { revalidate: 60 } }
    )
    return data || []
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getTrainers(): Promise<any[]> {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "trainer"] | order(order asc, _createdAt asc){ _id, name, photo, title, bio, specialties }`,
      {},
      { next: { revalidate: 60 } }
    )
    return data || []
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getHomePage(): Promise<any | null> {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "homePage"][0]{
        heroTagline, heroHeading, heroHeadingAccent, heroDescription,
        heroPrimaryButtonText, heroSecondaryButtonText,
        highlightsLabel, highlightsHeading, highlights,
        storyLabel, storyHeading, storyContent, storyImage, storyStatNumber, storyStatLabel,
        servicesLabel, servicesHeading,
        ctaHeading, ctaDescription
      }`,
      {},
      { next: { revalidate: 60 } }
    )
    return data || null
  } catch {
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPageBySlug(slug: string): Promise<any | null> {
  try {
    const data = await sanityClient.fetch(
      `*[_type == "page" && slug.current == $slug][0]{ title, hero, content, primarySection, cards, stats, secondarySection, ctaSection, seoTitle, seoDescription }`,
      { slug },
      { next: { revalidate: 60 } }
    )
    return data || null
  } catch {
    return null
  }
}
