"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

export default function UpdatePasswordPage() {
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError("")
    const { error: updateError } = await supabase.auth.updateUser({ password: data.password })

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push("/dashboard"), 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-blue-700 mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-3">Password updated</h2>
          <p className="text-stone-500 mb-8">Your password has been changed. Redirecting you to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Set a new password</h1>
          <p className="text-stone-500">Choose a new password for your account.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
            {error.toLowerCase().includes("session") && (
              <p className="mt-2">
                Your reset link may have expired.{" "}
                <Link href="/reset-password" className="underline font-medium">Request a new one</Link>.
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="password">New password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="At least 8 characters"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your new password"
              className="mt-1"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</> : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
