import React, { useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser'
import { defaultStyles } from '@/constants/Styles'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useOAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import Colors from '@/constants/Colors'

enum Strategy {
  Apple = 'oauth_apple',
  Google = 'oauth_google',
  Facebook = 'oauth_facebook',
}

const Page = () => {
  useWarmUpBrowser()
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      const { createdSessionId, setActive } = await selectedAuth()

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-white p-6">
      {loading && (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      {!loading && (
        <>
          <View style={{ gap: 20 }}>
            <TouchableOpacity className="bg-white border border-gray-300 rounded-lg h-12 items-center flex-row px-2 justify-center">
              <MaterialCommunityIcons
                name="email-outline"
                size={24}
                style={defaultStyles.btnIcon}
              />
              <Text className="text-black font-semibold">
                Continue with Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white border border-gray-300 rounded-lg h-12 items-center flex-row px-2 justify-center"
              onPress={() => onSelectAuth(Strategy.Apple)}
            >
              <Ionicons
                name="logo-apple"
                size={24}
                style={defaultStyles.btnIcon}
              />
              <Text className="text-black font-semibold">
                Continue with Apple
              </Text>
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
              <Text className="text-black font-semibold">
                Continue with Google
              </Text>
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
        </>
      )}
    </View>
  )
}

export default Page
