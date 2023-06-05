import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store.ts"

type SettingsState = {
  locale: string
}

const initialSettingsState: SettingsState = {
  locale: "de-DE",
}

const settingsSlice = createSlice({
  name: "locale",
  initialState: initialSettingsState,
  reducers: {},
})

// export const {} = localeSlice.actions

export const selectLocale = (state: RootState) => state.settings.locale

export const settingsReducer = settingsSlice.reducer
