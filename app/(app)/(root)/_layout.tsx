import React, { useEffect } from 'react'
import { Redirect, useRouter } from 'expo-router'
import { Tabs } from 'expo-router'
import Colors from '@/constants/Colors'
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import LogoutButton from '@/components/LogoutButton'
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
} from 'react-native'
import { useAppDispatch, useAppSelector } from '@/hooks/rtk'
import { newChat } from '@/state/chatSlice'
import { toggleFiltersModal } from '@/state/categoryFiltersSlice'
import {
  getCurrentUser,
  selectCurrentUser,
  selectIsLoadingAuth,
} from '@/state/authSlice'

export default function RootLayout() {
  const currentUser = useAppSelector(selectCurrentUser)
  const isLoadingAuth = useAppSelector(selectIsLoadingAuth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  if (isLoadingAuth) {
    return <ActivityIndicator size="large" />
  }

  if (!isLoadingAuth && currentUser === null) {
    return <Redirect href="/sign-in" />
  }

  const openChatHistory = () => {
    router.push('/history')
  }

  const startNewChat = () => {
    dispatch(newChat())
    router.push(`/chat/new`)
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
          name="chat/[id]"
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
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={startNewChat} />
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
