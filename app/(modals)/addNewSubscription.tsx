import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useCaptureImage } from '@/hooks/useCaptureImage'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
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
import { SelectList } from 'react-native-dropdown-select-list'

const AddNewSubscription = () => {
  const [categories, setCategories] = useState(subCategories)
  const [cycles, setCycles] = useState(subCycles)
  const [image, setImage] = useState('')
  const [subscriptionName, setSubscriptionName] = useState('')
  const [subscriptionPrice, setSubscriptionPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState()
  const [selectedCycle, setSelectedCycle] = useState()
  const [startDate, setStartDate] = useState('')
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

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

  return (
    <View className="flex-1 bg-gray-50 py-3 px-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={115}
        style={{ flex: 1 }}
      >
        <ScrollView>
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
            <SelectList
              setSelected={setSelectedCycle}
              search={false}
              data={cycles}
              save="value"
              boxStyles={styles.boxStyles}
              dropdownStyles={styles.dropdownStyles}
            />
            <Text className="mt-3">Category</Text>
            <SelectList
              setSelected={setSelectedCategory}
              search={false}
              data={categories}
              save="value"
              boxStyles={styles.boxStyles}
              dropdownStyles={styles.dropdownStyles}
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
})

export default AddNewSubscription
