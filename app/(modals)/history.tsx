import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useRef, useState } from 'react'
import { Platform, View } from 'react-native'
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler'
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

  const scrollRef = useRef(null)

  return (
    <View className="flex-1 bg-white">
      <GestureHandlerRootView>
        <ScrollView ref={scrollRef}>
          {chatHistory.map((item) => (
            <ChatHistoryItem
              key={item.id}
              simultaneousHandlers={scrollRef}
              item={item}
              onRemove={onRemove}
            />
          ))}
        </ScrollView>
      </GestureHandlerRootView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

export default History
