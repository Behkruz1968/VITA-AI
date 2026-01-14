"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowLeft, Zap, Droplets, Moon, Smile } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyLogFormProps {
  userId: string
  existingLog: {
    energy_level: number | null
    water_glasses: number | null
    sleep_quality: number | null
    mood: string | null
    exercise_done: boolean
    notes: string | null
  } | null
}

export function DailyLogForm({ userId, existingLog }: DailyLogFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    energyLevel: existingLog?.energy_level || 5,
    waterGlasses: existingLog?.water_glasses || 0,
    sleepQuality: existingLog?.sleep_quality || 5,
    mood: existingLog?.mood || "",
    exerciseDone: existingLog?.exercise_done || false,
    notes: existingLog?.notes || "",
  })

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const supabase = createClient()
    const today = new Date().toISOString().split("T")[0]

    const { error } = await supabase.from("daily_logs").upsert(
      {
        user_id: userId,
        log_date: today,
        energy_level: formData.energyLevel,
        water_glasses: formData.waterGlasses,
        sleep_quality: formData.sleepQuality,
        mood: formData.mood,
        exercise_done: formData.exerciseDone,
        notes: formData.notes || null,
      },
      { onConflict: "user_id,log_date" },
    )

    if (!error) {
      router.push("/dashboard")
      router.refresh()
    }
    setIsSubmitting(false)
  }

  const moodOptions = [
    { value: "great", label: "Great" },
    { value: "good", label: "Good" },
    { value: "okay", label: "Okay" },
    { value: "low", label: "Low" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Daily Log</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-2xl font-bold text-foreground mb-2">How was your day?</h1>
        <p className="text-muted-foreground mb-8">Track your daily wellness</p>

        <div className="space-y-8">
          {/* Energy Level */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Energy Level</span>
              <span className="ml-auto text-lg font-semibold text-primary">{formData.energyLevel}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.energyLevel}
              onChange={(e) => setFormData((prev) => ({ ...prev, energyLevel: Number.parseInt(e.target.value) }))}
              className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Water Intake */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-accent" />
              <span className="font-medium text-foreground">Water Intake</span>
              <span className="ml-auto text-lg font-semibold text-accent">{formData.waterGlasses} glasses</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData((prev) => ({ ...prev, waterGlasses: Math.max(0, prev.waterGlasses - 1) }))}
                className="bg-transparent border-border text-foreground"
              >
                -
              </Button>
              <div className="flex-1 flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 h-8 rounded transition-colors cursor-pointer",
                      i < formData.waterGlasses ? "bg-accent" : "bg-secondary",
                    )}
                    onClick={() => setFormData((prev) => ({ ...prev, waterGlasses: i + 1 }))}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData((prev) => ({ ...prev, waterGlasses: Math.min(10, prev.waterGlasses + 1) }))}
                className="bg-transparent border-border text-foreground"
              >
                +
              </Button>
            </div>
          </div>

          {/* Sleep Quality */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Sleep Quality</span>
              <span className="ml-auto text-lg font-semibold text-primary">{formData.sleepQuality}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.sleepQuality}
              onChange={(e) => setFormData((prev) => ({ ...prev, sleepQuality: Number.parseInt(e.target.value) }))}
              className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Mood */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Smile className="w-5 h-5 text-accent" />
              <span className="font-medium text-foreground">Mood</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, mood: option.value }))}
                  className={cn(
                    "py-3 px-4 rounded-xl border-2 transition-all text-sm font-medium",
                    formData.mood === option.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise */}
          <div>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, exerciseDone: !prev.exerciseDone }))}
              className={cn(
                "w-full py-4 px-6 rounded-xl border-2 transition-all flex items-center justify-between",
                formData.exerciseDone
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50",
              )}
            >
              <span className="font-medium text-foreground">Did you exercise today?</span>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  formData.exerciseDone ? "bg-primary border-primary" : "border-muted-foreground",
                )}
              >
                {formData.exerciseDone && (
                  <svg
                    className="w-4 h-4 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-foreground mb-3">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="How are you feeling? Any thoughts?"
              className="w-full h-24 bg-secondary border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-medium"
          >
            {isSubmitting ? "Saving..." : existingLog ? "Update Log" : "Save Log"}
          </Button>
        </div>
      </main>
    </div>
  )
}
