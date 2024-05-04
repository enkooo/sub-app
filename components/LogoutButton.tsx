import React from 'react'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAppDispatch } from '@/hooks/rtk'
import { logout } from '@/state/authSlice'

export default function LogoutButton() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logout())
    router.replace('/sign-in')
  }

  return (
    <Pressable onPress={handleLogout} style={{ marginRight: 20 }}>
      <Ionicons name="log-out-outline" size={24} />
    </Pressable>
  )
}
