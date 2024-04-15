import React, { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler'
import userSubscription from '@/assets/userSubscription.json'
import { Subscription } from '@/types/Subscription'
import SubscriptionItem from '@/components/SubscriptionItem'

const Page = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    userSubscription.items,
  )

  const onRemove = useCallback((subscriptionItem: Subscription) => {
    setSubscriptions((items) =>
      items.filter((item) => item.id !== subscriptionItem.id),
    )
  }, [])

  const scrollRef = useRef(null)

  return (
    <View className="flex-1 bg-gray-50">
      <GestureHandlerRootView className="flex-1 mt-2">
        <ScrollView ref={scrollRef}>
          {subscriptions.map((item) => (
            <SubscriptionItem
              key={item.id}
              simultaneousHandlers={scrollRef}
              item={item}
              onRemove={onRemove}
            />
          ))}
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  )
}

export default Page
