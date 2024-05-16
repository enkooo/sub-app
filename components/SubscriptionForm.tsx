import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import {
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

type SubscriptionFormProps = {
  onCaptureImage: () => void
  image: string
  subscriptionName: string
  setSubscriptionName: (name: string) => void
  subscriptionPrice: string
  setSubscriptionPrice: (price: string) => void
  selectedCycle: string
  handleCyclesBottomSheetModalPress: () => void
  selectedCategory: string
  handleCategoriesBottomSheetModalPress: () => void
  showDatePicker: () => void
  startDate: string
  isDatePickerVisible: boolean
  handleConfirmDate: (date: Date) => void
  hideDatePicker: () => void
  handleAddNewSubscription?: () => void
  handleEditSubscription?: () => void
}

export default function SubscriptionForm({
  onCaptureImage,
  image,
  subscriptionName,
  setSubscriptionName,
  subscriptionPrice,
  setSubscriptionPrice,
  selectedCycle,
  handleCyclesBottomSheetModalPress,
  selectedCategory,
  handleCategoriesBottomSheetModalPress,
  showDatePicker,
  startDate,
  isDatePickerVisible,
  handleConfirmDate,
  hideDatePicker,
  handleAddNewSubscription,
  handleEditSubscription,
}: SubscriptionFormProps) {
  return (
    <>
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
        {handleAddNewSubscription ? (
          <Pressable onPress={handleAddNewSubscription}>
            <View className="bg-primary rounded-lg py-3 justify-center items-center mt-3 mb-6">
              <Text className="text-white font-bold">Add subscription</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={handleEditSubscription}>
            <View className="bg-primary rounded-lg py-3 justify-center items-center mt-3 mb-6">
              <Text className="text-white font-bold">Edit subscription</Text>
            </View>
          </Pressable>
        )}
      </View>
    </>
  )
}
