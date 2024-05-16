import React, { useEffect, useRef, useState } from 'react'
import { Redirect, useRouter } from 'expo-router'
import { Tabs } from 'expo-router'
import Colors from '@/constants/Colors'
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { LogoutButton } from '@/components/LogoutButton'
import {
  ActivityIndicator,
  Platform,
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
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export default function RootLayout() {
  const [expoPushToken, setExpoPushToken] = useState<string>()
  const [notification, setNotification] = useState<Notifications.Notification>()
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {})

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        )
      }

      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

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

async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = 'subscription-manager-3e7b1'
  } else {
    alert('Must use physical device for Push Notifications')
  }

  return token
}
