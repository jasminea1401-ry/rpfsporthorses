"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Loader2, CheckCircle } from "lucide-react"
import type { Availability, BlockedDate } from "@/types/database"
import { format, addDays } from "date-fns"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

type AvailSlot = { id?: string; day_of_week: number; start_time: string; end_time: string }

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<AvailSlot[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [newBlock, setNewBlock] = useState({ date: "", start_time: "", end_time: "", reason: "" })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      const [{ data: avail }, { data: blocked }] = await Promise.all([
        supabase.from("availability").select("*").eq("trainer_id", user.id),
        supabase.from("blocked_dates").select("*").eq("trainer_id", user.id).order("blocked_date"),
      ])
      setSlots(avail || [])
      setBlockedDates(blocked || [])
    }
    load()
  }, [])

  const addSlot = (day: number) => {
    setSlots([...slots, { day_of_week: day, start_time: "08:00", end_time: "17:00" }])
  }

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index))
  }

  const updateSlot = (index: number, field: keyof AvailSlot, value: string | number) => {
    setSlots(slots.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const saveAvailability = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from("availability").delete().eq("trainer_id", user.id)
    if (slots.length > 0) {
      await supabase.from("availability").insert(
        slots.map((s) => ({ trainer_id: user.id, day_of_week: s.day_of_week, start_time: s.start_time, end_time: s.end_time }))
      )
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addBlockedDate = async () => {
    if (!newBlock.date) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from("blocked_dates").insert({
      trainer_id: user.id,
      blocked_date: newBlock.date,
      start_time: newBlock.start_time || null,
      end_time: newBlock.end_time || null,
      reason: newBlock.reason || null,
    }).select().single()

    if (data) setBlockedDates([...blockedDates, data as BlockedDate])
    setNewBlock({ date: "", start_time: "", end_time: "", reason: "" })
  }

  const removeBlockedDate = async (id: string) => {
    await supabase.from("blocked_dates").delete().eq("id", id)
    setBlockedDates(blockedDates.filter((b) => b.id !== id))
  }

  const slotsPerDay = (day: number) => slots.filter((s) => s.day_of_week === day)

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-900">Set Availability</h1>
            <p className="text-stone-500 mt-1">Configure your weekly schedule and block off time when unavailable.</p>
          </div>
          <Button onClick={saveAvailability} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4" /> : null}
            {saved ? "Saved!" : "Save Schedule"}
          </Button>
        </div>

        {/* Weekly availability */}
        <Card className="mb-8">
          <CardHeader><CardTitle>Weekly Schedule</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DAYS.map((day, dayIndex) => {
                const daySlots = slotsPerDay(dayIndex)
                return (
                  <div key={day} className="border border-stone-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-stone-900">{day}</span>
                      <button
                        onClick={() => addSlot(dayIndex)}
                        className="text-blue-800 hover:text-blue-900 text-sm flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add hours
                      </button>
                    </div>
                    {daySlots.length === 0 ? (
                      <span className="text-xs text-stone-400">Unavailable</span>
                    ) : (
                      <div className="space-y-2">
                        {daySlots.map((slot) => {
                          const slotIndex = slots.findIndex((s) => s === slot)
                          return (
                            <div key={slotIndex} className="flex items-center gap-3">
                              <div className="flex items-center gap-2 flex-1">
                                <Input
                                  type="time"
                                  value={slot.start_time}
                                  onChange={(e) => updateSlot(slotIndex, "start_time", e.target.value)}
                                  className="w-32 text-sm"
                                />
                                <span className="text-stone-400 text-sm">to</span>
                                <Input
                                  type="time"
                                  value={slot.end_time}
                                  onChange={(e) => updateSlot(slotIndex, "end_time", e.target.value)}
                                  className="w-32 text-sm"
                                />
                              </div>
                              <button
                                onClick={() => removeSlot(slotIndex)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Block dates */}
        <Card>
          <CardHeader><CardTitle>Block Off Time</CardTitle></CardHeader>
          <CardContent>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-stone-700 mb-3">Add a blocked date or period</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Date *</Label>
                  <Input
                    type="date"
                    value={newBlock.date}
                    min={format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Reason (optional)</Label>
                  <Input
                    value={newBlock.reason}
                    placeholder="E.g. Vacation, show day"
                    onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Start time (leave blank for full day)</Label>
                  <Input
                    type="time"
                    value={newBlock.start_time}
                    onChange={(e) => setNewBlock({ ...newBlock, start_time: e.target.value })}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">End time</Label>
                  <Input
                    type="time"
                    value={newBlock.end_time}
                    onChange={(e) => setNewBlock({ ...newBlock, end_time: e.target.value })}
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
              <Button onClick={addBlockedDate} size="sm" className="mt-3" disabled={!newBlock.date}>
                <Plus className="h-4 w-4" /> Block This Date
              </Button>
            </div>

            {blockedDates.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-4">No blocked dates.</p>
            ) : (
              <div className="space-y-2">
                {blockedDates.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                    <div>
                      <span className="font-medium text-stone-900 text-sm">{b.blocked_date}</span>
                      {b.start_time ? (
                        <span className="text-stone-500 text-sm ml-2">
                          {b.start_time} — {b.end_time || "end of day"}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-sm ml-2">All day</span>
                      )}
                      {b.reason && <span className="text-stone-400 text-xs ml-2">· {b.reason}</span>}
                    </div>
                    <button
                      onClick={() => b.id && removeBlockedDate(b.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
