import { RootState } from '@/store'
import { Message } from '@/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface ChatState {
  messages: Message[]
}

const initialState: ChatState = {
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant',
    },
  ],
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    newChat: (state) => {
      state.messages = initialState.messages
    },
    removeLastMessage: (state) => {
      state.messages.pop()
    },
  },
})

export const { addMessage, newChat, removeLastMessage } = chatSlice.actions
export const selectChatMessages = (state: RootState) => state.chat.messages

export default chatSlice.reducer
