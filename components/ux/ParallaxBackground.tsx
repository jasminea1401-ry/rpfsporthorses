"use client"
import { useEffect, useRef } from "react"

export function ParallaxBackground({
  imageUrl,
  children,
}: {
  imageUrl?: string
  children?: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.transform = `translateY(${window.scrollY * 0.35}px)`
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="absolute inset-0 -bottom-40 overflow-hidden bg-cover bg-center bg-no-repeat will-change-transform"
      style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : undefined}
    >
      {children}
    </div>
  )
}
