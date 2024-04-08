import { ExpoRequest, ExpoResponse } from 'expo-router/server'

export async function POST(req: ExpoRequest): Promise<ExpoResponse> {
  const { prompt } = await req.json()

  const json = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify({
      prompt,
      model: 'gpt-3.5-turbo',
      max_tokens: 100,
    }),
  }).then((res) => res.json())

  return ExpoResponse.json(json)
}
