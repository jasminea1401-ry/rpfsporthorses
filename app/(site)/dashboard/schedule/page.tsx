"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { addDays, format, startOfDay, getDay, isSameDay, addMonths, subMonths, getDaysInMonth, startOfMonth } from "date-fns"
import type { Trainer, Availability, BlockedDate } from "@/types/database"
import { cn } from "@/lib/utils"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function generateTimeSlots(availability: Availability[], blocked: BlockedDate[], date: Date, duration: number): string[] {
  const dayOfWeek = getDay(date)
  const daySlots = availability.filter((a) => a.day_of_week === dayOfWeek)
  if (daySlots.length === 0) return []

  const dateStr = format(date, "yyyy-MM-dd")
  const blockedOnDate = blocked.filter((b) => b.blocked_date === dateStr)

  const slots: string[] = []
  for (const slot of daySlots) {
    let [startH, startM] = slot.start_time.split(":").map(Number)
    const [endH, endM] = slot.end_time.split(":").map(Number)
    const endMinutes = endH * 60 + endM

    while (startH * 60 + startM + duration <= endMinutes) {
      const timeStr = `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`
      const slotEndMinutes = startH * 60 + startM + duration

      const isBlocked = blockedOnDate.some((b) => {
        if (!b.start_time) return true
        const [bStartH, bStartM] = b.start_time.split(":").map(Number)
        const [bEndH, bEndM] = (b.end_time || "23:59").split(":").map(Number)
        const bStart = bStartH * 60 + bStartM
        const bEnd = bEndH * 60 + bEndM
        const slotStart = startH * 60 + startM
        return slotStart < bEnd && slotEndMinutes > bStart
      })

      if (!isBlocked) slots.push(timeStr)
      startM += 30
      if (startM >= 60) { startH++; startM -= 60 }
    }
  }
  return slots
}

