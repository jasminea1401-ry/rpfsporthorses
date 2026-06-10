import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatTime } from "@/lib/utils"
import type { Lesson, Profile } from "@/types/database"
import { TrainerLessonActions } from "../LessonActions"
import { TrainerPaymentActions } from "../PaymentActions"

export default async function TrainerLessonsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*, student:student_id(full_name, phone)")
    .eq("trainer_id", user.id)
    .order("lesson_date", { ascending: false }) as { data: Lesson[] | null }

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-8">All Lessons</h1>
        <Card>
          <CardHeader><CardTitle>Lesson History</CardTitle></CardHeader>
          <CardContent>
            {!lessons || lessons.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-8">No lessons found.</p>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="border border-stone-200 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-stone-900">
                            {lesson.guest_name || (lesson.student as unknown as Profile)?.full_name || "Unknown"}
                          </span>
                          <Badge variant={lesson.status as "pending" | "approved" | "cancelled" | "completed"}>
                            {lesson.status}
                          </Badge>
                          {lesson.lesson_type === "trial" && (
                            <Badge variant="outline">Trial</Badge>
                          )}
                        </div>
                        <div className="text-sm text-stone-500">
                          {formatDate(lesson.lesson_date)} · {formatTime(lesson.start_time)} · {lesson.duration_minutes} min
                        </div>
                        {(lesson.guest_email) && (
                          <div className="text-xs text-stone-400 mt-1">
                            {lesson.guest_email}
                            {lesson.guest_phone && <> · {lesson.guest_phone}</>}
                          </div>
                        )}
                        {lesson.notes && (
                          <div className="text-xs text-stone-400 mt-1 italic">{lesson.notes}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {lesson.status === "pending" && (
                          <TrainerLessonActions lessonId={lesson.id} />
                        )}
                        {lesson.status === "approved" && (
                          <TrainerPaymentActions
                            lessonId={lesson.id}
                            paymentStatus={lesson.payment_status}
                            paymentAmount={lesson.payment_amount}
                          />
                        )}
                      </div>
                    </div>
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
