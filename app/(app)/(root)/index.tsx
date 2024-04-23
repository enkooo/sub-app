import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import {
  GestureHandlerRootView,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native-gesture-handler'
import userSubscription from '@/assets/userSubscription.json'
import { Subscription } from '@/types/Subscription'
import SubscriptionItem from '@/components/SubscriptionItem'
import Colors from '@/constants/Colors'
import { useAppDispatch, useAppSelector } from '@/hooks/rtk'
import {
  selectIsFiltersCategoryModalOpen,
  toggleFiltersModal,
} from '@/state/categoryFiltersSlice'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

const Page = () => {
  const dispatch = useAppDispatch()
  const isFiltersCategoryModalOpen = useAppSelector(
    selectIsFiltersCategoryModalOpen,
  )
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
    isChecked: true,
  }))
  const seenCategories = new Set()
  const uniqueCategories = categories.filter((item) => {
    if (!seenCategories.has(item.value)) {
      seenCategories.add(item.value)
      return true
    }
    return false
  })

  const [selectedCategories, setSelectedCategories] = useState(uniqueCategories)

  useEffect(() => {
    const activeCategories = selectedCategories
      .filter((c) => c.isChecked)
      .map((c) => c.value)
    const filteredSubscriptions = subscriptions?.filter((subscription) =>
      activeCategories.includes(subscription.category),
    )

    setFilteredSubscriptions(filteredSubscriptions)
  }, [selectedCategories, subscriptions])

  const snapPoints = useMemo(() => ['25%', '50%'], [])
  const categoriesBottomSheetModal = useRef<BottomSheetModal>(null)

  const handleCloseBottomSheetModal = () => {
    categoriesBottomSheetModal.current?.close()
    dispatch(toggleFiltersModal())
  }

  useEffect(() => {
    if (isFiltersCategoryModalOpen) {
      categoriesBottomSheetModal.current?.present()
    }
  }, [isFiltersCategoryModalOpen])

  return (
    <View className="flex-1 bg-gray-50">
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
        {isFiltersCategoryModalOpen && (
          <Pressable
            className="flex-1 absolute top-0 left-0 right-0 bottom-0"
            onPress={handleCloseBottomSheetModal}
          />
        )}
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={categoriesBottomSheetModal}
            index={1}
            snapPoints={snapPoints}
            backgroundStyle={{
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.23,
              elevation: 4,
            }}
          >
            <BottomSheetView style={styles.contentContainer}>
              <Text className="my-3 text-xl font-bold">
                Select category filters
              </Text>
              <ScrollView className="gap-2">
                {selectedCategories.map((category) => (
                  <BouncyCheckbox
                    key={category.key}
                    size={32}
                    fillColor={Colors.primary}
                    unFillColor={Colors.primaryLight}
                    text={category.value}
                    textStyle={{
                      textDecorationLine: 'none',
                    }}
                    innerIconStyle={{
                      borderWidth: 0,
                    }}
                    iconStyle={{ borderRadius: 12 }}
                    isChecked={category.isChecked}
                    onPress={(isChecked: boolean) => {
                      setSelectedCategories((prevData) =>
                        prevData?.map((item) => {
                          if (item.key === category.key) {
                            return {
                              ...item,
                              isChecked,
                            }
                          }
                          return item
                        }),
                      )
                    }}
                  />
                ))}
              </ScrollView>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
})

export default Page
