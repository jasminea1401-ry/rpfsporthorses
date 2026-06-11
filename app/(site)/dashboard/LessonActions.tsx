"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, addDays, startOfDay } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { generateTimeSlots } from "@/lib/scheduling"
import { formatTime } from "@/lib/utils"
import { Loader2, Calendar, X } from "lucide-react"
import type { Availability, BlockedDate } from "@/types/database"

export function ClientLessonActions({
  lessonId,
  trainerId,
  durationMinutes,
  notes,
}: {
  lessonId: string
  trainerId: string
  durationMinutes: number
  notes: string | null
}) {
  const [mode, setMode] = useState<"idle" | "confirmCancel" | "reschedule">("idle")
  const [loading, setLoading] = useState(false)
  const [availability, setAvailability] = useState<Availability[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleCancel = async () => {
    setLoading(true)
    await supabase.from("lessons").update({ status: "cancelled" }).eq("id", lessonId)
    setLoading(false)
    setMode("idle")
    router.refresh()
  }

  const openReschedule = async () => {
    setMode("reschedule")
    setSelectedDate(null)
    setSelectedTime(null)
    if (availability.length === 0) {
      const [{ data: avail }, { data: blocked }] = await Promise.all([
        supabase.from("availability").select("*").eq("trainer_id", trainerId),
        supabase.from("blocked_dates").select("*").eq("trainer_id", trainerId),
      ])
      setAvailability(avail || [])
      setBlockedDates(blocked || [])
    }
  }

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) return
    setLoading(true)
    const updatedNotes = notes
      ? `${notes}\n(Rescheduled by client — awaiting confirmation)`
      : "Rescheduled by client — awaiting confirmation"
    await supabase
      .from("lessons")
      .update({
        lesson_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: selectedTime,
        status: "pending",
        notes: updatedNotes,
      })
      .eq("id", lessonId)
    setLoading(false)
    setMode("idle")
    router.refresh()
  }

  // Next 14 days as quick date options
  const dateOptions = Array.from({ length: 14 }).map((_, i) => addDays(startOfDay(new Date()), i + 1))
  const timeSlots = selectedDate ? generateTimeSlots(availability, blockedDates, selectedDate, durationMinutes) : []

  if (mode === "idle") {
    return (
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="outline" onClick={openReschedule}>
          <Calendar className="h-3.5 w-3.5" />
          Reschedule
        </Button>
        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => setMode("confirmCancel")}>
          <X className="h-3.5 w-3.5" />
          Cancel
        </Button>
      </div>
    )
  }

  if (mode === "confirmCancel") {
    return (
      <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
        <p className="text-sm text-red-700 mb-2">Cancel this lesson? This can&apos;t be undone.</p>
        <div className="flex gap-2">
          <Button size="sm" variant="destructive" onClick={handleCancel} disabled={loading}>
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Yes, cancel lesson"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setMode("idle")} disabled={loading}>
            Never mind
          </Button>
        </div>
      </div>
    )
  }

  // mode === "reschedule"
  return (
    <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-lg">
      <p className="text-sm font-medium text-stone-700 mb-2">Pick a new date</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {dateOptions.map((d) => (
          <button
            key={d.toISOString()}
            onClick={() => { setSelectedDate(d); setSelectedTime(null) }}
            className={`text-xs px-2 py-1.5 rounded-md border ${
              selectedDate && format(selectedDate, "yyyy-MM-dd") === format(d, "yyyy-MM-dd")
                ? "bg-blue-800 text-white border-blue-800"
                : "bg-white border-stone-200 text-stone-600 hover:border-blue-300"
            }`}
          >
            {format(d, "EEE M/d")}
          </button>
        ))}
      </div>

      {selectedDate && (
        <>
          <p className="text-sm font-medium text-stone-700 mb-2">Pick a new time</p>
          {timeSlots.length === 0 ? (
            <p className="text-sm text-stone-400 mb-3">No availability on this date.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mb-3">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`text-xs px-2 py-1.5 rounded-md border ${
                    selectedTime === t
                      ? "bg-blue-800 text-white border-blue-800"
                      : "bg-white border-stone-200 text-stone-600 hover:border-blue-300"
                  }`}
                >
                  {formatTime(t)}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex gap-2">
        <Button size="sm" onClick={handleReschedule} disabled={!selectedDate || !selectedTime || loading}>
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm new time"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setMode("idle")} disabled={loading}>
          Cancel
        </Button>
      </div>
      <p className="text-xs text-stone-400 mt-2">
        Your trainer will need to confirm the new time.
      </p>
    </div>
  )
}
