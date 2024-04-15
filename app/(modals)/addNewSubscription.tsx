import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Platform, View } from 'react-native'

const AddNewSubscription = () => {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

export default AddNewSubscription
