import axios from '@/api/axiosConfig'

export const createConversation = async (params: {
  user_id: string
  title: string
  messages: string
}) => {
  try {
    const response = await axios.post(`/api/conversations`, params)

    return response.data.data
  } catch (error) {
    throw error
  }
}
