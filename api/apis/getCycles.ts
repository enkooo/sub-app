import axios from '@/api/axiosConfig'

export const getCycles = async () => {
  try {
    const response = await axios.get('/api/cycles')

    return response.data
  } catch (error) {
    throw error
  }
}
