import axios from '@/api/axiosConfig'

export const createSubscription = async (params: {
  base64_image?: string
  name: string
  currency: string
  currency_value: number
  cycle_id: number
  category_id: number
  start_date: string
}) => {
  try {
    const response = await axios.post('/api/subscriptions', params)

    return response.data
  } catch (error) {
    throw error
  }
}
