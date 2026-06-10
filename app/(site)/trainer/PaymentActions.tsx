"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TrainerPaymentActions({
  lessonId,
  paymentStatus,
  paymentAmount,
}: {
  lessonId: string
  paymentStatus: string
  paymentAmount: number | null
}) {
  const [amount, setAmount] = useState(paymentAmount?.toString() || "")
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const markPaid = async () => {
    setLoading(true)
    await supabase
      .from("lessons")
      .update({
        payment_status: "paid",
        payment_amount: amount ? parseFloat(amount) : null,
      })
      .eq("id", lessonId)
    setLoading(false)
    setEditing(false)
    router.refresh()
  }

  const setFee = async () => {
    setLoading(true)
    await supabase
      .from("lessons")
      .update({ payment_amount: amount ? parseFloat(amount) : null })
      .eq("id", lessonId)
    setLoading(false)
    setEditing(false)
    router.refresh()
  }

  if (paymentStatus === "paid") {
    return <Badge variant="approved">Paid {paymentAmount ? `$${paymentAmount}` : ""}</Badge>
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      {editing ? (
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              type="number"
              className="pl-5 w-24 text-sm h-8"
            />
          </div>
          <Button size="sm" onClick={markPaid} disabled={loading} className="h-8 text-xs">
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Mark Paid"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="h-8 text-xs">Cancel</Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="h-8 text-xs gap-1">
          <DollarSign className="h-3 w-3" />
          {paymentAmount ? `Mark Paid ($${paymentAmount})` : "Set Fee & Mark Paid"}
        </Button>
      )}
    </div>
  )
}
