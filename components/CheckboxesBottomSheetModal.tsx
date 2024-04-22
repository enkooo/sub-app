import React, { forwardRef } from 'react'
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import BouncyCheckboxGroup, {
  CheckboxButton,
} from 'react-native-bouncy-checkbox-group'
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import Animated from 'react-native-reanimated'

type CheckboxesBottomSheetModalProps = {
  title: string
  snapPoints: Array<string | number>
  isNewItem?: boolean
  animatedStyle: any
  toggleExpansion?: () => void
  newItemName?: string
  setNewItemName?: (name: string) => void
  handleAddNewItem?: () => void
  data: CheckboxButton[]
  selectedItem: string
  setSelectedItem: (item: string) => void
  setData: (func: (prevData: CheckboxButton[]) => CheckboxButton[]) => void
}

const CheckboxesBottomSheetModal = forwardRef<
  BottomSheetModal,
  CheckboxesBottomSheetModalProps
>(
  (
    {
      title,
      snapPoints,
      isNewItem,
      animatedStyle,
      toggleExpansion,
      newItemName,
      setNewItemName,
      handleAddNewItem,
      data,
      selectedItem,
      setSelectedItem,
      setData,
    },
    ref,
  ) => (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={ref}
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
          {isNewItem && (
            <Animated.View style={animatedStyle}>
              <View className="flex-row justify-between items-center mb-3 mt-4">
                <Text className="text-xl font-bold">Add new category</Text>
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
                value={newItemName}
                onChangeText={setNewItemName}
                autoCapitalize="none"
                style={[defaultStyles.inputField]}
              />
              <Pressable onPress={handleAddNewItem}>
                <View className="bg-primary rounded-lg py-3 justify-center items-center mt-3 mb-6">
                  <Text className="text-white font-bold">Add new category</Text>
                </View>
              </Pressable>
            </Animated.View>
          )}
          <View className="flex-row justify-between items-center">
            <Text className="my-3 text-xl font-bold">{title}</Text>
            {!isNewItem && typeof isNewItem !== 'undefined' && (
              <Pressable onPress={toggleExpansion}>
                <Ionicons name="add-circle-outline" size={24} color="black" />
              </Pressable>
            )}
          </View>
          <ScrollView className="mb-10">
            <BouncyCheckboxGroup
              data={data}
              style={{ flexDirection: 'column', gap: 10 }}
              initial={data.findIndex((item) => item.text === selectedItem) + 1}
              onChange={(selectedItem: CheckboxButton) => {
                setSelectedItem(selectedItem.text as string)
                setData((prevData) =>
                  prevData.map((item) => ({
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
  ),
)

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

export default CheckboxesBottomSheetModal
