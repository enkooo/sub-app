import axios from '@/api/axiosConfig'

export const getSubscriptions = async (params: { userID: number }) => {
  try {
    const response = await axios.get('/api/subscriptions', { params })

    return response.data.data
  } catch (error) {
    if ((error as any)?.response?.status === 401) {
      return error
    }
    throw error
  }
}
