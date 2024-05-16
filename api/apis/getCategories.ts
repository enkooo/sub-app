import axios from '@/api/axiosConfig'

export const getCategories = async ({ id }: { id: number }) => {
  try {
    const response = await axios.get('/api/categories', {
      params: { withUser: id },
    })

    return response.data
  } catch (error) {
    throw error
  }
}
