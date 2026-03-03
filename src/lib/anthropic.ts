import Anthropic from '@anthropic-ai/sdk'

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined

if (!apiKey) {
  console.warn(
    '[HotelScout] VITE_ANTHROPIC_API_KEY is not set. ' +
    'Add it to your .env.local file to enable AI features.',
  )
}

export const anthropic = new Anthropic({
  apiKey: apiKey ?? '',
  dangerouslyAllowBrowser: true,
})

export async function askClaude(prompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const block = message.content[0]
  return block.type === 'text' ? block.text : ''
}

export async function generateHotelIntel(hotelName: string, city: string): Promise<string> {
  return askClaude(
    `You are a hotel revenue management expert. Provide a concise sales intelligence brief for: ` +
    `${hotelName} in ${city}. Include: ` +
    `(1) estimated RevPAR range, ` +
    `(2) key revenue pain points, ` +
    `(3) recommended Duetto product pitch angle. ` +
    `Keep it under 150 words, bullet-point format.`,
  )
}

export async function scoreProspect(data: {
  hotelName: string
  rooms: number
  starRating: number
  currentRms: string
}): Promise<string> {
  return askClaude(
    `Score this hotel prospect for Duetto RMS adoption likelihood (1–10) and explain in 2 sentences:\n` +
    `Hotel: ${data.hotelName}, Rooms: ${data.rooms}, Stars: ${data.starRating}, ` +
    `Current RMS: ${data.currentRms || 'unknown/manual'}.`,
  )
}
