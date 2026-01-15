import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"
import { createClient } from "@/lib/supabase/server"
import { createOpenAI } from "@ai-sdk/openai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, userId, assessmentData }: { messages: UIMessage[]; userId: string; assessmentData: unknown } =
    await req.json()

  const systemPrompt = `You are VITA, a friendly and supportive AI lifestyle coach. Your role is to help users improve their daily lifestyle through simple, achievable guidance.

PERSONALITY:
- Warm, encouraging, and human-like
- Not clinical or doctor-like
- Focus on practical, everyday advice
- Celebrate small wins
- Never use medical diagnoses or prescribe treatments

USER CONTEXT:
${JSON.stringify(assessmentData, null, 2)}

GUIDELINES:
1. Ask about their day: "Did you eat well today?", "How was your sleep?", "Did you move your body?"
2. Give ONE small, achievable task per interaction
3. Provide natural health guidance (hydration, rest, breathing) NOT medical advice
4. Be encouraging and supportive
5. Keep responses concise and conversational (2-4 sentences usually)
6. Suggest lifestyle improvements based on their assessment data
7. Focus on: food timing, hydration, movement, rest, and mindset

Remember: You help people change behavior through small, sustainable steps. You're their lifestyle companion, not a doctor.`

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemPrompt,
    prompt,
    abortSignal: req.signal,
  })

  // Save messages to database in background
  const saveMessages = async () => {
    try {
      const supabase = await createClient()
      const lastUserMessage = messages[messages.length - 1]
      if (lastUserMessage && lastUserMessage.role === "user") {
        // Get text content from parts
        const textPart = lastUserMessage.parts?.find((p) => p.type === "text")
        const content = textPart && "text" in textPart ? textPart.text : ""
        if (content) {
          await supabase.from("chat_messages").insert({
            user_id: userId,
            role: "user",
            content,
          })
        }
      }
    } catch (error) {
      console.error("Error saving message:", error)
    }
  }

  saveMessages()

  return result.toUIMessageStreamResponse({
    onFinish: async ({ text }) => {
      // Save assistant response
      try {
        const supabase = await createClient()
        if (text) {
          await supabase.from("chat_messages").insert({
            user_id: userId,
            role: "assistant",
            content: text,
          })
        }
      } catch (error) {
        console.error("Error saving assistant message:", error)
      }
    },
    consumeSseStream: consumeStream,
  })
}
