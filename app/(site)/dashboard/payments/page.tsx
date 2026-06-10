import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, ExternalLink } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"
import type { Lesson } from "@/types/database"

const VENMO_USERNAME = process.env.NEXT_PUBLIC_VENMO_USERNAME || "RPFSporthorses"
const PAYPAL_ME = process.env.NEXT_PUBLIC_PAYPAL_ME_URL || "https://paypal.me/RPFSporthorses"

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*, trainer:trainers!lessons_trainer_id_fkey(profile:profiles!trainers_id_fkey(full_name))")
    .eq("student_id", user.id)
    .in("status", ["approved", "completed"])
    .order("lesson_date", { ascending: false }) as { data: Lesson[] | null }

  const unpaid = lessons?.filter((l) => l.payment_status === "unpaid") || []
  const paid = lessons?.filter((l) => l.payment_status === "paid") || []
  const totalOwed = unpaid.reduce((sum, l) => sum + (l.payment_amount || 0), 0)

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-stone-900">Payments</h1>
          <p className="text-stone-500 mt-1">View and pay your lesson fees.</p>
        </div>

        {totalOwed > 0 && (
          <Card className="mb-8 bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-5 w-5 text-amber-700" />
                    <span className="font-semibold text-amber-800">Balance Due</span>
                  </div>
                  <div className="text-3xl font-bold text-amber-900">${totalOwed.toFixed(2)}</div>
                  <div className="text-sm text-amber-700 mt-1">{unpaid.length} unpaid lesson{unpaid.length > 1 ? "s" : ""}</div>
                </div>
                <div className="flex flex-col gap-3 w-full sm:w-auto">
                  <p className="text-sm text-amber-800 font-medium">Pay via:</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`${PAYPAL_ME}/${totalOwed}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#0070ba] hover:bg-[#003087] text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082H9.894l-1.372 8.7h3.485c.458 0 .85-.334.92-.786l.039-.2.733-4.648.047-.255a.93.93 0 0 1 .918-.786h.578c3.741 0 6.67-1.52 7.524-5.913.357-1.84.173-3.374-.544-4.907z" />
                      </svg>
                      Pay via PayPal
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href={`https://venmo.com/${VENMO_USERNAME}?txn=pay&note=Lessons&amount=${totalOwed}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#008CFF] hover:bg-[#0070cc] text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.379 2.07C17.79 2.763 18 3.57 18 4.5c0 2.97-2.537 6.839-4.601 9.555H8.786L6.823 2.569l5.507-.53 1.01 8.136c.944-1.585 2.11-4.084 2.11-5.78 0-.908-.155-1.536-.464-1.919z" />
                      </svg>
                      Pay via Venmo
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-xs text-amber-700">
                    After paying, notify your trainer so they can mark your lesson as paid.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Unpaid lessons */}
        {unpaid.length > 0 && (
          <Card className="mb-6">
            <CardHeader><CardTitle>Unpaid Lessons</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unpaid.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <div>
                      <div className="font-medium text-stone-900">{formatDate(lesson.lesson_date)}</div>
                      <div className="text-sm text-stone-500">
                        {formatTime(lesson.start_time)} · {lesson.duration_minutes} min
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(lesson.trainer as any)?.profile?.full_name && ` · ${(lesson.trainer as any).profile.full_name}`}
                      </div>
                    </div>
                    <div className="text-right">
                      {lesson.payment_amount ? (
                        <div className="font-bold text-stone-900">${lesson.payment_amount.toFixed(2)}</div>
                      ) : (
                        <div className="text-sm text-stone-400">Contact trainer for amount</div>
                      )}
                      <Badge variant="pending" className="mt-1">Unpaid</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment history */}
        <Card>
          <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
          <CardContent>
            {paid.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-8">No payment history yet.</p>
            ) : (
              <div className="space-y-3">
                {paid.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-stone-50 border border-stone-100 rounded-lg">
                    <div>
                      <div className="font-medium text-stone-900">{formatDate(lesson.lesson_date)}</div>
                      <div className="text-sm text-stone-500">
                        {formatTime(lesson.start_time)} · {lesson.duration_minutes} min
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(lesson.trainer as any)?.profile?.full_name && ` · ${(lesson.trainer as any).profile.full_name}`}
                      </div>
                    </div>
                    <div className="text-right">
                      {lesson.payment_amount && (
                        <div className="font-bold text-stone-900">${lesson.payment_amount.toFixed(2)}</div>
                      )}
                      <Badge variant="approved" className="mt-1">Paid</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-stone-400 mt-8">
          Payment questions? Contact us at{" "}
          <a href="mailto:info@rpfsporthorses.com" className="text-blue-800 hover:underline">
            info@rpfsporthorses.com
          </a>
        </p>
      </div>
    </div>
  )
}
