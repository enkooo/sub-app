import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { useSegments } from 'expo-router'
import { Slot } from 'expo-router'
// import 'react-native-gesture-handler'

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    mon: require('../assets/fonts/Montserrat-Regular.ttf'),
    'mon-sb': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'mon-b': require('../assets/fonts/Montserrat-Bold.ttf'),
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
    </ClerkProvider>
  )
}

function RootLayoutNav() {
  const router = useRouter()
  const segments = useSegments()
  const { isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    if (!isLoaded) return

    const inAuthGroup = segments[0] === '(auth)'

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(auth)')
    } else if (!isSignedIn) {
      router.replace('/login')
    }
  }, [isSignedIn])

  return <Slot />
}
