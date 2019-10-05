import { remote } from "electron";
import * as localShortcut from "electron-localshortcut";
import * as React from "react";
import { Maybe, orN } from "../../../Data/Maybe";
import { ReduxDispatch } from "../../Actions/Actions";
import { Alert as AlertOptions, AlertButton, ViewAlertButton } from "../../Models/Hero/heroTypeHelpers";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { Dialog } from "./Dialog";

export interface AlertProps {
  l10n: L10nRecord
  options: Maybe<AlertOptions>
  close (): void
  dispatch: ReduxDispatch
}

export const Alert: React.FC<AlertProps> = props => {
  const { close, dispatch, options: moptions, l10n } = props

  if (!Maybe.isJust (moptions)) {
    return null
  }

  const options = Maybe.fromJust (moptions)

  const {
    buttons: buttonsOption = [{ label: "OK", autoWidth: true }],
    message,
    title,
    confirm,
    confirmYesNo,
    onClose,
  } = options

  const buttonOptions: AlertButton[] =
    typeof confirm === "object"
      ? [
        {
          label: orN (confirmYesNo) ? translate (l10n) ("yes") : translate (l10n) ("ok"),
          dispatchOnClick: confirm.resolve,
        },
        {
          label: orN (confirmYesNo) ? translate (l10n) ("no") : translate (l10n) ("cancel"),
          dispatchOnClick: confirm.reject,
        },
      ]
      : buttonsOption

  const buttons: ViewAlertButton[] = buttonOptions .map ((e): ViewAlertButton => {
    const { dispatchOnClick, ...other } = e

    return {
      ...other,
      onClick: () => {
        if (typeof dispatchOnClick === "function") {
          dispatch (dispatchOnClick)
        }
      },
    }
  })

  const currentWindow = remote.getCurrentWindow ()

  const closeEnhanced = () => {
    if (localShortcut.isRegistered (currentWindow, "Enter")) {
      localShortcut.unregister (currentWindow, "Enter")
    }

    if (typeof onClose === "function") {
      onClose ()
    }

    close ()
  }

  if (buttons.length === 1) {
    localShortcut.register (currentWindow, "Enter", () => {
      localShortcut.unregister (currentWindow, "Enter")
      closeEnhanced ()
    })
  }

  return (
    <Dialog
      close={closeEnhanced}
      buttons={buttons}
      isOpen={typeof options === "object"}
      className="alert"
      title={title}
      >
      {message}
    </Dialog>
  )
}
