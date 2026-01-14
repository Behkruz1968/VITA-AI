"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingData {
  age: number | null
  gender: string
  sleepHours: number | null
  activityLevel: string
  stressLevel: string
  eatingHabits: string
  screenTime: number | null
  waterIntake: number | null
  commonIssues: string[]
}

const initialData: OnboardingData = {
  age: null,
  gender: "",
  sleepHours: null,
  activityLevel: "",
  stressLevel: "",
  eatingHabits: "",
  screenTime: null,
  waterIntake: null,
  commonIssues: [],
}

const STEPS = [
  { id: "welcome", title: "Welcome" },
  { id: "basics", title: "Basics" },
  { id: "lifestyle", title: "Lifestyle" },
  { id: "habits", title: "Habits" },
  { id: "health", title: "Health" },
  { id: "results", title: "Results" },
]

export function OnboardingFlow({ userId }: { userId: string }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [analysis, setAnalysis] = useState<{
    activityType: string
    lifestyleBalance: string
    stressCategory: string
    riskIndicators: string[]
    summary: string
  } | null>(null)
  const router = useRouter()

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return true
      case 1:
        return data.age && data.gender
      case 2:
        return data.sleepHours && data.activityLevel
      case 3:
        return data.stressLevel && data.eatingHabits
      case 4:
        return data.screenTime !== null && data.waterIntake !== null
      default:
        return true
    }
  }

  const handleNext = async () => {
    if (step === 4) {
      // Submit and analyze
      setIsSubmitting(true)

      try {
        // Analyze the lifestyle data
        const analysisResult = analyzeLifestyle(data)
        setAnalysis(analysisResult)

        // Save to database
        const supabase = createClient()
        const { error } = await supabase.from("lifestyle_assessments").insert({
          user_id: userId,
          age: data.age,
          gender: data.gender,
          sleep_hours: data.sleepHours,
          activity_level: data.activityLevel,
          stress_level: data.stressLevel,
          eating_habits: data.eatingHabits,
          screen_time: data.screenTime,
          water_intake: data.waterIntake,
          common_issues: data.commonIssues,
          lifestyle_classification: analysisResult,
        })

        if (error) throw error

        setStep(5)
      } catch (error) {
        console.error("Error saving assessment:", error)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1)
  }

  const handleFinish = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">VITA</span>
        </div>

        {/* Progress */}
        {step > 0 && step < 5 && (
          <div className="flex items-center gap-1">
            {STEPS.slice(1, 5).map((s, i) => (
              <div
                key={s.id}
                className={cn("w-8 h-1.5 rounded-full transition-colors", i < step ? "bg-primary" : "bg-secondary")}
              />
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {step === 0 && <WelcomeStep />}
          {step === 1 && <BasicsStep data={data} updateData={updateData} />}
          {step === 2 && <LifestyleStep data={data} updateData={updateData} />}
          {step === 3 && <HabitsStep data={data} updateData={updateData} />}
          {step === 4 && <HealthStep data={data} updateData={updateData} />}
          {step === 5 && analysis && <ResultsStep analysis={analysis} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {step > 0 && step < 5 ? (
            <Button variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8"
            >
              {isSubmitting ? (
                "Analyzing..."
              ) : step === 4 ? (
                "See My Results"
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 w-full"
            >
              Start My Journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}

function WelcomeStep() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-4">Smart Lifestyle Test</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
        Answer a few questions so our AI can understand your current lifestyle and create a personalized plan for you.
      </p>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Check className="w-4 h-4 text-primary" />
        <span>Takes only 2 minutes</span>
      </div>
    </div>
  )
}

function BasicsStep({
  data,
  updateData,
}: {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}) {
  const ageOptions = [
    { value: 20, label: "18-25" },
    { value: 30, label: "26-35" },
    { value: 40, label: "36-45" },
    { value: 50, label: "46-55" },
    { value: 60, label: "56+" },
  ]

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Let's start with the basics</h2>
      <p className="text-muted-foreground mb-8 text-center">Tell us a bit about yourself</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Your age range</label>
          <div className="grid grid-cols-3 gap-3">
            {ageOptions.map((option) => (
              <SelectButton
                key={option.value}
                selected={data.age === option.value}
                onClick={() => updateData({ age: option.value })}
              >
                {option.label}
              </SelectButton>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Gender</label>
          <div className="grid grid-cols-3 gap-3">
            {genderOptions.map((option) => (
              <SelectButton
                key={option.value}
                selected={data.gender === option.value}
                onClick={() => updateData({ gender: option.value })}
              >
                {option.label}
              </SelectButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LifestyleStep({
  data,
  updateData,
}: {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}) {
  const sleepOptions = [
    { value: 5, label: "Less than 5h" },
    { value: 6, label: "5-6 hours" },
    { value: 7, label: "7-8 hours" },
    { value: 9, label: "More than 8h" },
  ]

  const activityOptions = [
    { value: "sedentary", label: "Sedentary", desc: "Little to no exercise" },
    { value: "moderate", label: "Moderate", desc: "Exercise 2-3x/week" },
    { value: "active", label: "Active", desc: "Exercise 4+ times/week" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Your daily lifestyle</h2>
      <p className="text-muted-foreground mb-8 text-center">How do you spend your days?</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Average sleep per night</label>
          <div className="grid grid-cols-2 gap-3">
            {sleepOptions.map((option) => (
              <SelectButton
                key={option.value}
                selected={data.sleepHours === option.value}
                onClick={() => updateData({ sleepHours: option.value })}
              >
                {option.label}
              </SelectButton>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Physical activity level</label>
          <div className="space-y-3">
            {activityOptions.map((option) => (
              <SelectButton
                key={option.value}
                selected={data.activityLevel === option.value}
                onClick={() => updateData({ activityLevel: option.value })}
                className="w-full justify-start px-4 py-4"
              >
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.desc}</div>
                </div>
              </SelectButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HabitsStep({
  data,
  updateData,
}: {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}) {
  const stressOptions = [
    { value: "low", label: "Low", desc: "I feel calm most days" },
    { value: "moderate", label: "Moderate", desc: "Some stress but manageable" },
    { value: "high", label: "High", desc: "Often stressed or anxious" },
  ]

  const eatingOptions = [
    { value: "poor", label: "Needs work", desc: "Fast food, irregular meals" },
    { value: "average", label: "Average", desc: "Mixed, could be better" },
    { value: "good", label: "Good", desc: "Balanced, mostly healthy" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Your habits</h2>
      <p className="text-muted-foreground mb-8 text-center">How would you describe these?</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Stress level</label>
          <div className="space-y-3">
            {stressOptions.map((option) => (
              <SelectButton
                key={option.value}
                selected={data.stressLevel === option.value}
                onClick={() => updateData({ stressLevel: option.value })}
                className="w-full justify-start px-4 py-4"
              >
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.desc}</div>
                </div>
              </SelectButton>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Eating habits</label>
          <div className="space-y-3">
            {eatingOptions.map((option) => (
              <SelectButton
                key={option.value}
                selected={data.eatingHabits === option.value}
                onClick={() => updateData({ eatingHabits: option.value })}
                className="w-full justify-start px-4 py-4"
              >
                <div className="text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.desc}</div>
                </div>
              </SelectButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HealthStep({
  data,
  updateData,
}: {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}) {
  const screenOptions = [
    { value: 2, label: "1-2 hours" },
    { value: 4, label: "3-5 hours" },
    { value: 7, label: "6-8 hours" },
    { value: 10, label: "8+ hours" },
  ]

  const waterOptions = [
    { value: 2, label: "1-2 glasses" },
    { value: 4, label: "3-5 glasses" },
    { value: 7, label: "6-8 glasses" },
    { value: 10, label: "8+ glasses" },
  ]

  const issueOptions = [
    { value: "headache", label: "Headaches" },
    { value: "fatigue", label: "Fatigue" },
    { value: "weight_gain", label: "Weight gain" },
    { value: "low_energy", label: "Low energy" },
    { value: "poor_sleep", label: "Poor sleep" },
    { value: "stress", label: "Stress" },
  ]

  const toggleIssue = (issue: string) => {
    const current = data.commonIssues
    if (current.includes(issue)) {
      updateData({ commonIssues: current.filter((i) => i !== issue) })
    } else {
      updateData({ commonIssues: [...current, issue] })
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Final questions</h2>
      <p className="text-muted-foreground mb-8 text-center">Almost done!</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Daily screen time</label>
          <div className="grid grid-cols-2 gap-3">
            {screenOptions.map((option) => (
              <SelectButton
                key={option.value}
                selected={data.screenTime === option.value}
                onClick={() => updateData({ screenTime: option.value })}
              >
                {option.label}
              </SelectButton>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Daily water intake</label>
          <div className="grid grid-cols-2 gap-3">
            {waterOptions.map((option) => (
              <SelectButton
                key={option.value}
                selected={data.waterIntake === option.value}
                onClick={() => updateData({ waterIntake: option.value })}
              >
                {option.label}
              </SelectButton>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Common issues (select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {issueOptions.map((option) => (
              <SelectButton
                key={option.value}
                selected={data.commonIssues.includes(option.value)}
                onClick={() => toggleIssue(option.value)}
              >
                {option.label}
              </SelectButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultsStep({
  analysis,
}: {
  analysis: {
    activityType: string
    lifestyleBalance: string
    stressCategory: string
    riskIndicators: string[]
    summary: string
  }
}) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
        <Check className="w-10 h-10 text-primary" />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">Your Lifestyle Snapshot</h2>
      <p className="text-muted-foreground mb-8">Here's what we found</p>

      <div className="bg-card rounded-2xl p-6 border border-border text-left space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Activity Level</span>
          <span className="font-medium text-foreground capitalize">{analysis.activityType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Lifestyle Balance</span>
          <span className="font-medium text-foreground capitalize">{analysis.lifestyleBalance}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Stress Level</span>
          <span className="font-medium text-foreground capitalize">{analysis.stressCategory}</span>
        </div>
        {analysis.riskIndicators.length > 0 && (
          <div className="pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Focus areas: </span>
            <span className="text-sm text-accent font-medium">{analysis.riskIndicators.join(", ")}</span>
          </div>
        )}
      </div>

      <div className="bg-secondary/50 rounded-xl p-4 text-left">
        <p className="text-foreground leading-relaxed">{analysis.summary}</p>
      </div>
    </div>
  )
}

function SelectButton({
  children,
  selected,
  onClick,
  className,
}: {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-xl border-2 p-3 transition-all",
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card text-foreground hover:border-primary/50",
        className,
      )}
    >
      {children}
    </button>
  )
}

function analyzeLifestyle(data: OnboardingData) {
  const activityType = data.activityLevel || "sedentary"

  let lifestyleBalance = "balanced"
  let balanceScore = 0

  if (data.sleepHours && data.sleepHours >= 7) balanceScore++
  if (data.activityLevel === "active" || data.activityLevel === "moderate") balanceScore++
  if (data.eatingHabits === "good") balanceScore++
  if (data.waterIntake && data.waterIntake >= 6) balanceScore++
  if (data.stressLevel === "low") balanceScore++

  if (balanceScore <= 1) lifestyleBalance = "needs improvement"
  else if (balanceScore <= 3) lifestyleBalance = "moderately balanced"
  else lifestyleBalance = "well balanced"

  const stressCategory = data.stressLevel || "moderate"

  const riskIndicators: string[] = []
  if (data.sleepHours && data.sleepHours < 6) riskIndicators.push("sleep")
  if (data.waterIntake && data.waterIntake < 5) riskIndicators.push("hydration")
  if (data.screenTime && data.screenTime > 6) riskIndicators.push("screen time")
  if (data.activityLevel === "sedentary") riskIndicators.push("movement")
  if (data.eatingHabits === "poor") riskIndicators.push("nutrition")

  let summary = "Your AI coach is ready to help you "
  if (riskIndicators.length === 0) {
    summary += "maintain your healthy lifestyle with personalized daily tips and routines."
  } else if (riskIndicators.length <= 2) {
    summary += `improve your ${riskIndicators.join(" and ")} with simple, achievable daily tasks.`
  } else {
    summary += "transform your lifestyle step by step. We'll focus on one small change at a time."
  }

  return {
    activityType,
    lifestyleBalance,
    stressCategory,
    riskIndicators,
    summary,
  }
}
