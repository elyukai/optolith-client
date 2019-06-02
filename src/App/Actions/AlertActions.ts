import { clipboard } from "electron";
import { ActionTypes } from "../Constants/ActionTypes";
import { Alert } from "../Models/Hero/heroTypeHelpers";
import { L10nRecord } from "../Models/Wiki/L10n";
import { translate } from "../Utilities/I18n";

export interface AddAlertAction {
  type: ActionTypes.ADD_ALERT
  payload: Alert
}

export const addAlert = (options: Alert): AddAlertAction => ({
  type: ActionTypes.ADD_ALERT,
  payload: options,
})

export const addErrorAlert = (l10n: L10nRecord) => (options: Alert): AddAlertAction => {
  const buttons: Alert["buttons"] = [
    {
      label: translate (l10n) ("copy"),
      dispatchOnClick: () => clipboard.writeText (options.message),
    },
    {
      label: translate (l10n) ("ok"),
    },
  ]

  return {
    type: ActionTypes.ADD_ALERT,
    payload: {
      ...options,
      buttons,
    },
  }
}

export interface RemoveAlertAction {
  type: ActionTypes.REMOVE_ALERT
}

export const removeAlert = (): RemoveAlertAction => ({
  type: ActionTypes.REMOVE_ALERT,
})
