import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Platform, Text, View } from 'react-native'

const History = () => {
  return (
    <View className="flex-1 bg-red-200">
      <Text>History Chat</Text>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

export default History
