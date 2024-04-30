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
import { defaultStyles } from '@/constants/Styles'
import { useState } from 'react'
import Colors from '@/constants/Colors'
import { register } from '@/state/authSlice'
import { useAppDispatch } from '@/hooks/rtk'

export default function SignIn() {
  const dispatch = useAppDispatch()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')

  const handleSignUp = () => {
    if (!email || !username || !password || !passwordRepeat) {
      alert('Please fill all fields')
      return
    }

    if (password !== passwordRepeat) {
      alert('Passwords do not match')
      return
    }

    console.log('username', username)
    console.log('email', email)
    console.log('password', password)

    dispatch(
      register({
        email,
        name: username,
        password,
      }),
    ).then((action) => {
      router.replace('/')
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
              <Text className="mb-2 mt-2">Username</Text>
              <TextInput
                placeholder="Username"
                placeholderTextColor={Colors.grey}
                value={username || ''}
                onChangeText={setUsername}
                inputMode="text"
                autoCapitalize="none"
                style={[defaultStyles.inputField]}
              />
            </View>
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
            <View className="mt-3">
              <Text className="mb-2 mt-2">Password repeat</Text>
              <TextInput
                placeholder="Password repeat"
                placeholderTextColor={Colors.grey}
                value={passwordRepeat || ''}
                onChangeText={setPasswordRepeat}
                secureTextEntry={true}
                style={[defaultStyles.inputField]}
              />
            </View>

            <Pressable onPress={handleSignUp}>
              <View className="bg-primary rounded-lg py-[15] justify-center items-center mt-8 mb-6">
                <Text className="text-white font-bold">Sign Up</Text>
              </View>
            </Pressable>
            <Text
              className="mt-4"
              onPress={() => {
                router.replace('/sign-in')
              }}
            >
              Already have an account? Sign In
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  )
}
