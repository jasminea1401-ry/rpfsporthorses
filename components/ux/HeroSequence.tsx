"use client"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function HeroSequence({
  imageUrl,
  videoUrl,
  imageDurationMs = 10000,
}: {
  imageUrl: string
  videoUrl?: string | null
  imageDurationMs?: number
}) {
  const [phase, setPhase] = useState<"image" | "video">("image")
  const [videoFailed, setVideoFailed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  const videoEnabled = !!videoUrl && !videoFailed && !reducedMotion

  // Hold the image, then switch to the video
  useEffect(() => {
    if (!videoEnabled || phase !== "image") return
    const timer = setTimeout(() => setPhase("video"), imageDurationMs)
    return () => clearTimeout(timer)
  }, [phase, videoEnabled, imageDurationMs])

  // Play from the start each time the video phase begins
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (phase === "video") {
      v.currentTime = 0
      v.play().catch(() => {
        setVideoFailed(true)
        setPhase("image")
      })
    } else {
      v.pause()
    }
  }, [phase])

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",
          phase === "image" || !videoEnabled ? "opacity-100" : "opacity-0"
        )}
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      {videoEnabled && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          onEnded={() => setPhase("image")}
          onError={() => {
            setVideoFailed(true)
            setPhase("image")
          }}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            phase === "video" ? "opacity-100" : "opacity-0"
          )}
        >
          <source src={videoUrl as string} />
        </video>
      )}
    </>
  )
}
