import axios from '@/api/axiosConfig'
import { getUserSubscriptions } from './getUserSubscriptions'

const OPENAI_URL = process.env.EXPO_PUBLIC_OPENAI_URL

export const sendQuestion = async ({ question }: { question: string }) => {
  try {
    const context = await getUserSubscriptions()
    const response = await axios.post(`${OPENAI_URL}/qa`, { question, context })

    return response
  } catch (error) {
    throw error
  }
}
