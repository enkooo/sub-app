import React, { useCallback, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import {
  GestureHandlerRootView,
  FlatList,
  RefreshControl,
} from 'react-native-gesture-handler'
import userSubscription from '@/assets/userSubscription.json'
import { Subscription } from '@/types/Subscription'
import SubscriptionItem from '@/components/SubscriptionItem'
import Colors from '@/constants/Colors'
import {
  MultipleSelectList,
  SelectList,
} from 'react-native-dropdown-select-list'

const Page = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>()
  const [filteredSubscriptions, setFilteredSubscriptions] =
    useState(subscriptions)

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

  const categories = userSubscription.items.map((item) => ({
    key: item.id,
    value: item.category,
  }))
  const seenCategories = new Set()
  const uniqueCategories = categories.filter((item) => {
    if (!seenCategories.has(item.value)) {
      seenCategories.add(item.value)
      return true
    }
    return false
  })

  const [selectedCategories, setSelectedCategories] = useState(
    uniqueCategories.map((item) => item.value),
  )

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredSubscriptions(subscriptions)
    } else {
      setFilteredSubscriptions(
        subscriptions?.filter((subscription) =>
          selectedCategories.includes(subscription.category),
        ),
      )
    }
  }, [selectedCategories, subscriptions])

  return (
    <View className="flex-1 bg-gray-50">
      <View className="w-[90%] mx-auto shadow rounded-lg mt-4">
        <MultipleSelectList
          setSelected={setSelectedCategories}
          data={uniqueCategories}
          save="value"
          label="Categories"
          placeholder="Filters"
          boxStyles={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 10,
            borderColor: 'white',
          }}
          dropdownStyles={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 10,
            borderColor: 'white',
          }}
          badgeStyles={{
            backgroundColor: Colors.primary,
          }}
        />
      </View>
      <GestureHandlerRootView className="flex-1">
        <FlatList
          data={filteredSubscriptions}
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
