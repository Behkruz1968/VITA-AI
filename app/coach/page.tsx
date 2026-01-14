import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CoachChat } from "@/components/coach/coach-chat"

export default async function CoachPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's assessment data for context
  const { data: assessment } = await supabase.from("lifestyle_assessments").select("*").eq("user_id", user.id).single()

  if (!assessment) {
    redirect("/onboarding")
  }

  // Get recent chat history
  const { data: chatHistory } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(50)

  return <CoachChat userId={user.id} assessment={assessment} initialMessages={chatHistory || []} />
}
