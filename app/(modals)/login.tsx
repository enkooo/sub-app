import React from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser'
import { defaultStyles } from '@/constants/Styles'
import { Ionicons } from '@expo/vector-icons'
import { useOAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

enum Strategy {
  Apple = 'oauth_apple',
  Google = 'oauth_google',
  Facebook = 'oauth_facebook',
}

const Page = () => {
  useWarmUpBrowser()

  const router = useRouter()
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: Strategy.Apple })
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: Strategy.Google })
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: Strategy.Facebook,
  })

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Apple]: appleAuth,
      [Strategy.Google]: googleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy]

    try {
      const { createdSessionId, setActive } = await selectedAuth()

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
        router.back()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View className="flex-1 bg-white p-6">
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        placeholderTextColor="#ABABAB"
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
      />
      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue</Text>
      </TouchableOpacity>

      <View className="flex-row gap-2 items-center py-7">
        <View
          style={{
            flex: 1,
            borderBottomColor: '#000',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text className="text-gray-600">or</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: '#000',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>

      <View style={{ gap: 20 }}>
        <TouchableOpacity
          className="bg-white border border-gray-300 rounded-lg h-12 items-center flex-row px-2 justify-center"
          onPress={() => onSelectAuth(Strategy.Apple)}
        >
          <Ionicons name="logo-apple" size={24} style={defaultStyles.btnIcon} />
          <Text className="text-black font-semibold">Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white border border-gray-300 rounded-lg h-12 items-center flex-row px-2 justify-center"
          onPress={() => onSelectAuth(Strategy.Google)}
        >
          <Ionicons
            name="logo-google"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text className="text-black font-semibold">Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white border border-gray-300 rounded-lg h-12 items-center flex-row px-2 justify-center"
          onPress={() => onSelectAuth(Strategy.Facebook)}
        >
          <Ionicons
            name="logo-facebook"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text className="text-black font-semibold">
            Continue with Facebook
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Page
