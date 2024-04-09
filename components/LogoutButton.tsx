import React from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function LogoutButton() {
  const { signOut } = useAuth()

  const handleLogout = () => {
    signOut()
  }

  return (
    <Pressable onPress={handleLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} />
    </Pressable>
  )
}
