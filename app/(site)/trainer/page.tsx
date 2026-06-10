import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Settings, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import type { Lesson, Profile } from "@/types/database"
import { TrainerLessonActions } from "./LessonActions"

export default async function TrainerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null }

  if (!profile || !["trainer", "owner"].includes(profile.role)) {
    redirect("/dashboard")
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*, student:student_id(full_name, phone)")
    .eq("trainer_id", user.id)
    .order("lesson_date", { ascending: true }) as { data: Lesson[] | null }

  const pending = lessons?.filter((l) => l.status === "pending") || []
  const upcoming = lessons?.filter(
    (l) => l.status === "approved" && new Date(`${l.lesson_date}T${l.start_time}`) >= new Date()
  ) || []
  const today = lessons?.filter(
    (l) => l.status === "approved" && l.lesson_date === new Date().toISOString().split("T")[0]
  ) || []

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-900">
              Trainer Dashboard
            </h1>
            <p className="text-stone-500 mt-1">
              Welcome back, {profile?.full_name?.split(" ")[0]}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/trainer/availability">
              <Button variant="outline">
                <Settings className="h-4 w-4" />
                Set Availability
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">{pending.length}</div>
                <div className="text-sm text-stone-500">Pending approval</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-800" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">{upcoming.length}</div>
                <div className="text-sm text-stone-500">Upcoming lessons</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-stone-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">{today.length}</div>
                <div className="text-sm text-stone-500">Lessons today</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending requests */}
        {pending.length > 0 && (
          <Card className="mb-8 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Pending Requests ({pending.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pending.map((lesson) => (
                  <div key={lesson.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">
                          {lesson.guest_name || (lesson.student as unknown as Profile)?.full_name || "Unknown"}
                        </span>
                        {lesson.lesson_type === "trial" && (
                          <Badge variant="pending" className="bg-purple-100 text-purple-700">Trial</Badge>
                        )}
                      </div>
                      <div className="text-sm text-stone-500 mt-1">
                        {formatDate(lesson.lesson_date)} · {formatTime(lesson.start_time)} · {lesson.duration_minutes} min
                      </div>
                      {lesson.notes && (
                        <div className="text-xs text-stone-400 mt-1 italic">{lesson.notes}</div>
                      )}
                      {lesson.guest_email && (
                        <div className="text-xs text-stone-500 mt-1">
                          {lesson.guest_email} · {lesson.guest_phone}
                        </div>
                      )}
                    </div>
                    <TrainerLessonActions lessonId={lesson.id} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming approved */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Lessons</CardTitle>
              <Link href="/trainer/lessons" className="text-sm text-blue-800 hover:underline">View all →</Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-8">No upcoming approved lessons.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.slice(0, 8).map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-stone-50 border border-stone-100 rounded-lg">
                    <div>
                      <div className="font-medium text-stone-900">
                        {lesson.guest_name || (lesson.student as unknown as Profile)?.full_name || "Unknown"}
                      </div>
                      <div className="text-sm text-stone-500">
                        {formatDate(lesson.lesson_date)} · {formatTime(lesson.start_time)} · {lesson.duration_minutes} min
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={lesson.payment_status === "paid" ? "approved" : "pending"}>
                        {lesson.payment_status}
                      </Badge>
                      {lesson.lesson_type === "trial" && (
                        <Badge variant="outline">Trial</Badge>
                      )}
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
