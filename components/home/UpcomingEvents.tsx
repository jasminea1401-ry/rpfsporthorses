import Link from "next/link"
import { MapPin, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ux/Reveal"

export type EventItem = {
  _id: string
  title: string
  eventType?: string
  date: string
  endDate?: string
  location?: string
  description?: string
  link?: string
}

function MonthDay({ date }: { date: string }) {
  // date is a yyyy-mm-dd string — parse as local to avoid timezone drift
  const [y, m, d] = date.split("-").map(Number)
  const dt = new Date(y, (m || 1) - 1, d || 1)
  const month = dt.toLocaleDateString("en-US", { month: "short" })
  return (
    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-[#13233f] text-white shrink-0">
      <span className="text-[10px] uppercase tracking-wider text-blue-200">{month}</span>
      <span className="text-2xl font-bold leading-none font-serif">{d}</span>
    </div>
  )
}

function dateRange(date: string, endDate?: string) {
  const fmt = (s: string) => {
    const [y, m, d] = s.split("-").map(Number)
    return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }
  if (endDate && endDate !== date) return `${fmt(date)} – ${fmt(endDate)}`
  return fmt(date)
}

export function EventCard({ ev }: { ev: EventItem }) {
  const inner = (
    <div className="flex items-start gap-5 p-5 bg-white border border-stone-100 rounded-2xl hover:shadow-md hover:border-amber-200 transition-all">
      <MonthDay date={ev.date} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {ev.eventType && (
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {ev.eventType}
            </span>
          )}
          <span className="text-xs text-stone-400">{dateRange(ev.date, ev.endDate)}</span>
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-1">
          {ev.title}
          {ev.link && <ArrowUpRight className="h-4 w-4 text-amber-600" />}
        </h3>
        {ev.location && (
          <div className="flex items-center gap-1 text-sm text-stone-500 mt-0.5">
            <MapPin className="h-3.5 w-3.5" /> {ev.location}
          </div>
        )}
        {ev.description && (
          <p className="text-sm text-stone-500 leading-relaxed mt-2 line-clamp-2">{ev.description}</p>
        )}
      </div>
    </div>
  )
  return ev.link ? (
    <a href={ev.link} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  )
}

export function UpcomingEvents({ events }: { events: EventItem[] }) {
  if (events.length === 0) return null
  const shown = events.slice(0, 4)

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <p className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-3">Mark Your Calendar</p>
          <h2 className="font-serif text-4xl font-bold text-stone-900">Upcoming Events</h2>
        </Reveal>

        <div className="space-y-4">
          {shown.map((ev, i) => (
            <Reveal key={ev._id} delay={i * 80}>
              <EventCard ev={ev} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-3 text-center">
            {events.length > shown.length ? (
              <Link href="/events" className="text-sm text-blue-800 hover:underline">
                View all events →
              </Link>
            ) : (
              <>
                <p className="text-stone-600 text-sm">
                  Want to join us in the ring? Riders of all levels are welcome.
                </p>
                <Link href="/trial" className="shrink-0">
                  <Button variant="gold" size="sm">Book a Trial Lesson</Button>
                </Link>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
