import { UnknownAction } from "redux"
import { Record } from "../../Data/Record"
import { AppState } from "../Models/AppState"
import { reduceReducersCWithInter } from "../Utilities/reduceReducers"
import { appPostReducer } from "./appPostReducer"
import { appSlicesReducer } from "./appSlicesReducer"

export const appReducer = reduceReducersCWithInter<Record<AppState>, UnknownAction>(
  appSlicesReducer,
  appPostReducer,
)
