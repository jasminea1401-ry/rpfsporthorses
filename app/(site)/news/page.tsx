import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getNewsPosts, getPageBySlug } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"
import { formatDate } from "@/lib/utils"
import { Reveal } from "@/components/ux/Reveal"

export const metadata = {
  title: "News & Updates | RPF Sporthorses",
  description: "The latest news, show recaps, and announcements from RPF Sporthorses.",
}

export default async function NewsPage() {
  const [posts, page] = await Promise.all([getNewsPosts(), getPageBySlug("news")])

  const heroEyebrow = page?.hero?.eyebrow || "Latest"
  const heroHeading = page?.hero?.heading || "News & Updates"
  const heroSubheading =
    page?.hero?.subheading ||
    "Show recaps, announcements, and what's happening around the barn at RPF Sporthorses."

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

      {/* Posts */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-stone-400 py-12">No news posts yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {posts.map((post: any, i: number) => (
                <Reveal key={post._id} delay={(i % 3) * 100}>
                  <Link href={`/news/${post.slug}`} className="group block h-full">
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                      <div className="relative h-52 bg-stone-200 overflow-hidden">
                        {post.coverImage?.asset ? (
                          <img
                            src={urlFor(post.coverImage).width(600).height(400).fit("crop").quality(85).url()}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <Calendar className="h-10 w-10" />
                          </div>
                        )}
                        {post.category && (
                          <span className="absolute top-3 left-3 bg-amber-500 text-amber-950 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        {post.date && (
                          <div className="text-xs uppercase tracking-wider text-stone-400 font-medium mb-2">
                            {formatDate(post.date)}
                          </div>
                        )}
                        <h2 className="font-serif text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                        )}
                        <span className="mt-auto text-amber-600 text-sm font-medium flex items-center gap-1">
                          Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
