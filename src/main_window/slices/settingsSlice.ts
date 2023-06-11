import { createSlice } from "@reduxjs/toolkit"
import { Theme } from "../../shared/schema/config.ts"
import { RootState } from "../store.ts"

type SettingsState = {
  locale: string
  theme: Theme
  areAnimationsEnabled: boolean
}

const initialSettingsState: SettingsState = {
  locale: "de-DE",
  theme: Theme.Dark,
  areAnimationsEnabled: true,
}

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettingsState,
  reducers: {},
})

// export const {} = localeSlice.actions

export const selectLocale = (state: RootState) => state.settings.locale
export const selectTheme = (state: RootState) => state.settings.theme
export const selectAreAnimationsEnabled = (state: RootState) => state.settings.areAnimationsEnabled

export const settingsReducer = settingsSlice.reducer
