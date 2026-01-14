"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowLeft, Send, MessageCircle, Utensils, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface CoachChatProps {
  userId: string
  assessment: {
    activity_level: string
    stress_level: string
    eating_habits: string
    sleep_hours: number
    water_intake: number
    common_issues: string[]
    lifestyle_classification: unknown
  }
  initialMessages: Array<{
    id: string
    role: string
    content: string
    created_at: string
  }>
}

export function CoachChat({ userId, assessment, initialMessages }: CoachChatProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Convert initial messages to the format useChat expects
  const formattedInitialMessages = initialMessages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",
    parts: [{ type: "text" as const, text: msg.content }],
    createdAt: new Date(msg.created_at),
  }))

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        userId,
        assessmentData: {
          activityLevel: assessment.activity_level,
          stressLevel: assessment.stress_level,
          eatingHabits: assessment.eating_habits,
          sleepHours: assessment.sleep_hours,
          waterIntake: assessment.water_intake,
          commonIssues: assessment.common_issues,
          classification: assessment.lifestyle_classification,
        },
      },
    }),
    initialMessages: formattedInitialMessages,
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== "ready") return
    sendMessage({ text: input })
    setInput("")
  }

  const isLoading = status === "streaming" || status === "submitted"

  // Quick action suggestions
  const quickActions = [
    "How can I sleep better?",
    "I need motivation today",
    "What should I eat for lunch?",
    "I feel tired, help me",
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">VITA Coach</h1>
                <p className="text-xs text-muted-foreground">Your AI lifestyle companion</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Hi there! I'm your VITA coach.</h2>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                I'm here to help you build better habits and improve your daily lifestyle. Ask me anything!
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => {
                      sendMessage({ text: action })
                    }}
                    className="px-4 py-2 rounded-full bg-secondary text-foreground text-sm hover:bg-secondary/80 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                // Extract text from parts
                const textContent = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => ("text" in part ? part.text : ""))
                  .join("")

                return (
                  <div
                    key={message.id}
                    className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground",
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground">VITA</span>
                        </div>
                      )}
                      <p className="leading-relaxed whitespace-pre-wrap">{textContent}</p>
                    </div>
                  </div>
                )
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input */}
      <div className="sticky bottom-0 bg-background border-t border-border pb-safe">
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your coach anything..."
              disabled={isLoading}
              className="flex-1 h-12 bg-secondary border border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden border-t border-border">
          <div className="flex items-center justify-around py-3">
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground">
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/coach" className="flex flex-col items-center gap-1 text-primary">
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
    </div>
  )
}
