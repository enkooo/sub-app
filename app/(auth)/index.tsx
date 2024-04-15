import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  GestureHandlerRootView,
  FlatList,
  RefreshControl,
} from 'react-native-gesture-handler'
import userSubscription from '@/assets/userSubscription.json'
import { Subscription } from '@/types/Subscription'
import SubscriptionItem from '@/components/SubscriptionItem'
import Colors from '@/constants/Colors'

const Page = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>()

  const loadData = () => {
    setRefreshing(true)

    setTimeout(() => {
      setRefreshing(false)
      setSubscriptions(userSubscription.items)
    }, 1000)
  }

  useEffect(() => {
    loadData()
  }, [])

  const onRemove = useCallback((subscriptionItem: Subscription) => {
    setSubscriptions((items) =>
      items?.filter((item) => item.id !== subscriptionItem.id),
    )
  }, [])

  return (
    <View className="flex-1 bg-gray-50">
      <GestureHandlerRootView className="flex-1">
        <FlatList
          contentContainerStyle={{ marginTop: 10 }}
          data={subscriptions}
          renderItem={({ item }) => (
            <SubscriptionItem key={item.id} item={item} onRemove={onRemove} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadData}
              tintColor={Colors.grey}
            />
          }
        />
      </GestureHandlerRootView>
    </View>
  )
}

export default Page
