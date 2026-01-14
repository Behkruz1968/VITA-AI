"use client"

import type React from "react"
import type { User } from "@supabase/supabase-js"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Zap,
  Brain,
  Target,
  Droplets,
  Moon,
  Utensils,
  MessageCircle,
  Search,
  LogOut,
  Check,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardContentProps {
  user: User
  profile: { display_name: string | null } | null
  assessment: {
    activity_level: string
    stress_level: string
    lifestyle_classification: {
      activityType: string
      lifestyleBalance: string
      stressCategory: string
      riskIndicators: string[]
      summary: string
    }
  }
  todayLog: {
    energy_level: number | null
    water_glasses: number | null
    daily_task_completed: boolean
    daily_task: string | null
    ai_suggestion: string | null
  } | null
}

export function DashboardContent({ user, profile, assessment, todayLog }: DashboardContentProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const displayName = profile?.display_name || user.email?.split("@")[0] || "there"
  const greeting = getGreeting()
  const classification = assessment.lifestyle_classification

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  // Generate daily task if not exists
  const dailyTask = todayLog?.daily_task || generateDailyTask(classification.riskIndicators)
  const aiSuggestion = todayLog?.ai_suggestion || generateAISuggestion(classification)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">VITA</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-foreground font-medium">
                Home
              </Link>
              <Link href="/coach" className="text-muted-foreground hover:text-foreground transition-colors">
                AI Coach
              </Link>
              <Link href="/food" className="text-muted-foreground hover:text-foreground transition-colors">
                Food
              </Link>
            </nav>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {greeting}, {displayName}
          </h1>
          <p className="text-muted-foreground">Here's your lifestyle overview for today</p>
        </div>

        {/* Main Grid - Netflix style large cards */}
        <div className="grid gap-6 mb-8">
          {/* Hero Card - AI Suggestion */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8 border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">AI Insight for Today</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">{aiSuggestion}</p>
              </div>
            </div>
          </div>

          {/* Today's Task Card */}
          <DailyTaskCard task={dailyTask} completed={todayLog?.daily_task_completed || false} userId={user.id} />

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Zap className="w-5 h-5" />}
              label="Energy Level"
              value={todayLog?.energy_level ? `${todayLog.energy_level}/10` : "Not logged"}
              color="primary"
            />
            <StatCard
              icon={<Droplets className="w-5 h-5" />}
              label="Water Today"
              value={todayLog?.water_glasses ? `${todayLog.water_glasses} glasses` : "0 glasses"}
              color="accent"
            />
            <StatCard
              icon={<Brain className="w-5 h-5" />}
              label="Stress Level"
              value={classification.stressCategory}
              color="primary"
            />
            <StatCard
              icon={<Target className="w-5 h-5" />}
              label="Lifestyle"
              value={classification.lifestyleBalance}
              color="accent"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              href="/coach"
              icon={<MessageCircle className="w-6 h-6" />}
              title="Talk to AI Coach"
              description="Get personalized advice and motivation"
              color="primary"
            />
            <QuickActionCard
              href="/food"
              icon={<Search className="w-6 h-6" />}
              title="Search Food"
              description="Find nutrition info and get AI tips"
              color="accent"
            />
            <QuickActionCard
              href="/dashboard/log"
              icon={<Moon className="w-6 h-6" />}
              title="Log Today"
              description="Track your energy, water, and mood"
              color="primary"
            />
          </div>
        </div>

        {/* Focus Areas */}
        {classification.riskIndicators.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Your Focus Areas</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classification.riskIndicators.map((indicator) => (
                <FocusAreaCard key={indicator} indicator={indicator} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/coach" className="flex flex-col items-center gap-1 text-muted-foreground">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Coach</span>
          </Link>
          <Link href="/food" className="flex flex-col items-center gap-1 text-muted-foreground">
            <Utensils className="w-5 h-5" />
            <span className="text-xs">Food</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

function DailyTaskCard({
  task,
  completed,
  userId,
}: {
  task: string
  completed: boolean
  userId: string
}) {
  const [isCompleted, setIsCompleted] = useState(completed)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleComplete = async () => {
    if (isCompleted || isUpdating) return
    setIsUpdating(true)

    const supabase = createClient()
    const today = new Date().toISOString().split("T")[0]

    const { error } = await supabase.from("daily_logs").upsert(
      {
        user_id: userId,
        log_date: today,
        daily_task: task,
        daily_task_completed: true,
      },
      { onConflict: "user_id,log_date" },
    )

    if (!error) {
      setIsCompleted(true)
    }
    setIsUpdating(false)
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-accent">Today's Task</span>
          </div>
          <p className="text-foreground text-lg font-medium leading-relaxed">{task}</p>
        </div>

        <button
          type="button"
          onClick={handleComplete}
          disabled={isCompleted || isUpdating}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0",
            isCompleted
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:bg-primary/20",
          )}
        >
          <Check className="w-6 h-6" />
        </button>
      </div>
      {isCompleted && <p className="text-sm text-primary mt-3">Great job! Task completed.</p>}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: "primary" | "accent"
}) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
          color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent",
        )}
      >
        {icon}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-semibold text-foreground capitalize">{value}</p>
    </div>
  )
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  color: "primary" | "accent"
}) {
  return (
    <Link href={href}>
      <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors group h-full">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
            color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent",
          )}
        >
          {icon}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </Link>
  )
}

