import { cnst, ident } from "../../Data/Function"
import { SetLoadingDone } from "../Actions/IOActions"
import * as ActionTypes from "../Constants/ActionTypes"

type Action = SetLoadingDone

export const LAST_LOADING_PHASE = 25

export const isLoadingReducer =
  (action: Action): ident<boolean> => {
    switch (action.type) {
      case ActionTypes.SET_LOADING_DONE:
        return cnst (false)

      default:
        return ident
    }
  }
