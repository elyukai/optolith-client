import { combineReducers, configureStore, type Action, type ThunkAction } from "@reduxjs/toolkit"
import { alertsReducer } from "./slices/alertsSlice.ts"
import { routeReducer } from "./slices/routeSlice.ts"
import { settingsReducer } from "./slices/settingsSlice.ts"

const reducer = combineReducers({
  alerts: alertsReducer,
  // database: databaseReducer,
  // characters: charactersReducer,
  // inlineLibrary: inlineLibraryReducer,
  route: routeReducer,
  settings: settingsReducer,
})

/**
 * The Redux store for the main window.
 */
export const store = configureStore({
  reducer,
})

/**
 * The root state of the Redux store.
 */
export type RootState = ReturnType<typeof reducer>

/**
 * A pre-typed version of the dispatch function.
 */
export type AppDispatch = typeof store.dispatch

/**
 * A pre-typed version of the thunk action type.
 */
export type AppThunk = ThunkAction<void, RootState, unknown, Action>
