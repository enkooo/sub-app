import { Dimensions, Text } from 'react-native'
import React from 'react'
import { ChatHistoryItem as ChatHistoryItemType } from '@/types/ChatHistoryItem'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'

interface ChatHistoryItemProps {
  item: ChatHistoryItemType
  onRemove: (item: ChatHistoryItemType) => void
}

const { width } = Dimensions.get('window')

const TRANSLATE_X_THRESHOLD = -width * 0.3

const ChatHistoryItem = ({ item, onRemove }: ChatHistoryItemProps) => {
  const translateX = useSharedValue(0)
  const itemHeight = useSharedValue(80) // h-20
  const marginVertical = useSharedValue(10)
  const opacity = useSharedValue(1)

  const panGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX
    },
    onEnd: () => {
      const shouldRemove = translateX.value < TRANSLATE_X_THRESHOLD
      if (shouldRemove) {
        translateX.value = withTiming(-width)
        itemHeight.value = withTiming(0)
        marginVertical.value = withTiming(0)
        opacity.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished && onRemove) {
            runOnJS(onRemove)(item)
          }
        })
      } else {
        translateX.value = withTiming(0)
      }
    },
  })

  const rItemStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value < 0 ? translateX.value : 0,
      },
    ],
  }))

  const rIconStyle = useAnimatedStyle(() => ({
    opacity: withTiming(translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0),
  }))

  const rItemContainerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginVertical: marginVertical.value,
    opacity: opacity.value,
  }))

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
      <PanGestureHandler
        failOffsetY={[-5, 5]}
        activeOffsetX={[-5, 5]}
        onGestureEvent={panGestureHandler}
      >
        <Animated.View
          style={[rItemStyle]}
          className="w-[90%] h-20 bg-white shadow rounded-lg justify-center px-5"
        >
          <Text className="text-base">{item.title}</Text>
          <Text className="text-xs text-gray-500">
            {new Date(item.updated_at)
              .toLocaleDateString('pl-PL')
              .replace(/\//g, '-')}
          </Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  )
}

export default ChatHistoryItem
