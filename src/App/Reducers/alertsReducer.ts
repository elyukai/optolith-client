import { ident } from "../../Data/Function";
import { consF, List, tailS } from "../../Data/List";
import { fromMaybe } from "../../Data/Maybe";
import { AddAlertAction, RemoveAlertAction } from "../Actions/AlertActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { Alert } from "../Models/Hero/heroTypeHelpers";
import { pipe } from "../Utilities/pipe";

type Action = AddAlertAction | RemoveAlertAction

export type AlertsState = List<Alert>

export const AlertsStateDefault: AlertsState = List.empty

export const alertsReducer =
  (action: Action): ident<AlertsState> => {
    switch (action.type) {
      case ActionTypes.ADD_ALERT:
        return consF (action.payload)

      case ActionTypes.REMOVE_ALERT:
        return pipe (tailS, fromMaybe<AlertsState> (List.empty))

      default:
        return ident
    }
  }
