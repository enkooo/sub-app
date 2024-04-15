import React from 'react'
import { Tabs, useRouter } from 'expo-router'
import Colors from '@/constants/Colors'
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { useAuth } from '@clerk/clerk-expo'
import LogoutButton from '@/components/LogoutButton'
import { Pressable } from 'react-native'
import { useAppDispatch } from '@/hooks/rtk'
import { newChat } from '@/state/chatSlice'

const Layout = () => {
  const dispatch = useAppDispatch()

  const router = useRouter()
  const { isSignedIn } = useAuth()

  const openChatHistory = () => {
    router.push('/history')
  }

  const startNewChat = () => {
    dispatch(newChat())
  }

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
            headerRight: () => (
              <Pressable
                onPress={() => router.push('/addNewSubscription')}
                className="mr-3"
              >
                <Ionicons name="add-circle-outline" size={24} color="black" />
              </Pressable>
            ),
          }}
          redirect={!isSignedIn}
        />
        <Tabs.Screen
          name="analysis"
          options={{
            headerTitle: 'Analysis',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="analytics" color={color} size={size} />
            ),
          }}
          redirect={!isSignedIn}
        />
        <Tabs.Screen
          name="chat"
          options={{
            headerTitle: 'Chat',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="message-outline"
                color={color}
                size={size}
              />
            ),
            headerLeft: () => (
              <Pressable onPress={startNewChat} className="ml-3">
                <MaterialCommunityIcons
                  name="pencil-box-outline"
                  size={24}
                  color="black"
                />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable onPress={openChatHistory} className="mr-3">
                <MaterialCommunityIcons
                  name="history"
                  size={24}
                  color="black"
                />
              </Pressable>
            ),
          }}
          redirect={!isSignedIn}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: 'My Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                color={color}
                size={size}
              />
            ),
            headerRight: () => <LogoutButton />,
          }}
          redirect={!isSignedIn}
        />
      </Tabs>
    </>
  )
}

export default Layout
