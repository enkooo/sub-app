import axios from '@/api/axiosConfig'
import { Message as MessageType } from '@/types/Message'

const OPENAI_URL = process.env.EXPO_PUBLIC_OPENAI_URL

export const sendCompletions = async ({
  messages,
  userMessage,
}: {
  messages: MessageType[]
  userMessage: MessageType
}) => {
  try {
    const response = await axios.post(`${OPENAI_URL}/completion`, [
      ...messages,
      userMessage,
    ])

    return response
  } catch (error) {
    throw error
  }
}
