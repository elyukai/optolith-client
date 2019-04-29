import { cnst, ident } from "../../Data/Function";
import { snd } from "../../Data/Pair";
import { ReceiveInitialDataAction } from "../Actions/IOActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { WikiModelRecord } from "../Models/Wiki/WikiModel";

type Action = ReceiveInitialDataAction

export const wikiReducer =
  (action: Action): ident<WikiModelRecord> => {
    switch (action.type) {
      case ActionTypes.RECEIVE_INITIAL_DATA: {
        const { tables } = action.payload

        return cnst (snd (tables))
      }

      default:
        return ident
    }
  }
