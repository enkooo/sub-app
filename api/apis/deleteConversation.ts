import axios from '@/api/axiosConfig'

export const deleteConversation = async ({ id }: { id: string }) => {
  try {
    const response = await axios.delete(`/api/conversations/${id}`)

    return response
  } catch (error) {
    throw error
  }
}
