import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const foodSchema = z.object({
  foods: z.array(
    z.object({
      name: z.string().describe("Name of the food"),
      calories: z.number().describe("Calories per serving"),
      servingSize: z.string().describe("Typical serving size"),
      protein: z.number().describe("Protein in grams"),
      carbs: z.number().describe("Carbohydrates in grams"),
      fat: z.number().describe("Fat in grams"),
      ingredients: z.array(z.string()).describe("Main ingredients"),
      aiNote: z.string().describe("Simple practical advice like 'Best for lunch' or 'Drink water after'"),
      bestTime: z.string().describe("Best time to eat: morning, lunch, dinner, or snack"),
    }),
  ),
})

export async function POST(req: Request) {
  const { query } = await req.json()

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: foodSchema,
    prompt: `Search for foods matching: "${query}"

Return 3-5 relevant food items with realistic nutritional information.
Include both the exact food and similar alternatives.
For traditional dishes (like plov, osh, pilav), include cultural variants.
Keep AI notes simple and practical (e.g., "Best for lunch", "Avoid late night", "Drink water after").
Be accurate with calorie counts and macros.`,
  })

  return Response.json(object)
}
