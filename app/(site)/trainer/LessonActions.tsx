"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function TrainerLessonActions({ lessonId }: { lessonId: string }) {
  const [loading, setLoading] = useState<"approve" | "cancel" | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handle = async (action: "approve" | "cancel") => {
    setLoading(action)
    await supabase
      .from("lessons")
      .update({ status: action === "approve" ? "approved" : "cancelled" })
      .eq("id", lessonId)
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex gap-2 shrink-0">
      <Button
        size="sm"
        onClick={() => handle("approve")}
        disabled={!!loading}
        className="bg-blue-800 hover:bg-blue-700 text-white"
      >
        {loading === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handle("cancel")}
        disabled={!!loading}
      >
        {loading === "cancel" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
        Decline
      </Button>
    </div>
  )
}
