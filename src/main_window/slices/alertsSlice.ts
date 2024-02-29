/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable max-len */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store.ts"

export type Alert = {
  title: string
  description: string
}

type AlertsState = Alert[]

const initialAlertsState: AlertsState = []

const alertsSlice = createSlice({
  name: "alerts",
  initialState: initialAlertsState,
  reducers: {
    showAlert: (state, action: PayloadAction<Alert>) => {
      state.push(action.payload)
    },
    dismissAlert: state => {
      state.splice(0, 1)
    },
  },
})

export const { showAlert, dismissAlert } = alertsSlice.actions

export const selectCurrentAlert = (state: RootState) => state.alerts[0]

export const alertsReducer = alertsSlice.reducer
