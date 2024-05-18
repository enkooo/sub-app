import axios from '@/api/axiosConfig'

export const getAnalysis = async ({
  dateStart,
  dateEnd,
  type,
}: {
  dateStart: string
  dateEnd: string
  type?: 'category'
}) => {
  try {
    const response = await axios.get('/api/subscriptions/analyse', {
      params: {
        date_start: dateStart,
        date_end: dateEnd,
        type,
      },
    })

    return response.data
  } catch (error) {
    throw error
  }
}
