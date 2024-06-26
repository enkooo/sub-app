import React from 'react'
import { Text, View } from 'react-native'
import { Message as MessageType } from '@/types/Message'

type MessageProps = {
  message: MessageType
}

export const Message = ({ message }: MessageProps) => {
  return (
    <View
      className="p-2 rounded-lg w-4/5"
      style={[
        {
          marginLeft: message.role === 'user' ? 'auto' : 0,
          backgroundColor:
            message.role === 'user' ? '#3856ff' : 'rgba(209 213 219 / 0.6)',
        },
      ]}
    >
      <Text
        className="p-1"
        style={[
          {
            color: message.role === 'user' ? '#fff' : '#000',
          },
        ]}
      >
        {message.content}
      </Text>
    </View>
  )
}
