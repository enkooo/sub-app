import axios from '@/api/axiosConfig'

export const getUserConversations = async () => {
  try {
    const response = await axios.get('/api/user/conversations')

    return response.data.data
  } catch (error) {
    if ((error as any)?.response?.status === 401) {
      return error
    }
    throw error
  }
}
