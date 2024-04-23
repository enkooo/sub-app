import { Slot } from 'expo-router'
import { Provider } from 'react-redux'
import { SessionProvider } from '../ctx'
import { store } from '@/store'

export default function Root() {
  return (
    <Provider store={store}>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </Provider>
  )
}
