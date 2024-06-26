import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { defaultStyles } from '@/constants/Styles'
import { Message } from '@/components/Message'
import { Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { useAppDispatch, useAppSelector } from '@/hooks/rtk'
import {
  addMessage,
  removeLastMessage,
  selectChatMessages,
  loadChatMessages,
} from '@/state/chatSlice'
import { router, useLocalSearchParams } from 'expo-router'
import { Message as MessageType } from '@/types/Message'
import { selectCurrentUser } from '@/state/authSlice'
import { sendCompletions } from '@/api/apis/sendCompletions'
import { getConversation } from '@/api/apis/getConversation'
import { updateConversation } from '@/api/apis/updateConversation'
import { createConversation } from '@/api/apis/createConversation'
import SegmentedControl from '@/libraries/SegmentedControl/SegmentedControl'
import { sendQuestion } from '@/api/apis/sendQuestion'
import { newChat } from '@/state/chatSlice'

const SEGMENT_MODES = [
  { id: 0, name: 'Chat' },
  { id: 1, name: 'Q&A' },
]

const Chat = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const currentUser = useAppSelector(selectCurrentUser)
  const { id } = useLocalSearchParams()

  const getChatConversation = async () => {
    try {
      const response = await getConversation({ id: id as string })
      const messages = JSON.parse(response.data.data.messages)
      dispatch(loadChatMessages(messages))
    } catch (error) {
      dispatch(loadChatMessages([]))
    } finally {
      setTabIndex(0)
    }
  }

  const updateChatConversation = async (messages: MessageType[]) => {
    try {
      await updateConversation({ id: id as string, messages })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const saveNewChatConversation = async (
    userId: string,
    title: string,
    messages: MessageType[],
  ) => {
    try {
      const response = await createConversation({
        user_id: userId,
        title: title,
        messages: JSON.stringify(messages),
      })

      router.push(`/chat/${response.id}`)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    if (tabIndex === 1) {
      dispatch(newChat())
      router.push(`/chat/new`)
    }
  }, [tabIndex])

  useEffect(() => {
    if (id !== 'new') {
      getChatConversation()
    }
  }, [id])

  const dispatch = useAppDispatch()

  const messages = useAppSelector(selectChatMessages)
  const [prompt, setPrompt] = useState('')
  const list = useRef<FlatList>(null)

  useEffect(() => {
    if (messages.length === 1 && id !== 'new') {
      setTabIndex(0)
      router.push(`/chat/new`)
    }

    if (messages.length === 3 && id === 'new' && tabIndex === 0) {
      const title = messages[1].content.substring(0, 40)
      const isBotLoading = messages[2].role === 'bot-loading'
      if (isBotLoading) return

      saveNewChatConversation(
        currentUser?.id as unknown as string,
        title,
        messages,
      )
    }

    if (messages.length >= 4 && id !== 'new' && tabIndex === 0) {
      updateChatConversation(messages)
    }

    setTimeout(() => {
      list.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [messages])

  const onSend = async () => {
    if (prompt.length < 2) return

    const userMessage = { role: 'user', content: prompt }
    const loadingMessage = { role: 'bot-loading', content: 'Thinking...' }

    dispatch(addMessage(userMessage))
    dispatch(addMessage(loadingMessage))
    setPrompt('')

    if (tabIndex === 0) {
      try {
        const response = await sendCompletions({ messages, userMessage })
        const answer = response.data.choices?.[0]?.message

        dispatch(removeLastMessage())
        dispatch(addMessage(answer))
      } catch (error) {
        console.error('Error:', error)
      }
    } else if (tabIndex === 1) {
      try {
        const response = await sendQuestion({
          question: prompt,
        })
        const answer = {
          role: 'ai',
          content: response.data.choices?.[0]?.message?.content,
        }
        dispatch(removeLastMessage())
        dispatch(addMessage(answer))
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View style={{ marginHorizontal: 10 }}>
        <SegmentedControl
          containerMargin={10}
          segments={SEGMENT_MODES.map((item) => item.name)}
          onChange={(index) => setTabIndex(index)}
          currentIndex={tabIndex}
          segmentedControlWrapper={{
            backgroundColor: 'rgba(229 231 235 / 0.5)',
            marginTop: 10,
            marginBottom: 10,
          }}
          inactiveTextStyle={{ color: 'black' }}
        />
      </View>
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
