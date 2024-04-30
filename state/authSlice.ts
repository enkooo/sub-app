import { RootState } from '@/store'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import axios from '@/api/axiosConfig'
import * as SecureStore from 'expo-secure-store'

type User = {
  name?: string
  email: string
  password: string
}

type AuthState = {
  currentUser: undefined | null | User
  isLoading: boolean
}

const initialState: AuthState = {
  currentUser: undefined,
  isLoading: false,
}

export const register = createAsyncThunk(
  'auth/register',
  async (userData: User, thunkAPI) => {
    try {
      const response = await axios.post('/register', {
        user: userData,
      })

      return response.data.user
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
      throw error
    }
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async (userData: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post('/api/sanctum/token', userData)
      await SecureStore.setItemAsync('token', response.data)

      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
      throw error
    }
  },
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/user')

      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
      throw error
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await SecureStore.deleteItemAsync('token')
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(
      register.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.isLoading = false
        state.currentUser = action.payload
      },
    )
    builder.addCase(register.rejected, (state) => {
      state.isLoading = false
    })
    builder.addCase(login.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
      // state.currentUser = action.payload
      state.isLoading = false
    })
    builder.addCase(login.rejected, (state) => {
      state.isLoading = false
    })
    builder.addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(
      getCurrentUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload
        state.isLoading = false
      },
    )
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.currentUser = null
      state.isLoading = false
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.currentUser = null
      state.isLoading = false
    })
  },
})

export const {} = authSlice.actions
export const selectCurrentUser = (state: RootState) => state.auth.currentUser
export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoading

export default authSlice.reducer
