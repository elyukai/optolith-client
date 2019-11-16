import { clipboard } from "electron";
import { ActionTypes } from "../Constants/ActionTypes";
import { L10nRecord } from "../Models/Wiki/L10n";
import { translate } from "../Utilities/I18n";
import { ReduxActions } from "./Actions";

export interface Alert {
  message: string
  title?: string
  buttons?: AlertButton[]
  confirm?: AlertConfirm
  confirmYesNo?: boolean
  onClose? (): void
}

export interface AlertButtonCore {
  autoWidth?: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  flat?: boolean
  fullWidth?: boolean
  label: string | undefined
  primary?: boolean
}

export interface AlertButton extends AlertButtonCore {
  dispatchOnClick?: ReduxActions
}

export interface ViewAlertButton extends AlertButtonCore {
  onClick? (): void
}

interface AlertConfirm {
  resolve?: ReduxActions
  reject?: ReduxActions
}

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
