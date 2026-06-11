"use client"
import { useEffect, useRef, useState } from "react"

export function Counter({ value, durationMs = 1800 }: { value: string; durationMs?: number }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  const prefix = match?.[1] || ""
  const target = match ? parseInt(match[2], 10) : 0
  const suffix = match?.[3] || ""

  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || !match) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target)
      return
    }
    let frame: number
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(eased * target))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, durationMs])

  if (!match) return <span>{value}</span>
  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
