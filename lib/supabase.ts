import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Specialist {
  id: string
  full_name: string
  email: string
  specialty: string | null
  avatar_url: string | null
  created_at: string
}

export interface PatientProfile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  created_at: string
}

export interface SpecialistPatient {
  id: string
  specialist_id: string
  patient_id: string
  status: 'active' | 'warning' | 'new' | 'archived'
  diagnosis: string | null
  next_appointment: string | null
  created_at: string
  profiles: PatientProfile
}

export interface MoodEntry {
  id: string
  user_id: string
  level: number
  label: string | null
  emoji: string | null
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  title: string
  description: string | null
  content: string | null
  images: string[]
  created_at: string
}

export interface DiagnosticResult {
  id: string
  user_id: string
  tool_id: string
  tool_name: string
  score: number
  max_score: number
  interpretation: string | null
  created_at: string
}

export interface FollowUpItem {
  id: string
  specialist_id: string
  patient_id: string
  label: string
  description: string | null
  scheduled_date: string | null
  completed: boolean
  created_at: string
}

export interface ConversationCount {
  user_id: string
  message_count: number
}
