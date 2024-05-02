import axios from '@/api/axiosConfig'

export const createCategory = async (params: {
  name: string
  user_id: number
}) => {
  try {
    const response = await axios.post('/api/categories', params)

    return response.data
  } catch (error) {
    throw error
  }
}
