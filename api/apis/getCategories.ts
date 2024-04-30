import axios from '@/api/axiosConfig'

export const getCategories = async () => {
  try {
    const response = await axios.get('/api/categories')

    return response.data
  } catch (error) {
    throw error
  }
}
