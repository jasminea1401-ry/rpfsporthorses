"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type RotatorTestimonial = {
  name: string
  role?: string
  quote: string
  rating?: number
}

export function TestimonialRotator({ testimonials }: { testimonials: RotatorTestimonial[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || testimonials.length <= 1) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [paused, testimonials.length])

  if (testimonials.length === 0) return null
  const t = testimonials[index]

  return (
    <div
      className="max-w-3xl mx-auto text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Quote className="h-8 w-8 text-amber-500 mx-auto mb-4" />
      <div key={index} className="animate-fade-in">
        {t.rating && (
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < (t.rating || 0) ? "text-amber-500 fill-amber-500" : "text-stone-300"
                )}
              />
            ))}
          </div>
        )}
        <blockquote className="font-serif text-2xl sm:text-3xl text-stone-900 leading-snug mb-4">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <div className="font-semibold text-stone-900">{t.name}</div>
        {t.role && <div className="text-sm text-stone-500">{t.role}</div>}
      </div>

      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            aria-label="Previous testimonial"
            onClick={() => setIndex((index - 1 + testimonials.length) % testimonials.length)}
            className="p-2 rounded-full border border-stone-200 text-stone-500 hover:border-amber-500 hover:text-amber-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-colors",
                  i === index ? "bg-amber-500" : "bg-stone-300 hover:bg-stone-400"
                )}
              />
            ))}
          </div>
          <button
            aria-label="Next testimonial"
            onClick={() => setIndex((index + 1) % testimonials.length)}
            className="p-2 rounded-full border border-stone-200 text-stone-500 hover:border-amber-500 hover:text-amber-600 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-5">
        <Link href="/testimonials" className="text-sm text-blue-800 hover:underline">
          Read all testimonials →
        </Link>
      </div>
    </div>
  )
}
