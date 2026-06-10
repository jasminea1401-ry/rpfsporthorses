import { Trophy, Medal, Star, Award, type LucideIcon } from "lucide-react"
import { getAwards, getPageBySlug } from "@/lib/sanity/queries"

const statIconMap: Record<string, LucideIcon> = { Trophy, Medal, Star, Award }

const fallbackAwards = [
  { title: "1st Place", year: 2024, show: "USEF Regional Championships", horse: "Lorem Ipsum", rider: "Jane Doe", placement: "1st Place", division: "Hunter 3ft" },
  { title: "Reserve Champion", year: 2024, show: "Carolina Classic Horse Show", horse: "Dolor Sit Amet", rider: "John Smith", placement: "Reserve Champion", division: "Jumper 1.10m" },
  { title: "Champion", year: 2024, show: "Raeford Spring Classic", horse: "Consectetur", rider: "Emily Johnson", placement: "Champion", division: "Children's Hunter" },
  { title: "2nd Place", year: 2023, show: "USEF Regional Championships", horse: "Adipiscing Elite", rider: "Jane Doe", placement: "2nd Place", division: "Amateur Hunter" },
  { title: "Top 5 Finisher", year: 2023, show: "Southeast Equitation Finals", horse: "N/A", rider: "Sarah Williams", placement: "Top 5 Finisher", division: "Medal Equitation" },
  { title: "Grand Champion", year: 2023, show: "Pinehurst Horse Show", horse: "Lorem Ipsum", rider: "Michael Brown", placement: "Grand Champion", division: "Green Hunter" },
  { title: "Champion", year: 2022, show: "Carolina Classic Horse Show", horse: "Sit Amet", rider: "Emily Johnson", placement: "Champion", division: "Children's Hunter" },
  { title: "3rd Place", year: 2022, show: "USEF Zone 4 Finals", horse: "Consectetur", rider: "Jane Doe", placement: "3rd Place", division: "Adult Amateur Hunter" },
]

const placementColors: Record<string, string> = {
  "1st Place": "text-amber-500",
  "Champion": "text-amber-500",
  "Grand Champion": "text-amber-500",
  "Reserve Champion": "text-stone-400",
  "2nd Place": "text-stone-400",
  "3rd Place": "text-amber-700",
  "Top 5 Finisher": "text-blue-700",
}

export default async function AwardsPage() {
  const [cmsAwards, page] = await Promise.all([getAwards(), getPageBySlug("awards")])
  const awards = cmsAwards.length > 0 ? cmsAwards : fallbackAwards
  const years = [...new Set(awards.map((a) => a.year))].sort((a, b) => b - a)

  const heroEyebrow = page?.hero?.eyebrow || "Our Accomplishments"
  const heroHeading = page?.hero?.heading || "Awards & Results"
  const heroSubheading = page?.hero?.subheading || "A record of success built one stride at a time. We are proud of every horse-and-rider pair who has competed under the RPF banner."

  const fallbackStats = [
    { icon: "Trophy", value: "50+", label: "Championships" },
    { icon: "Medal", value: "200+", label: "Blue Ribbons" },
    { icon: "Star", value: "15+", label: "Divisions Won" },
    { icon: "Trophy", value: "10+", label: "Shows Per Year" },
  ]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stats = (page?.stats?.length > 0 ? page.stats : fallbackStats).map((s: any) => ({
    Icon: statIconMap[s.icon] || Trophy,
    value: s.value,
    label: s.label,
  }))

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-stone-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 uppercase tracking-widest text-xs font-semibold mb-3">{heroEyebrow}</p>
          <h1 className="font-serif text-5xl font-bold text-white mb-4">{heroHeading}</h1>
          <p className="text-stone-300 max-w-xl mx-auto">
            {heroSubheading}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {stats.map((stat: any) => (
              <div key={stat.label}>
                <stat.Icon className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <div className="font-serif text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results by year */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {years.map((year) => (
            <div key={year} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-900 text-white font-serif text-2xl font-bold px-5 py-2 rounded-lg">
                  {year}
                </div>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              <div className="space-y-4">
                {awards
                  .filter((a) => a.year === year)
                  .map((award, i) => (
                    <div key={award._id || i} className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-stone-900 mb-1">{award.show}</div>
                        <div className="text-sm text-stone-500">
                          <span className="font-medium text-stone-700">{award.rider}</span>
                          {award.horse && award.horse !== "N/A" && (
                            <> on <span className="font-medium text-stone-700 italic">{award.horse}</span></>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${placementColors[award.placement] || "text-blue-800"}`}>
                          {award.placement}
                        </div>
                        <div className="text-xs text-stone-400">{award.division}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
