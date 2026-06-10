"use client"
import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail } from "lucide-react"

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError("")
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${siteUrl}/auth/callback?next=/update-password`,
    })

    if (resetError) {
      setError(resetError.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-700" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-3">Check your email</h2>
          <p className="text-stone-500 mb-8">
            If an account exists for that email address, we&apos;ve sent a link to reset your password. Click it to choose a new password.
          </p>
          <Link href="/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/login" className="text-stone-400 hover:text-stone-600 text-sm mb-6 block">← Back to login</Link>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Reset your password</h1>
          <p className="text-stone-500">Enter your email address and we&apos;ll send you a link to reset your password.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  )
}
