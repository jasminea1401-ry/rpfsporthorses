import Link from "next/link"
import { notFound } from "next/navigation"
import { PortableText } from "@portabletext/react"
import { ArrowLeft } from "lucide-react"
import { getNewsPostBySlug } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"
import { formatDate } from "@/lib/utils"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getNewsPostBySlug(slug)
  if (!post) return { title: "News | RPF Sporthorses" }
  return {
    title: `${post.title} | RPF Sporthorses`,
    description: post.excerpt || undefined,
  }
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getNewsPostBySlug(slug)

  if (!post) notFound()

  const coverUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1400).quality(85).url()
    : null

  return (
    <article className="pb-24">
      {/* Header */}
      <header className="relative pt-32 pb-16 bg-stone-900">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-stone-400 hover:text-amber-400 text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to News
          </Link>
          <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-wider mb-4">
            {post.category && <span className="text-amber-400 font-semibold">{post.category}</span>}
            {post.category && post.date && <span className="text-stone-600">·</span>}
            {post.date && <span className="text-stone-400">{formatDate(post.date)}</span>}
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">{post.title}</h1>
        </div>
      </header>

      {/* Cover image */}
      {coverUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <img src={coverUrl} alt={post.title} className="w-full rounded-2xl shadow-xl object-cover" />
        </div>
      )}

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {post.excerpt && <p className="text-lg text-stone-600 leading-relaxed mb-8 font-medium">{post.excerpt}</p>}
        {Array.isArray(post.body) && post.body.length > 0 ? (
          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
            <PortableText value={post.body} />
          </div>
        ) : (
          !post.excerpt && <p className="text-stone-400">No content yet.</p>
        )}

        <div className="mt-12 pt-8 border-t border-stone-200">
          <Link href="/news" className="text-amber-600 hover:text-amber-700 text-sm font-medium inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to all news
          </Link>
        </div>
      </div>
    </article>
  )
}
