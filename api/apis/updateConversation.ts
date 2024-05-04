import axios from '@/api/axiosConfig'
import { Message as MessageType } from '@/types/Message'

export const updateConversation = async ({
  id,
  messages,
}: {
  id: string
  messages: MessageType[]
}) => {
  try {
    const response = await axios.put(`/api/conversations/${id}`, {
      messages: messages,
    })

    return response
  } catch (error) {
    throw error
  }
}
