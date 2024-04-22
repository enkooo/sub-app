import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './state/chatSlice'
import categoryFiltersSlice from './state/categoryFiltersSlice'

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    categoryFiltersSlice: categoryFiltersSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
