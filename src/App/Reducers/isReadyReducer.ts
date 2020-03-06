import { cnst, ident } from "../../Data/Function"
import { SetLoadingDone, SetLoadingDoneWithError } from "../Actions/InitializationActions"
import * as ActionTypes from "../Constants/ActionTypes"

type Action = SetLoadingDone | SetLoadingDoneWithError

export const LAST_LOADING_PHASE = 25

export const isLoadingReducer =
  (action: Action): ident<boolean> => {
    switch (action.type) {
      case ActionTypes.SET_LOADING_DONE:
      case ActionTypes.SET_LOADING_DONE_WITH_ERROR:
        return cnst (false)

      default:
        return ident
    }
  }

export const hasInitWithErrorsReducer =
  (action: Action): ident<boolean> => {
    switch (action.type) {
      case ActionTypes.SET_LOADING_DONE:
        return cnst (false)

      case ActionTypes.SET_LOADING_DONE_WITH_ERROR:
        return cnst (true)

      default:
        return ident
    }
  }
