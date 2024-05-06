import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Pressable, StyleSheet, Text, View } from 'react-native'
import {
  GestureHandlerRootView,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native-gesture-handler'
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
import { Category } from '@/types/Category'
import { getUserSubscriptions } from '@/api/apis/getUserSubscriptions'
import SegmentedControl from '@/libraries/SegmentedControl/SegmentedControl'
import { deleteSubscription } from '@/api/apis/deleteSubscription'
import {
  selectIsRefreshNeeded,
  setIsRefreshNeeded,
} from '@/state/subscriptionSlice'
import { useRouter } from 'expo-router'
import { useSchedulePushNotification } from '@/hooks/useSchedulePushNotification'
import * as SecureStore from 'expo-secure-store'

const SEGMENT_CYCLE = [
  { id: 0, name: 'All' },
  { id: 1, name: 'Daily' },
  { id: 2, name: 'Weekly' },
  { id: 3, name: 'Monthly' },
  { id: 4, name: 'Yearly' },
]

async function saveDateForName(name: string, notificationDate: string) {
  try {
    await SecureStore.setItemAsync(
      name.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, ''),
      notificationDate,
    )
  } catch (error) {
    console.error('Error saving notificationDate:', error)
  }
}

async function getDateForName(name: string) {
  try {
    const notificationDate = await SecureStore.getItemAsync(
      name.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, ''),
    )
    return notificationDate
  } catch (error) {
    console.error('Error getting id:', error)
    return null
  }
}

const Page = () => {
  async function schedulePushNotification(subscriptions: Subscription[]) {
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate())

    for (const subscription of subscriptions) {
      const subscriptionDate = new Date(subscription.next_payment)
      subscriptionDate.setDate(subscriptionDate.getDate() - 2)

      if (subscriptionDate > currentDate) {
        const notificationDate = await getDateForName(subscription.name)
        if (notificationDate === subscriptionDate.toDateString()) {
          continue
        }

        await useSchedulePushNotification(subscriptionDate, subscription.name)

        await saveDateForName(
          subscription.name,
          subscriptionDate.toDateString(),
        )
      }
    }
  }

  const router = useRouter()
  const dispatch = useAppDispatch()
  const isFiltersCategoryModalOpen = useAppSelector(
    selectIsFiltersCategoryModalOpen,
  )
  const isRefreshNeeded = useAppSelector(selectIsRefreshNeeded)
  const [refreshing, setRefreshing] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>()
  const [filteredSubscriptions, setFilteredSubscriptions] =
    useState(subscriptions)
  const [selectedCategories, setSelectedCategories] = useState<Category[]>()
  const [tabIndex, setTabIndex] = useState(0)

  const fetchSubscriptions = async () => {
    try {
      setRefreshing(true)

      const response = await getUserSubscriptions()

      setSubscriptions(response)
      schedulePushNotification(response)
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
    } finally {
      setRefreshing(false)
      dispatch(setIsRefreshNeeded(false))
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [isRefreshNeeded])

  useEffect(() => {
    const categories = subscriptions?.map((item) => ({
      key: item.id,
      value: item.category.name,
      isChecked: true,
    }))

    const seenCategories = new Set()
    const uniqueCategories = categories?.filter((item) => {
      if (!seenCategories.has(item.value)) {
        seenCategories.add(item.value)
        return true
      }
      return false
    })

    setSelectedCategories(uniqueCategories)
  }, [subscriptions])

  const onRemove = useCallback(async (subscriptionItem: Subscription) => {
    const response = await deleteSubscription({
      id: Number(subscriptionItem.id),
    })

    if (response.status !== 204) {
      console.error('Failed to delete subscription:', response)
      return
    }

    setSubscriptions((items) =>
      items?.filter((item) => item.id !== subscriptionItem.id),
    )
  }, [])

  const onEdit = useCallback(async (subscriptionItem: Subscription) => {
    router.push(`/editSubscription/${subscriptionItem.id}`)
  }, [])

  useEffect(() => {
    const activeCategories = selectedCategories
      ?.filter((c) => c.isChecked)
      ?.map((c) => c.value)

    const cycleFilter =
      tabIndex > 0 ? SEGMENT_CYCLE[tabIndex].name.toLocaleLowerCase() : null

    const filteredSubscriptions = subscriptions?.filter((subscription) => {
      const categoryMatch = activeCategories?.includes(
        subscription.category.name,
      )

      const cycleMatch =
        tabIndex === 0 ||
        subscription.cycle?.name?.toLocaleLowerCase() === cycleFilter

      return categoryMatch && cycleMatch
    })

    setFilteredSubscriptions(filteredSubscriptions)
  }, [selectedCategories, subscriptions, tabIndex])

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
      <View style={{ marginHorizontal: 18 }}>
        <SegmentedControl
          containerMargin={18}
          segments={SEGMENT_CYCLE.map((item) => item.name)}
          onChange={(index) => setTabIndex(index)}
          currentIndex={tabIndex}
          segmentedControlWrapper={{
            backgroundColor: 'rgba(229 231 235 / 0.5)',
            marginTop: 16,
          }}
          inactiveTextStyle={{ color: 'black' }}
        />
      </View>

      <GestureHandlerRootView className="flex-1 mt-2">
        <FlatList
          data={filteredSubscriptions}
          renderItem={({ item }) => (
            <Pressable onLongPress={() => onEdit(item)}>
              <SubscriptionItem
                key={item.id}
                item={item}
                onRemove={onRemove}
                onEdit={onEdit}
              />
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No subscriptions found
            </Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchSubscriptions}
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
              <ScrollView className="gap-2 mb-2">
                {selectedCategories?.map((category) => (
                  <BouncyCheckbox
                    key={category.key}
                    size={32}
                    fillColor={Colors.primary}
                    unFillColor={Colors.primaryLight}
                    text={category.value}
                    textStyle={{
                      textDecorationLine: 'none',
                      textTransform: 'capitalize',
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
