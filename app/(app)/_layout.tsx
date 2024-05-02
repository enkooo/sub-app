import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'

export const unstable_settings = {
  initialRouteName: '(root)',
}

export default function AppLayout() {
  const router = useRouter()

  return (
    <Stack>
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/addNewSubscription"
        options={{
          presentation: 'modal',
          headerTitle: 'Add new subscription',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modals)/editSubscription/[id]"
        options={{
          presentation: 'modal',
          headerTitle: 'Edit subscription',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(modals)/history"
        options={{
          presentation: 'modal',
          headerTitle: 'Chat history',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          headerTitle: 'Welcome',
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerTitle: 'Sign Up',
        }}
      />
    </Stack>
  )
}
