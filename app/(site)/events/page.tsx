import Link from "next/link"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUpcomingEvents, getPageBySlug } from "@/lib/sanity/queries"
import { EventCard, type EventItem } from "@/components/home/UpcomingEvents"
import { Reveal } from "@/components/ux/Reveal"

export const metadata = {
  title: "Upcoming Events | RPF Sporthorses",
  description: "Shows, camps, clinics, and events at RPF Sporthorses in Raeford, NC.",
}

export default async function EventsPage() {
  const [events, page] = await Promise.all([getUpcomingEvents(), getPageBySlug("events")])

  const heroEyebrow = page?.hero?.eyebrow || "Mark Your Calendar"
  const heroHeading = page?.hero?.heading || "Upcoming Events"
  const heroSubheading =
    page?.hero?.subheading || "Shows, camps, and clinics happening at and around RPF Sporthorses."

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

      {/* Events list */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-10 w-10 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">No upcoming events scheduled right now — check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(events as EventItem[]).map((ev, i) => (
                <Reveal key={ev._id} delay={(i % 4) * 80}>
                  <EventCard ev={ev} />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={120}>
            <div className="mt-12 rounded-2xl bg-white border border-stone-100 px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">Want to join us in the ring?</h2>
                <p className="text-stone-500 text-sm mt-1">Start with a trial lesson — riders of all levels are welcome.</p>
              </div>
              <Link href="/trial" className="shrink-0">
                <Button variant="gold">Book a Trial Lesson</Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
