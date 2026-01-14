import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, AlertCircle, ArrowLeft } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-3xl font-bold text-foreground">VITA</span>
        </div>

        {/* Error Card */}
        <div className="bg-card rounded-2xl p-8 border border-border">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">Something went wrong</h1>

          <p className="text-muted-foreground mb-2">{params?.error || "An unspecified error occurred."}</p>

          <p className="text-sm text-muted-foreground mb-8">
            Please try again or contact support if the problem persists.
          </p>

          <Link href="/auth/login">
            <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
