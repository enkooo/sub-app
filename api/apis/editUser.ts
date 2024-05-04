import axios from '@/api/axiosConfig'

export const editUser = async (
  id: number,
  params: {
    image?: string
    name?: string
    password?: string
    password_confirmation?: string
    old_password?: string
  },
) => {
  try {
    const response = await axios.put(`/api/users/${id}`, params)

    return response
  } catch (error) {
    throw error
  }
}
