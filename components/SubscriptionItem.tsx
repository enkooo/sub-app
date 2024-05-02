import { Dimensions, Image, Text, View } from 'react-native'
import React from 'react'
import { Subscription } from '@/types/Subscription'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons'

type SubscriptionItemProps = {
  item: Subscription
  onRemove: (item: Subscription) => void
  onEdit: (item: Subscription) => void
}

const { width } = Dimensions.get('window')

const TRANSLATE_X_THRESHOLD_LEFT = -width * 0.3
const TRANSLATE_X_THRESHOLD_RIGHT = width * 0.3

const SubscriptionItem = ({
  item,
  onRemove,
  onEdit,
}: SubscriptionItemProps) => {
  const translateX = useSharedValue(0)
  const itemHeight = useSharedValue(80) // h-20
  const marginVertical = useSharedValue(10)
  const opacity = useSharedValue(1)

  const panGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX
    },
    onEnd: () => {
      if (translateX.value < TRANSLATE_X_THRESHOLD_LEFT) {
        translateX.value = withTiming(-width)
        itemHeight.value = withTiming(0)
        marginVertical.value = withTiming(0)
        opacity.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished && onRemove) {
            runOnJS(onRemove)(item)
          }
        })
      } else if (translateX.value > TRANSLATE_X_THRESHOLD_RIGHT) {
        runOnJS(onEdit)(item)
        translateX.value = withTiming(0)
      } else {
        translateX.value = withTiming(0)
      }
    },
  })

  const rItemStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }))

  const rIconStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      translateX.value < TRANSLATE_X_THRESHOLD_LEFT ||
        translateX.value > TRANSLATE_X_THRESHOLD_RIGHT
        ? 1
        : 0,
    ),
  }))

  const rItemContainerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginVertical: marginVertical.value,
    opacity: opacity.value,
  }))

  const shortenText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'
    }

    return text
  }

  return (
    <Animated.View
      style={[rItemContainerStyle]}
      className="w-full items-center"
    >
      <Animated.View
        style={[rIconStyle]}
        className="h-20 w-20 absolute right-8 justify-center items-center"
      >
        <Ionicons name="trash-outline" size={30} color="black" />
      </Animated.View>
      <Animated.View
        style={[rIconStyle]}
        className="h-20 w-20 absolute left-8 justify-center items-center"
      >
        <Feather name="edit" size={30} color="black" />
      </Animated.View>
      <PanGestureHandler
        failOffsetY={[-5, 5]}
        activeOffsetX={[-5, 5]}
        onGestureEvent={panGestureHandler}
      >
        <Animated.View
          style={[rItemStyle]}
          className="w-[90%] h-20 bg-white shadow rounded-lg px-4 flex-row items-center"
        >
          <View style={{ width: 40, height: 40, aspectRatio: 1 }}>
            {item.image ? (
              <Image
                style={{
                  flex: 1,
                  width: null,
                  height: null,
                  resizeMode: 'contain',
                }}
                source={{ uri: item.image }}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <FontAwesome6 name="image" size={38} color="black" />
              </View>
            )}
          </View>
          <View className="ml-6">
            <Text className="font-bold text-xl">
              {shortenText(item.name, 12)}
            </Text>
            <Text className="text-xs text-gray-500 capitalize">
              {item.category.name}
            </Text>
          </View>
          <View className="ml-auto">
            <Text className="font-bold ml-auto">
              {item.currency_value} {item.currency}{' '}
              <Text className="text-xs text-gray-500 font-normal">on</Text>
            </Text>
            <Text className="text-xs text-gray-500 text-right">
              {new Date(item.next_payment)
                .toLocaleDateString('pl-PL')
                .replace(/\//g, '-')}
            </Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  )
}

export default SubscriptionItem
