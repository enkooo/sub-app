import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  FlatList,
  GestureHandlerRootView,
  RefreshControl,
} from 'react-native-gesture-handler'
import ChatHistoryItem from '@/components/ChatHistoryItem'
import { ChatHistoryItem as ChatHistoryItemType } from '@/types/ChatHistoryItem'
import { useRouter } from 'expo-router'
import { getUserConversations } from '@/api/apis/getUserConversations'
import { deleteConversation } from '@/api/apis/deleteConversation'

const History = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItemType[] | null>()
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const getUserChatHistory = async () => {
    try {
      setRefreshing(true)
      const response = await getUserConversations()
      setChatHistory(response)
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  const removeChatHistoryItem = async (id: string) => {
    try {
      await deleteConversation({ id: id })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUserChatHistory()
  }, [])

  const onRemove = useCallback((chatHistoryItem: ChatHistoryItemType) => {
    setChatHistory((items) =>
      items?.filter((item) => item.id !== chatHistoryItem.id),
    )

    removeChatHistoryItem(chatHistoryItem.id)
  }, [])

  return (
    <View className="flex-1 bg-gray-50">
      <GestureHandlerRootView className="flex-1">
        <FlatList
          contentContainerStyle={{
            marginTop: 10,
            paddingBottom: 20,
          }}
          data={chatHistory}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                router.back()
                router.push(`/chat/${item.id}`)
              }}
              key={item.id}
            >
              <ChatHistoryItem item={item} onRemove={onRemove} />
            </Pressable>
          )}
          ListEmptyComponent={
            refreshing ? null : (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                No history found!
              </Text>
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={getUserChatHistory}
              tintColor="gray"
            />
          }
        />
      </GestureHandlerRootView>
    </View>
  )
}

export default History
