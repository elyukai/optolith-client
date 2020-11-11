import * as React from "react"
import { flength, map, toArray } from "../../../Data/List"
import { fromJust, isJust, Just, listToMaybe, Maybe, maybeToUndefined, Nothing } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { PromptButton, PromptOptions } from "../../Actions/AlertActions"
import { addKeybinding, removeKeybinding } from "../../Utilities/Keybindings"
import { Dialog } from "./Dialog"

const POA = PromptOptions.A
const PBA = PromptButton.A

interface Props {
  options: Maybe<Record<PromptOptions<any>>>
  close (): void
}

export const Alert: React.FC<Props> = props => {
  const { close, options: moptions } = props

  const closeEnhanced = React.useCallback (
    (canceled: boolean) => {
      removeKeybinding ("enter")

      if (canceled && Maybe.isJust (moptions)) {
        POA.resolve (fromJust (moptions)) (Nothing)
      }

      close ()
    },
    [ close, moptions ]
  )

  if (!Maybe.isJust (moptions)) {
    return null
  }

  const options = Maybe.fromJust (moptions)

  const mtitle = POA.title (options)
  const message = POA.message (options)
  const buttons = POA.buttons (options)
  const resolve = POA.resolve (options)

  const buttonOptions =
    map ((x: Record<PromptButton<any>>) => ({
          autoWidth: flength (buttons) === 1,
          label: PBA.label (x),
          onClick: () => resolve (Just (PBA.response (x))),
        }))
        (buttons)

  if (flength (buttons) === 1) {
    addKeybinding ("enter", () => {
      removeKeybinding ("enter")

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
