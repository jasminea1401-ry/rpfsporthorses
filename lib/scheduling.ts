import { format, getDay } from "date-fns"
import type { Availability, BlockedDate } from "@/types/database"

export function generateTimeSlots(availability: Availability[], blocked: BlockedDate[], date: Date, duration: number): string[] {
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
