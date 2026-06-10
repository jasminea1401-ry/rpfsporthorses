import { Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getShowTeam, getPageBySlug } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/client"

const fallbackTeam = [
  {
    name: "Jane Doe",
    horse: "Lorem Ipsum",
    division: "Adult Amateur Hunter",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    achievements: ["2024 Regional Champion", "2023 Zone Finals Qualifier", "2022 Adult Amateur Champion"],
    photo: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&auto=format&fit=crop",
  },
  {
    name: "John Smith",
    horse: "Dolor Sit Amet",
    division: "Open Jumper",
    bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    achievements: ["1.20m Jumper", "2024 Reserve Champion", "Year-end Award 2023"],
    photo: "https://images.unsplash.com/photo-1566197869012-e3e5fed6a1a5?w=400&auto=format&fit=crop",
  },
  {
    name: "Emily Johnson",
    horse: "Consectetur",
    division: "Children's Hunter",
    bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    achievements: ["2024 & 2023 Champion", "Maclay Qualifier", "NHS Nomination"],
    photo: "https://images.unsplash.com/photo-1534891960444-baf0c40e8b39?w=400&auto=format&fit=crop",
  },
  {
    name: "Sarah Williams",
    horse: "Adipiscing",
    division: "Equitation",
    bio: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    achievements: ["Medal Finals Top 5", "ASPCA Maclay Qualifier", "2024 Zone Medal Winner"],
    photo: "https://images.unsplash.com/photo-1559310278-18a9192d7c03?w=400&auto=format&fit=crop",
  },
  {
    name: "Michael Brown",
    horse: "Elit Sed",
    division: "Green Hunter",
    bio: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    achievements: ["2022 Grand Champion", "3'6 Hunter", "Multiple Blue Ribbons"],
    photo: "https://images.unsplash.com/photo-1598677886878-a0b85f2e6f2a?w=400&auto=format&fit=crop",
  },
  {
    name: "Ashley Davis",
    horse: "Eiusmod",
    division: "Short Stirrup",
    bio: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.",
    achievements: ["Short Stirrup Champion", "Beginner Novice XC Clear", "First show at age 7"],
    photo: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&auto=format&fit=crop",
  },
]

export default async function ShowTeamPage() {
  const [cmsTeam, page] = await Promise.all([getShowTeam(), getPageBySlug("show-team")])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const teamMembers = cmsTeam.length > 0
    ? cmsTeam.map((m: any) => ({
        key: m._id,
        name: m.name,
        horse: m.horse,
        division: m.division,
        bio: m.bio,
        achievements: m.achievements || [],
        photo: m.photo?.asset
          ? urlFor(m.photo).width(400).height(400).quality(85).url()
          : "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&auto=format&fit=crop",
      }))
    : fallbackTeam.map((m) => ({ ...m, key: m.name }))

  const heroEyebrow = page?.hero?.eyebrow || "Meet The Team"
  const heroHeading = page?.hero?.heading || "Show Team"
  const heroSubheading = page?.hero?.subheading || "The talented riders who represent RPF Sporthorses in the show ring. We are proud of every one of them."

  const cta = page?.ctaSection
  const ctaHeading = cta?.heading || "Want to Join the Show Team?"
  const ctaDescription = cta?.description || "Start with a trial lesson and let us assess your goals. We love working with motivated riders of all levels."
  const ctaButtonText = cta?.buttonText || "Book a Trial Lesson"
  const ctaButtonLink = cta?.buttonLink || "/trial"

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

      {/* Team grid */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.key} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-900/80 to-transparent p-4">
                    <div className="text-amber-400 text-xs uppercase tracking-wider font-medium">{member.division}</div>
                    <h3 className="font-serif text-xl font-bold text-white">{member.name}</h3>
                    <div className="text-stone-300 text-sm italic">{member.horse}</div>
                  </div>
                </div>
                <CardContent className="p-6">
                  {member.bio && <p className="text-stone-500 text-sm leading-relaxed mb-4">{member.bio}</p>}
                  {member.achievements.length > 0 && (
                    <div>
                      <div className="text-xs uppercase tracking-wider text-stone-400 font-medium mb-2 flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> Achievements
                      </div>
                      <ul className="space-y-1">
                        {member.achievements.map((a: string) => (
                          <li key={a} className="text-sm text-stone-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">{ctaHeading}</h2>
          <p className="text-blue-100 mb-8">
            {ctaDescription}
          </p>
          <a href={ctaButtonLink} className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 py-3 rounded-lg transition-colors">
            {ctaButtonText}
          </a>
        </div>
      </section>
    </>
  )
}
