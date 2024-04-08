import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  FlatList,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native'
import axios from 'axios'
import { defaultStyles } from '@/constants/Styles'
import Message from '@/components/Message'
import { Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant' },
  ])

  const [prompt, setPrompt] = useState('')

  const list = useRef<FlatList>(null)

  useEffect(() => {
    setTimeout(() => {
      list.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [messages])

  const onSend = async () => {
    const userMessage = { role: 'user', content: prompt }

    setMessages((existingMessages) => [...existingMessages, userMessage])
    setPrompt('')

    try {
      const response = await axios.post(
        'http://192.168.1.103:8081/completion',
        [...messages, userMessage],
      )
      const answer = response.data.choices?.[0]?.message

      setMessages((existingMessages) => [...existingMessages, answer])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={list}
          data={messages.filter((message) => message.role !== 'system')}
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
          <TouchableOpacity
            onPress={onSend}
            className="w-11 h-11 flex justify-center items-center border border-primary rounded-lg ml-2"
          >
            <Ionicons name="send-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Chat
