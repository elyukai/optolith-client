import { ident } from "../../Data/Function";
import { dequeue, empty, enqueue, Queue } from "../../Data/Queue";
import { Record } from "../../Data/Record";
import { snd } from "../../Data/Tuple";
import { AddPromptAction, PromptOptions, RemoveAlertAction } from "../Actions/AlertActions";
import * as ActionTypes from "../Constants/ActionTypes";
import { pipe } from "../Utilities/pipe";

type Action = AddPromptAction | RemoveAlertAction

export type AlertsState = Queue<Record<PromptOptions<any>>>

export const AlertsStateDefault: AlertsState = empty

export const alertsReducer =
  (action: Action): ident<AlertsState> => {
    switch (action.type) {
      case ActionTypes.ADD_ALERT:
        return enqueue (action.payload)

      case ActionTypes.REMOVE_ALERT:
        return pipe (dequeue, snd)

      default:
        return ident
    }
  }
