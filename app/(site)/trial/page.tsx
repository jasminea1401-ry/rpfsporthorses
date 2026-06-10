import { getPageBySlug, getSiteSettings } from "@/lib/sanity/queries"
import { createClient } from "@/lib/supabase/server"
import { TrialForm } from "./TrialForm"

const fallbackFeatures = [
  { text: "60-minute introductory lesson" },
  { text: "One-on-one with a certified trainer" },
  { text: "Flexible scheduling, 7 days a week" },
]

const fallbackTrainers = [
  { id: "trainer-1", name: "Emily Carter", specialties: "Hunter/Jumper, Equitation" },
  { id: "trainer-2", name: "James Monroe", specialties: "Jumper, Cross-Country" },
]

export default async function TrialLessonPage() {
  const supabase = await createClient()

  const [page, settings, trainersResult] = await Promise.all([
    getPageBySlug("trial"),
    getSiteSettings(),
    supabase
      .from("trainers")
      .select("id, specialties, profile:id(full_name)")
      .eq("accepts_trial_lessons", true),
  ])

  const heroEyebrow = page?.hero?.eyebrow || "No Experience Required"
  const heroHeading = page?.hero?.heading || "Book a Trial Lesson"
  const heroSubheading = page?.hero?.subheading || "Your first lesson with RPF Sporthorses. Select a trainer, pick a date, and we will take care of the rest."
  const phone = settings?.phone || "(XXX) XXX-XXXX"

  const features = page?.cards?.length > 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? page.cards.map((c: any) => ({ text: c.title, icon: c.icon }))
    : fallbackFeatures

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbTrainers = (trainersResult.data || []) as any[]
  const trainers = dbTrainers.length > 0
    ? dbTrainers.map((t) => {
        const profile = Array.isArray(t.profile) ? t.profile[0] : t.profile
        return {
          id: t.id,
          name: profile?.full_name || "RPF Trainer",
          specialties: (t.specialties || []).join(", "),
        }
      })
    : fallbackTrainers

  return (
    <TrialForm
      heroEyebrow={heroEyebrow}
      heroHeading={heroHeading}
      heroSubheading={heroSubheading}
      features={features}
      phone={phone}
      trainers={trainers}
    />
  )
}
