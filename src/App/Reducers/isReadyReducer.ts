import { cnst, ident } from "../../Data/Function"
import { SetLoadingPhase } from "../Actions/IOActions"
import * as ActionTypes from "../Constants/ActionTypes"

type Action = SetLoadingPhase

export const LAST_LOADING_PHASE = 25

export const isReadyReducer =
  (action: Action): ident<number> => {
    switch (action.type) {
      case ActionTypes.SET_LOADING_PHASE:
        return cnst (action.payload.phase)

      default:
        return ident
    }
  }
