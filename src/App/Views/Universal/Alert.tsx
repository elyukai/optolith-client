import { remote } from "electron";
import * as localShortcut from "electron-localshortcut";
import * as React from "react";
import { flength, map, toArray } from "../../../Data/List";
import { fromJust, isJust, Just, listToMaybe, Maybe, maybeToUndefined, Nothing } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { PromptButton, PromptOptions } from "../../Actions/AlertActions";
import { BorderButtonProps } from "./BorderButton";
import { Dialog } from "./Dialog";

const POA = PromptOptions.A
const PBA = PromptButton.A

export interface AlertProps {
  options: Maybe<Record<PromptOptions<any>>>
  close (): void
}

export const Alert: React.FC<AlertProps> = props => {
  const { close, options: moptions } = props

  if (!Maybe.isJust (moptions)) {
    return null
  }

  const options = Maybe.fromJust (moptions)

  const mtitle = POA.title (options)
  const message = POA.message (options)
  const buttons = POA.buttons (options)
  const resolve = POA.resolve (options)

  // const {
  //   buttons: buttonsOption = [{ label: "OK", autoWidth: true }],
  //   message,
  //   title,
  //   confirm,
  //   confirmYesNo,
  //   onClose,
  // } = options

  const buttonOptions =
    map ((x: Record<PromptButton<any>>): BorderButtonProps => ({
          autoWidth: flength (buttons) === 1,
          label: PBA.label (x),
          onClick: () => resolve (Just (PBA.response (x))),
        }))
        (buttons)

  const currentWindow = remote.getCurrentWindow ()

  const closeEnhanced = (canceled: boolean) => {
    if (localShortcut.isRegistered (currentWindow, "Enter")) {
      localShortcut.unregister (currentWindow, "Enter")
    }

    if (canceled) {
      resolve (Nothing)
    }

    close ()
  }

  if (flength (buttons) === 1) {
    localShortcut.register (currentWindow, "Enter", () => {
      localShortcut.unregister (currentWindow, "Enter")

      const mresponse = listToMaybe (buttons)

      if (isJust (mresponse)) {
        resolve (Just (PBA.response (fromJust (mresponse))))
      }

      closeEnhanced (false)
    })
  }

  return (
    <Dialog
      close={closeEnhanced}
      buttons={toArray (buttonOptions)}
      isOpen={typeof options === "object"}
      className="alert"
      title={maybeToUndefined (mtitle)}
      >
      {message}
    </Dialog>
  )
}
