import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useState } from 'react'
import { Platform, View } from 'react-native'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import chatHistoryJson from '@/assets/chatHistory.json'
import ChatHistoryItem from '@/components/ChatHistoryItem'
import { ChatHistoryItem as ChatHistoryItemType } from '@/types/ChatHistoryItem'

const History = () => {
  const [chatHistory, setChatHistory] = useState(chatHistoryJson.items)

  const onRemove = useCallback((chatHistoryItem: ChatHistoryItemType) => {
    setChatHistory((items) =>
      items.filter((item) => item.id !== chatHistoryItem.id),
    )
  }, [])

  return (
    <View className="flex-1 bg-gray-50">
      <GestureHandlerRootView>
        <FlatList
          contentContainerStyle={{ marginTop: 10 }}
          data={chatHistory}
          renderItem={({ item }) => (
            <ChatHistoryItem key={item.id} item={item} onRemove={onRemove} />
          )}
        />
      </GestureHandlerRootView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

export default History
