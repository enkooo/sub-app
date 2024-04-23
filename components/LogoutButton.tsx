import React from 'react'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSession } from '@/ctx'

export default function LogoutButton() {
  const { signOut } = useSession()

  const handleLogout = () => {
    signOut()
  }

  return (
    <Pressable onPress={handleLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} />
    </Pressable>
  )
}
