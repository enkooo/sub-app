import Colors from '@/constants/Colors'
import { ActivityIndicator, View } from 'react-native'

const StartPage = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  )
}

export default StartPage
