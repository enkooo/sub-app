import React from 'react'
import { Redirect, useRouter } from 'expo-router'
import { useSession } from '../../../ctx'
import { Tabs } from 'expo-router'
import Colors from '@/constants/Colors'
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import LogoutButton from '@/components/LogoutButton'
import { Pressable, Text } from 'react-native'
import { useAppDispatch } from '@/hooks/rtk'
import { newChat } from '@/state/chatSlice'
import { toggleFiltersModal } from '@/state/categoryFiltersSlice'

export default function RootLayout() {
  const { session, isLoading } = useSession()
  const dispatch = useAppDispatch()
  const router = useRouter()

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (!session) {
    return <Redirect href="/sign-in" />
  }

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
            headerTitle: 'Subscriptions',
            tabBarLabel: 'Subscriptions',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
            headerRight: () => (
              <Pressable
                onPress={() => router.push('/addNewSubscription')}
                className="mr-5"
              >
                <Ionicons name="add-circle-outline" size={24} color="black" />
              </Pressable>
            ),
            headerLeft: () => (
              <Pressable
                className="ml-5"
                onPress={() => {
                  dispatch(toggleFiltersModal())
                }}
              >
                <Ionicons
                  name="filter-circle-outline"
                  size={24}
                  color="black"
                />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="analysis"
          options={{
            headerTitle: 'Analysis',
            tabBarLabel: 'Analysis',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="analytics" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            headerTitle: 'AI Assistant',
            tabBarLabel: 'AI Assistant',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="message-outline"
                color={color}
                size={size}
              />
            ),
            headerLeft: () => (
              <Pressable onPress={startNewChat} className="ml-5">
                <MaterialCommunityIcons
                  name="pencil-box-outline"
                  size={24}
                  color="black"
                />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable onPress={openChatHistory} className="mr-5">
                <MaterialCommunityIcons
                  name="history"
                  size={24}
                  color="black"
                />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: 'Profile',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                color={color}
                size={size}
              />
            ),
            headerRight: () => <LogoutButton />,
          }}
        />
      </Tabs>
    </>
  )
}
