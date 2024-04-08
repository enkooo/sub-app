import React from 'react'
import { Tabs } from 'expo-router'
import Colors from '@/constants/Colors'
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { KeyboardAvoidingView, Platform } from 'react-native'

const Layout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { fontFamily: 'mon-sb' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="analysis"
          options={{
            tabBarLabel: 'Analysis',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="analytics" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="message-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </>
  )
}

export default Layout
