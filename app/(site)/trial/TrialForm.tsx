"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Calendar, User, type LucideIcon } from "lucide-react"
import { addDays, format, startOfDay } from "date-fns"

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
]

const schema = z.object({
  guestName: z.string().min(2, "Please enter your full name"),
  guestEmail: z.string().email("Please enter a valid email"),
  guestPhone: z.string().min(7, "Please enter your phone number"),
  trainerId: z.string().min(1, "Please select a trainer"),
  lessonDate: z.string().min(1, "Please select a date"),
  startTime: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
  ridingExperience: z.string().min(1, "Please tell us about your experience"),
})

type FormData = z.infer<typeof schema>

type TrialFormProps = {
  heroEyebrow: string
  heroHeading: string
  heroSubheading: string
  features: { text: string; icon?: string }[]
  phone: string
  trainers: { id: string; name: string; specialties: string }[]
}

const featureIcons = [Clock, User, Calendar]
const featureIconMap: Record<string, LucideIcon> = { Clock, User, Calendar, CheckCircle }

export function TrialForm({ heroEyebrow, heroHeading, heroSubheading, features, phone, trainers }: TrialFormProps) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const today = startOfDay(new Date())
  const minDate = format(addDays(today, 1), "yyyy-MM-dd")
  const maxDate = format(addDays(today, 60), "yyyy-MM-dd")

  const onSubmit = async (data: FormData) => {
    setError("")
    const { error: insertError } = await supabase.from("lessons").insert({
      trainer_id: data.trainerId,
      lesson_date: data.lessonDate,
      start_time: data.startTime,
      duration_minutes: 60,
      lesson_type: "trial",
      guest_name: data.guestName,
      guest_email: data.guestEmail,
      guest_phone: data.guestPhone,
      notes: `Experience: ${data.ridingExperience}${data.notes ? `\n\nAdditional notes: ${data.notes}` : ""}`,
      status: "pending",
    })

    if (insertError) {
      setError("Something went wrong. Please try again or call us directly.")
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 pt-20">
        <div className="max-w-lg w-full text-center">
          <CheckCircle className="w-16 h-16 text-blue-700 mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-3">Request Submitted!</h2>
          <p className="text-stone-500 mb-4">
            Thank you for your interest in RPF Sporthorses! Your trial lesson request has been sent to the trainer. We will confirm your appointment within 24 hours via email or phone.
          </p>
          <p className="text-stone-400 text-sm mb-8">
            Questions? Call us at <a href={`tel:${phone}`} className="text-blue-800">{phone}</a>
          </p>
          <a href="/" className="inline-block bg-blue-900 hover:bg-blue-800 text-white font-medium px-8 py-3 rounded-lg transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-stone-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-400 uppercase tracking-widest text-xs font-semibold mb-3">{heroEyebrow}</p>
          <h1 className="font-serif text-5xl font-bold text-white mb-4">{heroHeading}</h1>
          <p className="text-stone-300 max-w-xl mx-auto">
            {heroSubheading}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 bg-[#13233f]">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {features.map(({ text, icon }, i) => {
            const Icon = (icon && featureIconMap[icon]) || featureIcons[i % featureIcons.length]
            return (
              <div key={text} className="flex items-center justify-center gap-3 text-white">
                <Icon className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-sm">{text}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-2xl mx-auto px-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">Your Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guestName">Full name *</Label>
                      <Input id="guestName" placeholder="Jane Smith" className="mt-1" {...register("guestName")} />
                      {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="guestPhone">Phone number *</Label>
                      <Input id="guestPhone" type="tel" placeholder="(555) 555-5555" className="mt-1" {...register("guestPhone")} />
                      {errors.guestPhone && <p className="text-red-500 text-xs mt-1">{errors.guestPhone.message}</p>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="guestEmail">Email address *</Label>
                    <Input id="guestEmail" type="email" placeholder="you@example.com" className="mt-1" {...register("guestEmail")} />
                    {errors.guestEmail && <p className="text-red-500 text-xs mt-1">{errors.guestEmail.message}</p>}
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="ridingExperience">Riding experience *</Label>
                    <Textarea
                      id="ridingExperience"
                      placeholder="E.g. Complete beginner, some trail riding experience, or ridden English for 2 years..."
                      className="mt-1"
                      rows={3}
                      {...register("ridingExperience")}
                    />
                    {errors.ridingExperience && <p className="text-red-500 text-xs mt-1">{errors.ridingExperience.message}</p>}
                  </div>
                </div>

                <hr className="border-stone-200" />

                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">Schedule Your Lesson</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Select a trainer *</Label>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {trainers.map((trainer) => (
                          <label
                            key={trainer.id}
                            className={`cursor-pointer border-2 rounded-lg p-4 transition-colors ${
                              watch("trainerId") === trainer.id
                                ? "border-blue-900 bg-blue-50"
                                : "border-stone-200 hover:border-stone-300"
                            }`}
                          >
                            <input
                              type="radio"
                              className="sr-only"
                              value={trainer.id}
                              {...register("trainerId")}
                            />
                            <div className="font-medium text-stone-900">{trainer.name}</div>
                            <div className="text-xs text-stone-500 mt-1">{trainer.specialties}</div>
                          </label>
                        ))}
                      </div>
                      {errors.trainerId && <p className="text-red-500 text-xs mt-1">{errors.trainerId.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="lessonDate">Preferred date *</Label>
                        <Input
                          id="lessonDate"
                          type="date"
                          min={minDate}
                          max={maxDate}
                          className="mt-1"
                          {...register("lessonDate")}
                        />
                        {errors.lessonDate && <p className="text-red-500 text-xs mt-1">{errors.lessonDate.message}</p>}
                      </div>
                      <div>
                        <Label>Preferred time *</Label>
                        <Select onValueChange={(v) => setValue("startTime", v)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((t) => {
                              const [h, m] = t.split(":")
                              const hour = parseInt(h)
                              const label = `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`
                              return <SelectItem key={t} value={t}>{label}</SelectItem>
                            })}
                          </SelectContent>
                        </Select>
                        {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional notes <span className="text-stone-400 font-normal">(optional)</span></Label>
                      <Textarea
                        id="notes"
                        placeholder="Any questions or anything else we should know?"
                        className="mt-1"
                        rows={3}
                        {...register("notes")}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Request Trial Lesson"}
                </Button>

                <p className="text-center text-xs text-stone-400">
                  A trainer will confirm your appointment within 24 hours. No payment required until your lesson is confirmed.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
