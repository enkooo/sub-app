import axios from '@/api/axiosConfig'

export const deleteSubscription = async ({ id }: { id: number }) => {
  try {
    const response = await axios.delete(`/api/subscriptions/${id}`)

    return response
  } catch (error) {
    throw error
  }
}
