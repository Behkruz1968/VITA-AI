"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Search, ArrowLeft, Flame, Utensils, MessageCircle, Home, Clock, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface FoodItem {
  name: string
  calories: number
  servingSize: string
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
  aiNote: string
  bestTime: string
}

export function FoodSearch() {
  const [query, setQuery] = useState("")
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const popularSearches = ["plov", "salad", "chicken", "rice", "eggs", "fruit", "yogurt", "bread"]

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query
    if (!q.trim()) return

    setIsSearching(true)
    setHasSearched(true)
    setSelectedFood(null)

    try {
      const response = await fetch("/api/food/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      })

      const data = await response.json()
      setFoods(data.foods || [])
    } catch (error) {
      console.error("Error searching food:", error)
      setFoods([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Utensils className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Food Search</h1>
              <p className="text-xs text-muted-foreground">Find nutrition info with AI tips</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for any food..."
              className="w-full h-14 bg-secondary border border-border rounded-xl pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </form>

        {/* Popular Searches */}
        {!hasSearched && (
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-3">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  type="button"
                  onClick={() => {
                    setQuery(search)
                    handleSearch(search)
                  }}
                  className="px-4 py-2 rounded-full bg-secondary text-foreground text-sm hover:bg-secondary/80 transition-colors capitalize"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Search className="w-6 h-6 text-accent" />
            </div>
            <p className="text-muted-foreground">Searching foods...</p>
          </div>
        )}

        {/* Results */}
        {!isSearching && hasSearched && (
          <>
            {foods.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Found {foods.length} results</p>

                {foods.map((food, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedFood(food)}
                    className={cn(
                      "w-full bg-card rounded-2xl p-4 border transition-all text-left",
                      selectedFood?.name === food.name
                        ? "border-primary ring-1 ring-primary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                        <img
                          src={`/.jpg?height=64&width=64&query=${encodeURIComponent(food.name + " food photo")}`}
                          alt={food.name}
                          className="w-full h-full object-cover rounded-xl"
                          crossOrigin="anonymous"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 capitalize">{food.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{food.servingSize}</p>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-accent">
                            <Flame className="w-4 h-4" />
                            <span className="font-medium">{food.calories}</span>
                            <span className="text-xs text-muted-foreground">cal</span>
                          </div>

                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs capitalize">{food.bestTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No foods found. Try a different search.</p>
              </div>
            )}
          </>
        )}

        {/* Food Detail Modal */}
        {selectedFood && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedFood(null)}
          >
            <div
              className="bg-card rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Food Image */}
              <div className="h-48 bg-secondary relative">
                <img
                  src={`/.jpg?height=192&width=512&query=${encodeURIComponent(selectedFood.name + " food dish photo")}`}
                  alt={selectedFood.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <button
                  type="button"
                  onClick={() => setSelectedFood(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-foreground"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                {/* Name and Serving */}
                <h2 className="text-2xl font-bold text-foreground mb-1 capitalize">{selectedFood.name}</h2>
                <p className="text-muted-foreground mb-4">{selectedFood.servingSize}</p>

                {/* AI Note */}
                <div className="bg-primary/10 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary mb-1">AI Tip</p>
                    <p className="text-foreground">{selectedFood.aiNote}</p>
                  </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <MacroCard label="Calories" value={selectedFood.calories} unit="kcal" highlight />
                  <MacroCard label="Protein" value={selectedFood.protein} unit="g" />
                  <MacroCard label="Carbs" value={selectedFood.carbs} unit="g" />
                  <MacroCard label="Fat" value={selectedFood.fat} unit="g" />
                </div>

                {/* Ingredients */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Main Ingredients</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedFood.ingredients.map((ingredient, i) => (
                      <span key={i} className="px-3 py-1 bg-secondary rounded-full text-sm text-foreground capitalize">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden sticky bottom-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/coach" className="flex flex-col items-center gap-1 text-muted-foreground">
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Coach</span>
          </Link>
          <Link href="/food" className="flex flex-col items-center gap-1 text-primary">
            <Utensils className="w-5 h-5" />
            <span className="text-xs">Food</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

function MacroCard({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string
  value: number
  unit: string
  highlight?: boolean
}) {
  return (
    <div className={cn("rounded-xl p-3 text-center", highlight ? "bg-accent/10" : "bg-secondary")}>
      <p className={cn("text-xl font-bold", highlight ? "text-accent" : "text-foreground")}>{value}</p>
      <p className="text-xs text-muted-foreground">{unit}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}
