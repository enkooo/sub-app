import axios from '@/api/axiosConfig'
import userSubscription from '@/assets/userSubscription.json'

export const getSubscriptions = async (params: { userID: number }) => {
  try {
    const response = await axios.get('/api/subscriptions', { params })

    // return response.data
    return userSubscription.items
  } catch (error) {
    throw error
  }
}
