import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useState } from 'react'
import { Platform, View } from 'react-native'

const Filters = () => {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

export default Filters
