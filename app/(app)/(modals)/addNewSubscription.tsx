import Colors from '@/constants/Colors'
import { useCaptureImage } from '@/hooks/useCaptureImage'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { CheckboxButton } from 'react-native-bouncy-checkbox-group'
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import CheckboxesBottomSheetModal from '@/components/CheckboxesBottomSheetModal'
import { getCycles } from '@/api/apis/getCycles'
import { getCategories } from '@/api/apis/getCategories'
import { useFetchCheckboxItems } from '@/hooks/useFetchCheckboxItems'
import { IconStyle } from '@/constants/IconStyle'
import { createSubscription } from '@/api/apis/createSubscription'
import { useAppDispatch, useAppSelector } from '@/hooks/rtk'
import { createCategory } from '@/api/apis/createCategory'
import { setIsRefreshNeeded } from '@/state/subscriptionSlice'
import { selectCurrentUser } from '@/state/authSlice'
import { SubscriptionForm } from '@/components/SubscriptionForm'

const AddNewSubscription = () => {
  const currentUser = useAppSelector(selectCurrentUser)
  const [categories, setCategories] = useState<CheckboxButton[]>([])
  const [cycles, setCycles] = useState<CheckboxButton[]>([])
  const [image, setImage] = useState<any>('')
  const [subscriptionName, setSubscriptionName] = useState('')
  const [subscriptionPrice, setSubscriptionPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCycle, setSelectedCycle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNewCategory, setIsNewCategory] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    useFetchCheckboxItems(getCycles, setCycles)
    useFetchCheckboxItems(
      () => getCategories({ id: currentUser?.id! }),
      setCategories,
    )
  }, [])

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }
  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }
  const handleConfirmDate = (date: Date) => {
    setStartDate(date.toISOString().split('T')[0])
    hideDatePicker()
  }

  const onCaptureImage = async () => {
    const { result } = await useCaptureImage()

    if (!result.canceled) {
      setImage(`data:image/png;base64,${result.assets[0].base64}`)
    }
  }

  const snapPoints = useMemo(() => ['25%', '50%'], [])
  const cyclesBottomSheetModal = useRef<BottomSheetModal>(null)
  const categoriesBottomSheetModal = useRef<BottomSheetModal>(null)
  const handleCyclesBottomSheetModalPress = useCallback(() => {
    cyclesBottomSheetModal.current?.present()
    setIsModalOpen(true)
  }, [])
  const handleCategoriesBottomSheetModalPress = useCallback(() => {
    categoriesBottomSheetModal.current?.present()
    setIsModalOpen(true)
  }, [])
  const handleCloseBottomSheetModal = () => {
    cyclesBottomSheetModal.current?.close()
    categoriesBottomSheetModal.current?.close()
    setIsModalOpen(false)
  }

  const handleAddNewCategory = async () => {
    if (!newCategoryName) {
      alert('Please fill the field')
      return
    }

    await createCategory({ name: newCategoryName, user_id: currentUser?.id! })

    setCategories((prevCategories) => [
      ...prevCategories,
      {
        id: prevCategories.length + 1,
        text: newCategoryName.toLocaleLowerCase(),
        fillColor: Colors.primary,
        unFillColor: Colors.primaryLight,
        iconStyle: IconStyle(),
        textStyle: { textDecorationLine: 'none' },
      },
    ])
    setNewCategoryName('')
    setIsNewCategory(false)
  }

  const expandHeight = useSharedValue(0)
  const targetHeight = 160
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: expandHeight.value,
      overflow: 'hidden',
    }
  })

  const toggleExpansion = () => {
    if (isNewCategory) {
      expandHeight.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(setIsNewCategory)(false)
      })
    } else {
      setIsNewCategory(true)
      expandHeight.value = withTiming(targetHeight, { duration: 500 })
    }
  }

  const handleAddNewSubscription = async () => {
    if (
      !subscriptionName ||
      !subscriptionPrice ||
      !selectedCategory ||
      !selectedCycle ||
      !startDate ||
      !image
    ) {
      alert('Please fill all fields')
      return
    }

    const selectedCycleId = cycles.find(
      (cycle) => cycle.text === selectedCycle,
    )?.id
    const selectedCategoryId = categories.find(
      (category) => category.text === selectedCategory,
    )?.id

    const response = await createSubscription({
      base64_image: image,
      name: subscriptionName,
      currency: 'PLN',
      currency_value: Number(subscriptionPrice),
      cycle_id: Number(selectedCycleId),
      category_id: Number(selectedCategoryId),
      start_date: startDate,
    })

    if (response) {
      alert('Subscription added successfully')
    } else {
      alert('Failed to add subscription')
    }

    setImage('')
    setSubscriptionName('')
    setSubscriptionPrice('')
    setSelectedCategory('')
    setSelectedCycle('')
    setStartDate('')
    dispatch(setIsRefreshNeeded(true))
  }

  return (
    <View className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={115}
        style={{ flex: 1 }}
      >
        <GestureHandlerRootView className="flex-1">
          <ScrollView className=" py-3 px-4">
            <SubscriptionForm
              handleAddNewSubscription={handleAddNewSubscription}
              handleCategoriesBottomSheetModalPress={
                handleCategoriesBottomSheetModalPress
              }
              handleConfirmDate={handleConfirmDate}
              handleCyclesBottomSheetModalPress={
                handleCyclesBottomSheetModalPress
              }
              hideDatePicker={hideDatePicker}
              image={image}
              isDatePickerVisible={isDatePickerVisible}
              onCaptureImage={onCaptureImage}
              selectedCategory={selectedCategory}
              selectedCycle={selectedCycle}
              setSubscriptionName={setSubscriptionName}
              setSubscriptionPrice={setSubscriptionPrice}
              showDatePicker={showDatePicker}
              startDate={startDate}
              subscriptionName={subscriptionName}
              subscriptionPrice={subscriptionPrice}
            />
          </ScrollView>
          {isModalOpen && (
            <Pressable
              className="flex-1 absolute top-0 left-0 right-0 bottom-0"
              onPress={handleCloseBottomSheetModal}
            />
          )}
          <CheckboxesBottomSheetModal
            ref={cyclesBottomSheetModal}
            title="Select billing cycle"
            snapPoints={snapPoints}
            animatedStyle={animatedStyle}
            toggleExpansion={toggleExpansion}
            data={cycles}
            selectedItem={selectedCycle}
            setSelectedItem={setSelectedCycle}
            setData={setCycles}
          />
          <CheckboxesBottomSheetModal
            ref={categoriesBottomSheetModal}
            title="Select category"
            snapPoints={snapPoints}
            isNewItem={isNewCategory}
            animatedStyle={animatedStyle}
            toggleExpansion={toggleExpansion}
            newItemName={newCategoryName}
            setNewItemName={setNewCategoryName}
            handleAddNewItem={handleAddNewCategory}
            data={categories}
            selectedItem={selectedCategory}
            setSelectedItem={setSelectedCategory}
            setData={setCategories}
          />
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

export default AddNewSubscription
