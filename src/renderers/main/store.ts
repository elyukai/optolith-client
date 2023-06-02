import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { databaseReducer } from "./slices/databaseSlice.ts"

export const store = configureStore({
  reducer: {
    database: databaseReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
