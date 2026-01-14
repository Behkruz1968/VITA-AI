import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user already completed onboarding
  const { data: assessment } = await supabase.from("lifestyle_assessments").select("id").eq("user_id", user.id).single()

  if (assessment) {
    redirect("/dashboard")
  }

  return <OnboardingFlow userId={user.id} />
}
