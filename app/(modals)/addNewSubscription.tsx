import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useCaptureImage } from '@/hooks/useCaptureImage'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import subCategories from '@/assets/subCategories.json'
import subCycles from '@/assets/subCycles.json'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
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

const _iconStyle = () => ({
  height: 33,
  width: 33,
})

const AddNewSubscription = () => {
  const [categories, setCategories] = useState<CheckboxButton[]>(
    subCategories.map((category) => ({
      id: category.id,
      text: category.value,
      fillColor: '#3856ff',
      unFillColor: '#8fa0ff',
      iconStyle: _iconStyle(),
      textStyle: { textDecorationLine: 'none' },
    })),
  )
  const [cycles, setCycles] = useState<CheckboxButton[]>(
    subCycles.map((cycle) => ({
      id: cycle.id,
      text: cycle.value,
      fillColor: '#3856ff',
      unFillColor: '#8fa0ff',
      iconStyle: _iconStyle(),
      textStyle: { textDecorationLine: 'none' },
    })),
  )
  const [image, setImage] = useState('')
  const [subscriptionName, setSubscriptionName] = useState('')
  const [subscriptionPrice, setSubscriptionPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCycle, setSelectedCycle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNewCategory, setIsNewCategory] = useState(false)

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

  const handleAddNewCategory = () => {
    setCategories((prevCategories) => [
      ...prevCategories,
      {
        id: prevCategories.length + 1,
        text: newCategoryName.toLocaleLowerCase(),
        fillColor: '#3856ff',
        unFillColor: '#8fa0ff',
        iconStyle: _iconStyle(),
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

  return (
    <View className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={115}
        style={{ flex: 1 }}
      >
        <GestureHandlerRootView className="flex-1">
          <ScrollView className=" py-3 px-4">
            <View className="flex-row justify-center" style={{ gap: 10 }}>
              <TouchableOpacity onPress={onCaptureImage}>
                <View className="w-28 h-28 justify-center items-center bg-white rounded-lg shadow">
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      className="w-28 h-28 justify-center items-center bg-white rounded-lg shadow"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="image-plus"
                      size={64}
                      color="black"
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View className="mt-8" style={{ gap: 10 }}>
              <Text>Subscription name</Text>
              <TextInput
                placeholder="Subscription name"
                placeholderTextColor={Colors.grey}
                value={subscriptionName || ''}
                onChangeText={setSubscriptionName}
                style={[defaultStyles.inputField]}
              />
              <Text className="mt-3">Subscription price</Text>
              <TextInput
                placeholder="Subscription price"
                keyboardType="numeric"
                placeholderTextColor={Colors.grey}
                value={subscriptionPrice || ''}
                onChangeText={setSubscriptionPrice}
                style={[defaultStyles.inputField]}
              />
              <Text className="mt-3">Billing cycle</Text>
              <TextInput
                placeholder="Select cycle"
                placeholderTextColor={Colors.grey}
                value={selectedCycle || ''}
                style={[defaultStyles.inputField]}
                editable={false}
                onPressIn={handleCyclesBottomSheetModalPress}
              />
              <Text className="mt-3">Category</Text>
              <TextInput
                placeholder="Select category"
                placeholderTextColor={Colors.grey}
                value={selectedCategory || ''}
                style={[defaultStyles.inputField]}
                editable={false}
                onPressIn={handleCategoriesBottomSheetModalPress}
              />
              <Text className="mt-3">Start date</Text>
              <Pressable onPress={showDatePicker}>
                <TextInput
                  placeholder="Start date"
                  placeholderTextColor={Colors.grey}
                  value={startDate || ''}
                  editable={false}
                  style={[defaultStyles.inputField]}
                  onPressIn={showDatePicker}
                />
              </Pressable>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
                isDarkModeEnabled={false}
                textColor="black"
              />
              <Pressable>
                <View className="bg-primary rounded-lg py-3 justify-center items-center mt-3 mb-6">
                  <Text className="text-white font-bold">Add subscription</Text>
                </View>
              </Pressable>
            </View>
          </ScrollView>
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
            isModalOpen={isModalOpen}
            handleCloseBottomSheetModal={handleCloseBottomSheetModal}
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
            isModalOpen={isModalOpen}
            handleCloseBottomSheetModal={handleCloseBottomSheetModal}
          />
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

export default AddNewSubscription
