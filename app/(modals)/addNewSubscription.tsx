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
  StyleSheet,
} from 'react-native'
import subCategories from '@/assets/subCategories.json'
import subCycles from '@/assets/subCycles.json'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BouncyCheckboxGroup, {
  CheckboxButton,
} from 'react-native-bouncy-checkbox-group'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'

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
          {isModalOpen && (
            <Pressable
              className="flex-1 absolute top-0 left-0 right-0 bottom-0"
              onPress={handleCloseBottomSheetModal}
            />
          )}
          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={cyclesBottomSheetModal}
              index={1}
              snapPoints={snapPoints}
              backgroundStyle={{
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
                <View className="flex-row justify-between "></View>
                <Text className="my-3 text-xl font-bold">
                  Select billing cycle
                </Text>
                <ScrollView className="mb-10">
                  <BouncyCheckboxGroup
                    data={cycles}
                    style={{ flexDirection: 'column', gap: 10 }}
                    initial={
                      cycles.findIndex((item) => item.text === selectedCycle) +
                      1
                    }
                    onChange={(selectedItem: CheckboxButton) => {
                      setSelectedCycle(selectedItem.text as string)
                      setCycles((prevCycles) =>
                        prevCycles.map((item) => ({
                          ...item,
                          disabled: item.text === selectedItem.text,
                        })),
                      )
                    }}
                  />
                </ScrollView>
              </BottomSheetView>
            </BottomSheetModal>
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
                {isNewCategory && (
                  <Animated.View style={animatedStyle}>
                    <View className="flex-row justify-between items-center mb-3 mt-4">
                      <Text className="text-xl font-bold">
                        Add new category
                      </Text>
                      <Pressable onPress={toggleExpansion}>
                        <Ionicons
                          name="close-circle-outline"
                          size={24}
                          color="black"
                        />
                      </Pressable>
                    </View>
                    <TextInput
                      placeholder="Add new category"
                      placeholderTextColor={Colors.grey}
                      value={newCategoryName || ''}
                      onChangeText={setNewCategoryName}
                      autoCapitalize="none"
                      style={[defaultStyles.inputField]}
                    />
                    <Pressable onPress={handleAddNewCategory}>
                      <View className="bg-primary rounded-lg py-3 justify-center items-center mt-3 mb-6">
                        <Text className="text-white font-bold">
                          Add new category
                        </Text>
                      </View>
                    </Pressable>
                  </Animated.View>
                )}
                <View className="flex-row justify-between items-center">
                  <Text className="my-3 text-xl font-bold">
                    Select category
                  </Text>
                  {!isNewCategory && (
                    <Pressable onPress={toggleExpansion}>
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color="black"
                      />
                    </Pressable>
                  )}
                </View>
                <ScrollView className="mb-10">
                  <BouncyCheckboxGroup
                    data={categories}
                    style={{ flexDirection: 'column', gap: 10 }}
                    initial={
                      categories.findIndex(
                        (item) => item.text === selectedCategory,
                      ) + 1
                    }
                    onChange={(selectedItem: CheckboxButton) => {
                      setSelectedCategory(selectedItem.text as string)
                      setCategories((prevCategories) =>
                        prevCategories.map((item) => ({
                          ...item,
                          disabled: item.text === selectedItem.text,
                        })),
                      )
                    }}
                  />
                </ScrollView>
              </BottomSheetView>
            </BottomSheetModal>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

const styles = StyleSheet.create({
  boxStyles: {
    backgroundColor: 'white',
    borderColor: '#ABABAB',
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dropdownStyles: {
    backgroundColor: 'white',
    borderColor: '#ABABAB',
    borderWidth: 1,
    borderRadius: 8,
  },
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

export default AddNewSubscription
