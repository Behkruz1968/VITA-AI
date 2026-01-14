import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user completed onboarding
  const { data: assessment } = await supabase.from("lifestyle_assessments").select("*").eq("user_id", user.id).single()

  if (!assessment) {
    redirect("/onboarding")
  }

  // Get today's log if exists
  const today = new Date().toISOString().split("T")[0]
  const { data: todayLog } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("log_date", today)
    .single()

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return <DashboardContent user={user} profile={profile} assessment={assessment} todayLog={todayLog} />
}
