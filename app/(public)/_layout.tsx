import React from 'react'
import { Stack } from 'expo-router'
import Colors from '@/constants/Colors'
import { StatusBar } from 'expo-status-bar'

const PublicLayout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerTitle: 'Welcome',
          }}
        ></Stack.Screen>
      </Stack>
    </>
  )
}

export default PublicLayout
