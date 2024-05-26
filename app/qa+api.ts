import OpenAI from 'openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import { Context } from '@/types/Context'
import { useTransformedContext } from '@/hooks/useTransformedContext'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

export async function POST(request: Request) {
  const { question, context } = await request.json()

  const transformedContext = useTransformedContext(context as Context[])

  const createStore = (docs: any) =>
    MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings())

  const docsFromJSON = () => {
    const blob = new Blob([JSON.stringify(transformedContext)], {
      type: 'application/json',
    })
    const loader = new JSONLoader(blob)

    return loader.load()
  }

  const loadStore = async () => {
    const jsonDocs = await docsFromJSON()

    return createStore([...jsonDocs])
  }

  const store = await loadStore()
  const results = await store.similaritySearch(question)

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are a helpful AI assistant. Answer questions to your best ability.
            Answer the question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say that the application has no context about it.
            Context: ${results.map((r) => r.pageContent).join('\n')}
          `,
      },
      {
        role: 'user',
        content: question,
      },
    ],
  })

  return Response.json(response)
}
