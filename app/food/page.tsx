import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FoodSearch } from "@/components/food/food-search"

function FoodSearchFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  )
}

export default async function FoodPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <Suspense fallback={<FoodSearchFallback />}>
      <FoodSearch />
    </Suspense>
  )
}
