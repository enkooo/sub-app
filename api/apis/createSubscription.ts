import axios from '@/api/axiosConfig'

export const createSubscription = async (params: {
  image?: string
  user_id: number
  name: string
  currency: string
  currency_value: number
  cycle_id: number
  category_id: number
}) => {
  try {
    const response = await axios.post('/api/subscriptions', params)

    return response.data
  } catch (error) {
    throw error
  }
}
