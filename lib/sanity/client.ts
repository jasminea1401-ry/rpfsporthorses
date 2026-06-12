import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder"
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
  // Only published documents — a token fetch without this also returns
  // drafts, duplicating cards while an entry has unpublished edits
  perspective: "published",
})

const builder = imageUrlBuilder(sanityClient)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}
