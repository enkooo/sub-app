import React from 'react'
import { Stack, useRouter } from 'expo-router'
import Colors from '@/constants/Colors'
import { StatusBar } from 'expo-status-bar'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const PublicLayout = () => {
  const router = useRouter()

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerTitle: 'Welcome',
          }}
        />
      </Stack>
    </>
  )
}

export default PublicLayout
