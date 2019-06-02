import { remote } from "electron";
import * as localShortcut from "electron-localshortcut";
import * as React from "react";
import { AnyAction } from "redux";
import { Maybe } from "../../../Data/Maybe";
import { ReduxDispatch } from "../../Actions/Actions";
import { Alert as AlertOptions, AlertButton, ViewAlertButton } from "../../Models/Hero/heroTypeHelpers";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { Dialog } from "./DialogNew";

export interface AlertProps {
  l10n: L10nRecord
  options: Maybe<AlertOptions>
  close (): void
  dispatch: ReduxDispatch
}

export function Alert (props: AlertProps) {
  const { close, dispatch, options: maybeOptions, l10n } = props
  let buttons: ViewAlertButton[] | undefined
  let message
  let title
  let onClose: (() => void) | undefined

  if (!Maybe.isJust (maybeOptions)) {
    return null
  }

  const options = Maybe.fromJust (maybeOptions)

  const {
    buttons: buttonsOption = [{ label: "OK", autoWidth: true }],
    message: messageOption,
    title: titleOption,
    confirm,
    confirmYesNo,
    onClose: onCloseOption,
  } = options

  const buttonOptions: AlertButton[] = confirm ? [
    {
      label: confirmYesNo === true ? translate (l10n) ("yes") : translate (l10n) ("ok"),
      dispatchOnClick: confirm.resolve,
    },
    {
      label: confirmYesNo === true ? translate (l10n) ("no") : translate (l10n) ("cancel"),
      dispatchOnClick: confirm.reject,
    },
  ] : buttonsOption

  buttons = buttonOptions .map ((e): ViewAlertButton => {
    const { dispatchOnClick, ...other } = e

    return { ...other, onClick: () => {
      if (dispatchOnClick) {
        dispatch (dispatchOnClick as AnyAction)
      }
    }}
  })

  message = messageOption
  title = titleOption
  onClose = onCloseOption

  const currentWindow = remote.getCurrentWindow ()

  const closeEnhanced = () => {
    if (localShortcut.isRegistered (currentWindow, "Enter")) {
      localShortcut.unregister (currentWindow, "Enter")
    }
    if (onClose) {
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
