import axios from '@/api/axiosConfig'

export const getConversation = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get(`/api/conversations/${id}`)

    return response
  } catch (error) {
    throw error
  }
}
