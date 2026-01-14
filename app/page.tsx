import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Heart, Brain, Utensils } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">VITA</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-foreground hover:text-foreground/80">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </header>

          {/* Hero Content */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto pt-12 pb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">AI-Powered Lifestyle Transformation</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
              Transform Your Daily Life with AI
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl text-pretty">
              VITA helps you build sustainable habits, optimize your nutrition, and achieve balance through personalized
              AI coaching and daily routines.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg border-border text-foreground hover:bg-secondary bg-transparent"
                >
                  I have an account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain className="w-6 h-6" />}
            title="AI Lifestyle Coach"
            description="Get personalized daily tasks, motivation, and insights from your AI companion that adapts to your lifestyle."
            color="primary"
          />
          <FeatureCard
            icon={<Utensils className="w-6 h-6" />}
            title="Smart Food Tracking"
            description="Search foods, scan meals, and get practical eating advice tailored to your goals and preferences."
            color="accent"
          />
          <FeatureCard
            icon={<Heart className="w-6 h-6" />}
            title="Daily Routines"
            description="AI-built personalized routines for wake-up, meals, movement, and evening wind-down."
            color="primary"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="bg-card rounded-3xl p-8 md:p-16 text-center border border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Ready to transform your lifestyle?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Take our 2-minute lifestyle assessment and get your personalized AI coaching plan.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-lg">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">VITA</span>
          </div>
          <p className="text-sm text-muted-foreground">Your AI-powered lifestyle companion</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: "primary" | "accent"
}) {
  return (
    <div className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-colors">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
          color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
