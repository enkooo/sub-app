import { ExpoRequest, ExpoResponse } from 'expo-router/server'
import OpenAI from 'openai'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

export async function POST(request: ExpoRequest) {
  const body = await request.json()

  console.log('Request:', body)

  const completion = await openai.chat.completions.create({
    messages: body,
    model: 'gpt-3.5-turbo',
  })

  return ExpoResponse.json(completion)
}
