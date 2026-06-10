export type UserRole = "student" | "trainer" | "owner"
export type LessonStatus = "pending" | "approved" | "cancelled" | "completed"
export type LessonType = "regular" | "trial"
export type PaymentStatus = "unpaid" | "paid" | "waived"

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  created_at: string
  updated_at: string
}

export interface Trainer {
  id: string
  bio: string | null
  specialties: string[] | null
  accepts_trial_lessons: boolean
  lesson_rate_30min: number | null
  lesson_rate_60min: number | null
  created_at: string
  profile?: Profile
}

export interface Availability {
  id: string
  trainer_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export interface BlockedDate {
  id: string
  trainer_id: string
  blocked_date: string
  start_time: string | null
  end_time: string | null
  reason: string | null
}

export interface Lesson {
  id: string
  trainer_id: string
  student_id: string | null
  lesson_date: string
  start_time: string
  duration_minutes: 30 | 60
  status: LessonStatus
  lesson_type: LessonType
  notes: string | null
  guest_name: string | null
  guest_email: string | null
  guest_phone: string | null
  payment_status: PaymentStatus
  payment_amount: number | null
  payment_method: string | null
  trainer_notes: string | null
  created_at: string
  updated_at: string
  trainer?: Profile
  student?: Profile
}
