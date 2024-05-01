import axios from '@/api/axiosConfig'
import userSubscription from '@/assets/userSubscription.json'

export const getSubscriptions = async (params: { userID: number }) => {
  try {
    const response = await axios.get('/api/subscriptions', { params })

    return response.data.data
  } catch (error) {
    throw error
  }
}
