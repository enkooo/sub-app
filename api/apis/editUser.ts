import axios from '@/api/axiosConfig'

export const editUser = async (
  id: number,
  params: {
    base64_image?: string
    name?: string
    password?: string
    password_confirmation?: string
    old_password?: string
    days_before_notification?: number
  },
) => {
  try {
    const response = await axios.put(`/api/users/${id}`, params)

    return response
  } catch (error) {
    throw error
  }
}
