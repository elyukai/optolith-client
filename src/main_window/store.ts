import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { reduceReducers } from "../shared/utils/redux.ts"
import { charactersReducer } from "./slices/charactersSlice.ts"
import { databaseReducer } from "./slices/databaseSlice.ts"
import { globalReducer } from "./slices/global.ts"
import { inlineLibraryReducer } from "./slices/inlineWikiSlice.ts"
import { routeReducer } from "./slices/routeSlice.ts"
import { settingsReducer } from "./slices/settingsSlice.ts"

const sliceReducer = combineReducers({
  database: databaseReducer,
  characters: charactersReducer,
  inlineLibrary: inlineLibraryReducer,
  route: routeReducer,
  settings: settingsReducer,
})

const reducer = reduceReducers(sliceReducer, globalReducer)

export const store = configureStore({
  reducer,
})

export type RootState = ReturnType<typeof sliceReducer>
export type AppDispatch = typeof store.dispatch
