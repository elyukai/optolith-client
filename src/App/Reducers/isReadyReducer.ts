import { cnst, ident } from "../../Data/Function";
import { EndLoadingState } from "../Actions/IOActions";
import { ActionTypes } from "../Constants/ActionTypes";

type Action = EndLoadingState

export const isReadyReducer =
  (action: Action): ident<boolean> => {
    switch (action.type) {
      case ActionTypes.END_LOADING_STATE:
        return cnst (true)

      default:
        return ident
    }
  }
