import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, Plus, User } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import type { Lesson, Profile } from "@/types/database"
import { ClientLessonActions } from "./LessonActions"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Profile | null }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*, trainer:trainers!lessons_trainer_id_fkey(profile:profiles!trainers_id_fkey(full_name))")
    .eq("student_id", user.id)
    .order("lesson_date", { ascending: false })
    .limit(10) as { data: Lesson[] | null }

  const upcoming = lessons?.filter(
    (l) => l.status !== "cancelled" && new Date(`${l.lesson_date}T${l.start_time}`) >= new Date()
  ) || []
  const past = lessons?.filter(
    (l) => l.status === "completed" || new Date(`${l.lesson_date}T${l.start_time}`) < new Date()
  ) || []
  const unpaid = lessons?.filter((l) => l.payment_status === "unpaid" && l.status === "approved") || []

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-900">
              Welcome back, {profile?.full_name?.split(" ")[0] || "Rider"}
            </h1>
            <p className="text-stone-500 mt-1">Manage your lessons and payments.</p>
          </div>
          <Link href="/dashboard/schedule">
            <Button>
              <Plus className="h-4 w-4" />
              Book a Lesson
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-900" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">{upcoming.length}</div>
                <div className="text-sm text-stone-500">Upcoming lessons</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">{unpaid.length}</div>
                <div className="text-sm text-stone-500">Unpaid invoices</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-stone-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">{past.length}</div>
                <div className="text-sm text-stone-500">Lessons completed</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming lessons */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Lessons</CardTitle>
                <Link href="/dashboard/schedule" className="text-sm text-blue-800 hover:underline">
                  Schedule new →
                </Link>
              </CardHeader>
              <CardContent>
                {upcoming.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500 mb-4">No upcoming lessons scheduled.</p>
                    <Link href="/dashboard/schedule">
                      <Button variant="outline">Book a Lesson</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((lesson) => (
                      <div key={lesson.id} className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-stone-900">
                              {formatDate(lesson.lesson_date)}
                            </div>
                            <div className="text-sm text-stone-500">
                              {formatTime(lesson.start_time)} · {lesson.duration_minutes} min
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {(lesson.trainer as any)?.profile?.full_name && ` · ${(lesson.trainer as any).profile.full_name}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={lesson.status as "pending" | "approved" | "cancelled" | "completed"}>
                              {lesson.status}
                            </Badge>
                            {lesson.payment_status === "unpaid" && lesson.status === "approved" && (
                              <Link href="/dashboard/payments">
                                <Badge variant="pending">Pay now</Badge>
                              </Link>
                            )}
                          </div>
                        </div>
                        {(lesson.status === "pending" || lesson.status === "approved") && (
                          <ClientLessonActions
                            lessonId={lesson.id}
                            trainerId={lesson.trainer_id}
                            durationMinutes={lesson.duration_minutes}
                            notes={lesson.notes}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick links */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/schedule" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Calendar className="h-4 w-4 text-blue-800" />
                    Book a Lesson
                  </Button>
                </Link>
                <Link href="/dashboard/payments" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <DollarSign className="h-4 w-4 text-blue-800" />
                    Make a Payment
                  </Button>
                </Link>
                <Link href="/dashboard/profile" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <User className="h-4 w-4 text-blue-800" />
                    Update Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {unpaid.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-amber-700" />
                    <span className="font-semibold text-amber-800">Payment Due</span>
                  </div>
                  <p className="text-sm text-amber-700 mb-3">
                    You have {unpaid.length} unpaid lesson{unpaid.length > 1 ? "s" : ""}.
                  </p>
                  <Link href="/dashboard/payments">
                    <Button variant="gold" className="w-full" size="sm">Pay Now</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
