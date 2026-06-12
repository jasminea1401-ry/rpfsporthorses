"use client"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function MediaLoop({
  videoUrl,
  images,
  intervalMs = 6000,
}: {
  videoUrl?: string | null
  images: string[]
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    if (videoUrl || images.length <= 1 || reducedMotion) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [videoUrl, images.length, intervalMs, reducedMotion])

  if (videoUrl) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={images[0]}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} />
      </video>
    )
  }

  return (
    <>
      {images.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-[1500ms] ease-in-out",
            i === index ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}
    </>
  )
}
