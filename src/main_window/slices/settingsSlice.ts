import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { init } from "../init.ts"
import { RootState } from "../store.ts"

type SettingsState = {
  locale: string | undefined
  fallbackLocale: string | undefined
  isEditAfterCreationEnabled: boolean
  areAnimationsEnabled: boolean
}

const initialSettingsState: SettingsState = {
  locale: "de-DE",
  fallbackLocale: undefined,
  isEditAfterCreationEnabled: false,
  areAnimationsEnabled: true,
}

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettingsState,
  reducers: {
    setLocale: (state, action: PayloadAction<string | undefined>) => {
      state.locale = action.payload
    },
    setFallbackLocale: (state, action: PayloadAction<string | undefined>) => {
      state.fallbackLocale = action.payload
    },
    setIsEditAfterCreationEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEditAfterCreationEnabled = action.payload
    },
    setAreAnimationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.areAnimationsEnabled = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(init, (state, action) => {
        state.locale = action.payload.globalSettings.locale
        state.fallbackLocale = action.payload.globalSettings.fallbackLocale
        state.isEditAfterCreationEnabled = action.payload.globalSettings.isEditAfterCreationEnabled
        state.areAnimationsEnabled = action.payload.globalSettings.areAnimationsEnabled
      })
  },
})

export const {
  setLocale,
  setFallbackLocale,
  setIsEditAfterCreationEnabled,
  setAreAnimationsEnabled,
} = settingsSlice.actions

export const selectLocale = (state: RootState) => state.settings.locale
export const selectAreAnimationsEnabled = (state: RootState) => state.settings.areAnimationsEnabled

export const settingsReducer = settingsSlice.reducer
