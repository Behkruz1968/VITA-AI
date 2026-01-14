import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DailyLogForm } from "@/components/dashboard/daily-log-form"

export default async function DailyLogPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const today = new Date().toISOString().split("T")[0]
  const { data: existingLog } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("log_date", today)
    .single()

  return <DailyLogForm userId={user.id} existingLog={existingLog} />
}
