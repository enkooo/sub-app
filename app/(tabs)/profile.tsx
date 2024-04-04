import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'

const Profile = () => {
  const { signOut, isSignedIn } = useAuth()
  const { user } = useUser()
  const [firstName, setFirstName] = useState(user?.firstName)
  const [lastName, setLastName] = useState(user?.lastName)
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress)
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    if (!user) return

    setFirstName(user.firstName)
    setLastName(user.lastName)
    setEmail(user.emailAddresses[0].emailAddress)
  }, [user])

  const onSaveUser = async () => {
    try {
      if (!firstName || !lastName) return

      await user?.update({
        firstName,
        lastName,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setEdit(false)
    }
  }

  const onCaptureImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    })

    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`
      user?.setProfileImage({
        file: base64,
      })
    }
  }

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View className="flex-row items-center justify-between p-6">
        <Text className="text-2xl font-bold">Profile</Text>
        <Ionicons name="notifications-outline" size={26} />
      </View>

      {user && (
        <View className="items-center gap-5 m-6 rounded-2xl bg-white p-6 shadow-lg">
          <TouchableOpacity onPress={onCaptureImage}>
            <Image
              source={{ uri: user?.imageUrl }}
              className="w-24 h-24 rounded-full bg-gray-600"
            />
          </TouchableOpacity>
          <View className="flex-row gap-1">
            {edit ? (
              <View className="h-10 flex-1 flex-row items-center justify-center gap-2">
                <TextInput
                  placeholder="First name"
                  value={firstName || ''}
                  onChangeText={setFirstName}
                  style={[defaultStyles.inputField, { width: 100 }]}
                />
                <TextInput
                  placeholder="Last name"
                  value={lastName || ''}
                  onChangeText={setLastName}
                  style={[defaultStyles.inputField, { width: 100 }]}
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
                <Text className="font-bold text-2xl">
                  {firstName} {lastName}
                </Text>
                <TouchableOpacity onPress={() => setEdit(true)}>
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
          <Text>Since {user?.createdAt?.toLocaleDateString()}</Text>
        </View>
      )}

      {isSignedIn && (
        <Button title="Log out" onPress={() => signOut()} color={Colors.dark} />
      )}

      {!isSignedIn && (
        <Link href="/(modals)/login" asChild>
          <Button title="Log In" color={Colors.dark} />
        </Link>
      )}
    </SafeAreaView>
  )
}

export default Profile