export default function SchedulePage() {
  const [trainers, setTrainers] = useState<(Trainer & { profile: { full_name: string } })[]>([])
  const [selectedTrainer, setSelectedTrainer] = useState<string>("")
  const [availability, setAvailability] = useState<Availability[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [duration, setDuration] = useState<30 | 60>(60)
  const [notes, setNotes] = useState("")
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("trainers")
        .select("*, profile:profiles!trainers_id_fkey(full_name)")
        .eq("accepts_trial_lessons", false)
      setTrainers((data as any) || [])
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedTrainer) return
    const load = async () => {
      const [{ data: avail }, { data: blocked }] = await Promise.all([
        supabase.from("availability").select("*").eq("trainer_id", selectedTrainer),
        supabase.from("blocked_dates").select("*").eq("trainer_id", selectedTrainer),
      ])
      setAvailability(avail || [])
      setBlockedDates(blocked || [])
    }
    load()
  }, [selectedTrainer])

  const availableDaysOfWeek = new Set(availability.map((a) => a.day_of_week))
  const today = startOfDay(new Date())

  const calYear = calendarDate.getFullYear()
  const calMonth = calendarDate.getMonth()
  const daysInMonth = getDaysInMonth(calendarDate)
  const firstDayOfWeek = getDay(startOfMonth(calendarDate))

  const isDateAvailable = (date: Date) => {
    if (date < addDays(today, 0)) return false
    if (!availableDaysOfWeek.has(getDay(date))) return false
    const dateStr = format(date, "yyyy-MM-dd")
    const fullyBlocked = blockedDates.some((b) => b.blocked_date === dateStr && !b.start_time)
    return !fullyBlocked
  }

  const timeSlots = selectedDate && selectedTrainer
    ? generateTimeSlots(availability, blockedDates, selectedDate, duration)
    : []

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedTrainer) return
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }

    const { error } = await supabase.from("lessons").insert({
      trainer_id: selectedTrainer,
      student_id: user.id,
      lesson_date: format(selectedDate, "yyyy-MM-dd"),
      start_time: selectedTime,
      duration_minutes: duration,
      lesson_type: "regular",
      notes,
      status: "pending",
    })

    setSubmitting(false)
    if (!error) setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-blue-700 mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-3">Lesson Requested!</h2>
          <p className="text-stone-500 mb-8">Your trainer will review your request and confirm within 24 hours.</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-stone-900">Schedule a Lesson</h1>
          <p className="text-stone-500 mt-1">Pick your trainer, date, and time.</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-3 mb-8">
          {["Trainer & Duration", "Date & Time", "Confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium",
                i + 1 <= step ? "bg-blue-900 text-white" : "bg-stone-200 text-stone-500"
              )}>{i + 1}</div>
              <span className={cn("text-sm hidden sm:block", i + 1 === step ? "text-stone-900 font-medium" : "text-stone-400")}>{s}</span>
              {i < 2 && <div className="w-8 h-px bg-stone-200" />}
            </div>
          ))}
        </div>

        {/* Step 1: Trainer & Duration */}
        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Select a Trainer</CardTitle></CardHeader>
              <CardContent>
                {trainers.length === 0 ? (
                  <p className="text-stone-500 text-sm">Loading trainers...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trainers.map((t) => (
                      <label
                        key={t.id}
                        className={cn(
                          "cursor-pointer border-2 rounded-xl p-4 transition-colors",
                          selectedTrainer === t.id ? "border-blue-900 bg-blue-50" : "border-stone-200 hover:border-stone-300"
                        )}
                      >
                        <input type="radio" className="sr-only" value={t.id} onChange={() => { setSelectedTrainer(t.id); setSelectedDate(null); setSelectedTime(""); }} />
                        <div className="font-semibold text-stone-900">{t.profile?.full_name}</div>
                        {t.specialties && <div className="text-xs text-stone-400 mt-1">{t.specialties.join(", ")}</div>}
                      </label>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Lesson Duration</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {([30, 60] as const).map((d) => (
                    <label
                      key={d}
                      className={cn(
                        "cursor-pointer border-2 rounded-xl p-4 text-center transition-colors",
                        duration === d ? "border-blue-900 bg-blue-50" : "border-stone-200 hover:border-stone-300"
                      )}
                    >
                      <input type="radio" className="sr-only" value={d} onChange={() => { setDuration(d); setSelectedTime(""); }} />
                      <div className="text-2xl font-bold text-stone-900">{d}</div>
                      <div className="text-sm text-stone-500">minutes</div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              disabled={!selectedTrainer}
              onClick={() => setStep(2)}
            >
              Continue to Date & Time
            </Button>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{format(calendarDate, "MMMM yyyy")}</CardTitle>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCalendarDate(subMonths(calendarDate, 1))}
                      className="p-1 rounded hover:bg-stone-100"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCalendarDate(addMonths(calendarDate, 1))}
                      className="p-1 rounded hover:bg-stone-100"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-stone-400 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const date = new Date(calYear, calMonth, i + 1)
                    const available = isDateAvailable(date)
                    const isSelected = selectedDate && isSameDay(date, selectedDate)
                    const isPast = date < today

                    return (
                      <button
                        key={i}
                        disabled={!available || isPast}
                        onClick={() => { setSelectedDate(date); setSelectedTime(""); }}
                        className={cn(
                          "w-full aspect-square rounded-lg text-sm font-medium transition-colors",
                          isSelected ? "bg-blue-900 text-white" :
                          available && !isPast ? "hover:bg-blue-50 text-stone-900" :
                          "text-stone-300 cursor-not-allowed"
                        )}
                      >
                        {i + 1}
                      </button>
                    )
                  })}
                </div>
                {selectedTrainer && (
                  <p className="text-xs text-stone-400 mt-3">
                    Highlighted dates indicate trainer availability.
                  </p>
                )}
              </CardContent>
            </Card>

            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Times — {format(selectedDate, "EEEE, MMMM d")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {timeSlots.length === 0 ? (
                    <p className="text-stone-500 text-sm">No available times for this date. Please select another date.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((t) => {
                        const [h, m] = t.split(":").map(Number)
                        const hour = h > 12 ? h - 12 : h
                        const label = `${hour}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`
                        return (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={cn(
                              "py-2 px-3 rounded-lg text-sm font-medium border-2 transition-colors",
                              selectedTime === t
                                ? "border-blue-900 bg-blue-900 text-white"
                                : "border-stone-200 hover:border-blue-400 text-stone-700"
                            )}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button
                className="flex-1"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(3)}
              >
                Continue to Confirm
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedDate && (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Confirm Your Lesson</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-stone-400 mb-1">Trainer</div>
                    <div className="font-medium text-stone-900">
                      {trainers.find((t) => t.id === selectedTrainer)?.profile?.full_name}
                    </div>
                  </div>
                  <div>
                    <div className="text-stone-400 mb-1">Duration</div>
                    <div className="font-medium text-stone-900">{duration} minutes</div>
                  </div>
                  <div>
                    <div className="text-stone-400 mb-1">Date</div>
                    <div className="font-medium text-stone-900">{format(selectedDate, "EEEE, MMMM d, yyyy")}</div>
                  </div>
                  <div>
                    <div className="text-stone-400 mb-1">Time</div>
                    <div className="font-medium text-stone-900">
                      {(() => {
                        const [h, m] = selectedTime.split(":").map(Number)
                        return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`
                      })()}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes for your trainer <span className="text-stone-400 font-normal">(optional)</span></Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What would you like to work on?"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <strong>Pending approval:</strong> Your trainer will review and confirm this lesson within 24 hours. Payment is due at the lesson.
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : "Request Lesson"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
