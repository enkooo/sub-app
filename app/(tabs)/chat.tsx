import React, { useState } from 'react'
import {
  View,
  FlatList,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import axios from 'axios'
import { defaultStyles } from '@/constants/Styles'
import Message from '@/components/Message'

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Welcome to the chat!' },
    { role: 'user', content: 'Hello!' },
    {
      role: 'assistant',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus libero vel necessitatibus commodi, expedita doloremque iure consequatur numquam ad ipsam.',
    },
  ])

  const [prompt, setPrompt] = useState('')

  const onSend = async () => {
    setMessages((existingMessages) => [
      ...existingMessages,
      { role: 'user', content: prompt },
    ])

    setPrompt('')
  }

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
        style={{ flex: 1 }}
      >
        <FlatList
          data={messages}
          contentContainerStyle={{ gap: 10, padding: 10 }}
          renderItem={({ item }) => <Message message={item} />}
        />
        <View className="mt-auto flex-row p-2">
          <TextInput
            placeholder="Ask me anything..."
            placeholderTextColor="#ABABAB"
            style={[defaultStyles.inputField]}
            className="flex-1"
            value={prompt}
            onChangeText={setPrompt}
          />
          <Button title="Send" onPress={onSend} />
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Chat
