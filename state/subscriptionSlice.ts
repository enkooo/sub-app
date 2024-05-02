import { RootState } from '@/store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type SubscriptionState = {
  isRefreshNeeded: boolean
}

const initialState: SubscriptionState = {
  isRefreshNeeded: false,
}

export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setIsRefreshNeeded: (state, action: PayloadAction<boolean>) => {
      state.isRefreshNeeded = action.payload
    },
  },
})

export const { setIsRefreshNeeded } = subscriptionSlice.actions
export const selectIsRefreshNeeded = (state: RootState) =>
  state.subscription.isRefreshNeeded

export default subscriptionSlice.reducer
