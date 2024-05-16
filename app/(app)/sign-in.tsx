import { router } from 'expo-router'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'

import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useAppDispatch } from '@/hooks/rtk'
import { useState } from 'react'
import { login } from '@/state/authSlice'

export default function SignIn() {
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = () => {
    if (!email || !password) {
      alert('Please fill all fields')
      return
    }

    dispatch(
      login({
        email,
        password,
      }),
    ).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        router.replace('/')
      }
    })
  }
  return (
    <>
      <StatusBar style="dark" />
      <View className="flex-1 bg-slate-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={115}
          className="flex-1"
        >
          <ScrollView style={{ paddingHorizontal: 20 }} indicatorStyle="black">
            <View className="mt-3">
              <Text className="mb-2 mt-2">Email</Text>
              <TextInput
                placeholder="Email"
                placeholderTextColor={Colors.grey}
                value={email || ''}
                onChangeText={setEmail}
                inputMode="email"
                autoCapitalize="none"
                style={[defaultStyles.inputField]}
              />
            </View>
            <View className="mt-3">
              <Text className="mb-2 mt-2">Password</Text>
              <TextInput
                placeholder="Password"
                placeholderTextColor={Colors.grey}
                value={password || ''}
                onChangeText={setPassword}
                secureTextEntry={true}
                style={[defaultStyles.inputField]}
              />
            </View>
            <Pressable onPress={handleSignIn}>
              <View className="bg-primary rounded-lg py-[15] justify-center items-center mt-8 mb-6">
                <Text className="text-white font-bold">Sign In</Text>
              </View>
            </Pressable>
            <Text
              className="mt-4"
              onPress={() => {
                router.replace('/sign-up')
              }}
            >
              You don't have an account? Sign Up
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  )
}
