import axios from '@/api/axiosConfig'

export const getSubscriptionById = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get(`/api/subscriptions/${id}`)

    return response.data.data
  } catch (error) {
    throw error
  }
}