function FocusAreaCard({ indicator }: { indicator: string }) {
  const config: Record<string, { icon: React.ReactNode; tip: string }> = {
    sleep: {
      icon: <Moon className="w-5 h-5" />,
      tip: "Try going to bed 30 minutes earlier tonight",
    },
    hydration: {
      icon: <Droplets className="w-5 h-5" />,
      tip: "Set reminders to drink water every 2 hours",
    },
    "screen time": {
      icon: <Brain className="w-5 h-5" />,
      tip: "Take a 5-minute break from screens every hour",
    },
    movement: {
      icon: <Zap className="w-5 h-5" />,
      tip: "Start with a 10-minute walk after lunch",
    },
    nutrition: {
      icon: <Utensils className="w-5 h-5" />,
      tip: "Add one serving of vegetables to your next meal",
    },
  }

  const { icon, tip } = config[indicator] || {
    icon: <Target className="w-5 h-5" />,
    tip: "Focus on small improvements",
  }

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">{icon}</div>
        <span className="font-medium text-foreground capitalize">{indicator}</span>
      </div>
      <p className="text-sm text-muted-foreground">{tip}</p>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function generateDailyTask(riskIndicators: string[]) {
  const tasks: Record<string, string[]> = {
    sleep: ["Go to bed 15 minutes earlier than usual tonight", "Avoid screens 30 minutes before bed"],
    hydration: ["Drink 8 glasses of water today", "Start your morning with a glass of water"],
    "screen time": ["Take a 5-minute screen break every hour", "Spend 30 minutes without your phone today"],
    movement: ["Take a 15-minute walk today", "Do 10 stretches during your breaks"],
    nutrition: ["Eat a healthy breakfast with protein", "Include vegetables in your lunch"],
  }

  const defaultTasks = [
    "Take 3 deep breaths before each meal",
    "Write down 3 things you're grateful for",
    "Spend 10 minutes doing something you enjoy",
  ]

  if (riskIndicators.length > 0) {
    const indicator = riskIndicators[Math.floor(Math.random() * riskIndicators.length)]
    const indicatorTasks = tasks[indicator] || defaultTasks
    return indicatorTasks[Math.floor(Math.random() * indicatorTasks.length)]
  }

  return defaultTasks[Math.floor(Math.random() * defaultTasks.length)]
}

function generateAISuggestion(classification: {
  activityType: string
  lifestyleBalance: string
  stressCategory: string
  riskIndicators: string[]
}) {
  if (classification.stressCategory === "high") {
    return "Your stress levels seem elevated. Try taking short breaks throughout the day and practice deep breathing. Remember, small moments of calm add up."
  }

  if (classification.riskIndicators.includes("sleep")) {
    return "Good sleep is the foundation of energy and focus. Tonight, try dimming lights an hour before bed and avoiding screens to improve your sleep quality."
  }

  if (classification.riskIndicators.includes("hydration")) {
    return "Staying hydrated boosts your energy and focus. Keep a water bottle nearby and aim for a glass every couple of hours throughout the day."
  }

  if (classification.lifestyleBalance === "well balanced") {
    return "You're doing great! Keep up your healthy habits and focus on consistency. Today is a perfect day to maintain your positive momentum."
  }

  return "Every day is a new opportunity to improve your lifestyle. Focus on one small healthy choice today, and those choices will compound over time."
}
