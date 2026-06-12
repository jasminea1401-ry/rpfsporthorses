export type MarqueeItem = {
  name: string
  src?: string
}

export function LogoMarquee({ items }: { items: MarqueeItem[] }) {
  if (items.length === 0) return null
  // Repeat short lists so the strip always fills the full width,
  // then render the set twice so the loop is seamless
  const base: MarqueeItem[] = []
  while (base.length < 8) base.push(...items)
  const loop = [...base, ...base]

  return (
    <div className="marquee group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />
      <div className="marquee-track flex items-center gap-16 w-max group-hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0 opacity-60 hover:opacity-100 transition-opacity" aria-hidden={i >= items.length}>
            {item.src ? (
              <img src={item.src} alt={item.name} className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
            ) : (
              <span className="font-serif text-xl font-bold text-stone-400 tracking-wide whitespace-nowrap">
                {item.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
