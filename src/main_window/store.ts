import { configureStore } from "@reduxjs/toolkit"
import { databaseReducer } from "./slices/databaseSlice.ts"
import { routeReducer } from "./slices/routeSlice.ts"
import { settingsReducer } from "./slices/settingsSlice.ts"

export const store = configureStore({
  reducer: {
    database: databaseReducer,
    route: routeReducer,
    settings: settingsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
