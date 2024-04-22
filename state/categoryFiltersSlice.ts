import { RootState } from '@/store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type CategoryFiltersState = {
  items: string[]
  isFiltersModalOpen: boolean
}

const initialState: CategoryFiltersState = {
  items: [],
  isFiltersModalOpen: false,
}

export const categoryFiltersState = createSlice({
  name: 'categoryFiltersState',
  initialState,
  reducers: {
    addCategoryFilter: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload)
    },
    removeCategoryFilter: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item !== action.payload)
    },
    clearCategoryFilters: (state) => {
      state.items = []
    },
    loadCategoryFilters: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload
    },
    toggleFiltersModal: (state) => {
      state.isFiltersModalOpen = !state.isFiltersModalOpen
    },
  },
})

export const {
  addCategoryFilter,
  clearCategoryFilters,
  loadCategoryFilters,
  removeCategoryFilter,
  toggleFiltersModal,
} = categoryFiltersState.actions
export const selectCategoryFilters = (state: RootState) =>
  state.categoryFiltersSlice.items

export const selectIsFiltersCategoryModalOpen = (state: RootState) =>
  state.categoryFiltersSlice.isFiltersModalOpen

export default categoryFiltersState.reducer
