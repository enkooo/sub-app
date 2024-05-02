import axios from '@/api/axiosConfig'

export const editSubscription = async (
  id: string,
  params: {
    image?: string
    name: string
    currency: string
    currency_value: number
    cycle_id: number
    category_id: number
    start_date: string
  },
) => {
  try {
    const response = await axios.put(`/api/subscriptions/${id}`, params)

    return response.data
  } catch (error) {
    throw error
  }
}
