import { cnst, ident } from "../../Data/Function"
import { ReceiveInitialDataAction } from "../Actions/InitializationActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { StaticDataRecord } from "../Models/Wiki/WikiModel"

type Action = ReceiveInitialDataAction

export const wikiReducer =
  (action: Action): ident<StaticDataRecord> => {
    switch (action.type) {
      case ActionTypes.RECEIVE_INITIAL_DATA: {
        const { staticData } = action.payload

        return cnst (staticData)
      }

      default:
        return ident
    }
  }
