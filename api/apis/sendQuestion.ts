import axios from '@/api/axiosConfig'

const OPENAI_URL = process.env.EXPO_PUBLIC_OPENAI_URL

export const sendQuestion = async ({ question }: { question: string }) => {
  try {
    const response = await axios.post(`${OPENAI_URL}/qa`, { question })

    return response
  } catch (error) {
    throw error
  }
}
