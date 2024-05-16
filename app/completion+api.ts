import OpenAI from 'openai'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

export async function POST(request: Request) {
  const body = await request.json()

  const completion = await openai.chat.completions.create({
    messages: body,
    model: 'gpt-4',
  })

  return Response.json(completion)
}
