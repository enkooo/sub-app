import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useAppSelector } from '@/hooks/rtk'
import { selectCurrentUser } from '@/state/authSlice'
import { editUser } from '@/api/apis/editUser'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useCaptureImage } from '@/hooks/useCaptureImage'

const Profile = () => {
  const currentUser = useAppSelector(selectCurrentUser)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [editName, setEditName] = useState(false)
  const [editNotificationDays, setEditNotificationDays] = useState(false)
  const [image, setImage] = useState('')
  const [notificationDays, setNotificationDays] = useState('')

  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [oldPassword, setOldPassword] = useState('')

  useEffect(() => {
    if (!currentUser) return

    setName(currentUser.name || '')
    setEmail(currentUser.email)
    setImage(currentUser.image?.url || '')
    setNotificationDays(String(currentUser.days_before_notification))
  }, [currentUser])

  const onSaveUser = async () => {
    try {
      if (!name) return

      await editUser(currentUser?.id!, {
        name,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setEditName(false)
    }
  }

  const onSaveNotificationDays = async () => {
    try {
      if (!notificationDays) return

      await editUser(currentUser?.id!, {
        days_before_notification: Number(notificationDays),
      })
    } catch (error) {
      console.error(error)
    } finally {
      setEditNotificationDays(false)
    }
  }

  const onCaptureImage = async () => {
    const { result } = await useCaptureImage()

    if (!result.canceled) {
      setImage(`data:image/png;base64,${result.assets[0].base64}`)

      await editUser(currentUser?.id!, {
        base64_image: `data:image/png;base64,${result.assets[0].base64}`,
      })
    }
  }

  const onChangePassword = async () => {
    try {
      if (!password || !passwordRepeat) {
        alert('Please fill all fields')
        return
      }

      if (password !== passwordRepeat) {
        alert('Passwords do not match')
        return
      }

      const response = await editUser(currentUser?.id!, {
        password,
        password_confirmation: passwordRepeat,
        old_password: oldPassword,
      })

      if (response.data.error) {
        alert(response.data.error)
      }

      if (response.data.success) {
        alert(response.data.updates.password)
        handleClose()
        setPassword('')
        setPasswordRepeat('')
        setOldPassword('')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const snapPoints = useMemo(() => ['25%', '80%'], [])

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const handleClose = () => {
    bottomSheetModalRef.current?.close()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={defaultStyles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={105}
          style={{ flex: 1 }}
        >
          <GestureHandlerRootView className="flex-1 bg-gray-50">
            {currentUser && (
              <View className="items-center gap-5 rounded-2xl p-6">
                <TouchableOpacity onPress={onCaptureImage}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      className="w-28 h-28 justify-center items-center bg-white rounded-full shadow"
                    />
                  ) : (
                    <View className="w-24 h-24 rounded-full items-center justify-center">
                      <FontAwesome
                        name="user-circle-o"
                        size={90}
                        color="black"
                      />
                    </View>
                  )}
                </TouchableOpacity>
                <View className="flex-row gap-1">
                  {editName ? (
                    <View className="h-10 flex-1 flex-row items-center justify-center gap-2">
                      <TextInput
                        placeholder="First name"
                        value={name || ''}
                        onChangeText={setName}
                        style={[defaultStyles.inputField, { width: 200 }]}
                      />

                      <TouchableOpacity onPress={() => onSaveUser()}>
                        <Ionicons
                          name="checkmark-outline"
                          size={24}
                          color={Colors.dark}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="h-10 flex-1 flex-row items-center justify-center gap-2">
                      <Text className="font-bold text-2xl">{name}</Text>
                      <TouchableOpacity onPress={() => setEditName(true)}>
                        <Ionicons
                          name="create-outline"
                          size={24}
                          color={Colors.dark}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View className="flex-row gap-1">
                  {editNotificationDays ? (
                    <View className="h-10 flex-1 flex-row items-center justify-center gap-2">
                      <TextInput
                        placeholder="First name"
                        keyboardType="numeric"
                        value={notificationDays || ''}
                        onChangeText={setNotificationDays}
                        style={[defaultStyles.inputField, { width: 200 }]}
                      />

                      <TouchableOpacity
                        onPress={() => onSaveNotificationDays()}
                      >
                        <Ionicons
                          name="checkmark-outline"
                          size={24}
                          color={Colors.dark}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="h-10 flex-1 flex-row items-center justify-center gap-2">
                      <View>
                        <Text>Numbers of days before subscription</Text>
                        <Text>to sending notification: {notificationDays}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setEditNotificationDays(true)}
                      >
                        <Ionicons
                          name="create-outline"
                          size={24}
                          color={Colors.dark}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <Text>{email}</Text>
                <Pressable onPress={handlePresentModalPress}>
                  <Text>Change password</Text>
                </Pressable>
              </View>
            )}
            <BottomSheetModalProvider>
              <View style={styles.container}>
                <BottomSheetModal
                  ref={bottomSheetModalRef}
                  index={1}
                  snapPoints={snapPoints}
                >
                  <BottomSheetView style={styles.contentContainer}>
                    <View className="mt-3 w-full px-4">
                      <Text className="mb-2 mt-2">Old password</Text>
                      <TextInput
                        placeholder="Old password"
                        placeholderTextColor={Colors.grey}
                        value={oldPassword || ''}
                        onChangeText={setOldPassword}
                        inputMode="text"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        style={[defaultStyles.inputField]}
                      />
                    </View>
                    <View className="mt-3 w-full px-4">
                      <Text className="mb-2 mt-2">Password</Text>
                      <TextInput
                        placeholder="Password"
                        placeholderTextColor={Colors.grey}
                        value={password || ''}
                        onChangeText={setPassword}
                        inputMode="text"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        style={[defaultStyles.inputField]}
                      />
                    </View>
                    <View className="mt-3 w-full px-4">
                      <Text className="mb-2 mt-2">Password repeat</Text>
                      <TextInput
                        placeholder="Password repeat"
                        placeholderTextColor={Colors.grey}
                        value={passwordRepeat || ''}
                        onChangeText={setPasswordRepeat}
                        inputMode="text"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        style={[defaultStyles.inputField]}
                      />
                    </View>
                    <View className="w-full px-4">
                      <Pressable onPress={onChangePassword}>
                        <View className="bg-primary rounded-lg py-[15] justify-center items-center mt-8 mb-6">
                          <Text className="text-white font-bold">
                            Change password
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  </BottomSheetView>
                </BottomSheetModal>
              </View>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
})

export default Profile
