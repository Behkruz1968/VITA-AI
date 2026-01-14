import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Mail, ArrowRight } from "lucide-react"

export default function SignUpSuccessPage() {
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

        {/* Success Card */}
        <div className="bg-card rounded-2xl p-8 border border-border">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">Check your email</h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            We've sent you a confirmation link. Click the link in your email to verify your account and start your
            lifestyle journey.
          </p>

          <Link href="/auth/login">
            <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
              Go to Login
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
