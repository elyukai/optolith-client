import * as React from "react"
import { notNullStr } from "../../../Data/List"
import { bindF, ensure, isJust, isNothing, Maybe, normalize, Nothing } from "../../../Data/Maybe"
import { InputKeyEvent } from "../../Models/Hero/heroTypeHelpers"
import { addKeybinding, removeKeybinding } from "../../Utilities/Keybindings"
import { pipe_ } from "../../Utilities/pipe"
import { Dialog } from "../Universal/Dialog"
import { TextField } from "../Universal/TextField"

interface Dialog {
  id: string
  isOpen: boolean
  title: string
  description: string
  value: string | undefined
  invalid?: Maybe<string>
  acceptLabel: string
  rejectLabel: string
  rejectDisabled?: boolean
  onClose: () => void
  onAccept: () => void
  onReject?: () => void
  onChange: (new_text: string) => void
}

export const BasicInputDialog: React.FC<Dialog> = props => {
  const {
    id,
    isOpen,
    title,
    description,
    value,
    invalid = Nothing,
    acceptLabel,
    rejectLabel,
    rejectDisabled = false,
    onClose,
    onAccept,
    onReject = () => undefined,
    onChange,
  } = props

  const input_empty = pipe_ (value, normalize, bindF (ensure (notNullStr)), isNothing)

  const accept_disabled = input_empty || isJust (invalid)

  const handleKeyUp = React.useCallback (
    (event: InputKeyEvent) => {
      if (event.key === "Enter" && !accept_disabled) {
        onAccept ()
        onClose ()
      }
      else if (event.key === "Enter" && input_empty && !rejectDisabled) {
        onReject ()
        onClose ()
      }
      else if (event.key === "Escape") {
        onClose ()
      }
    },
    [ accept_disabled, input_empty, rejectDisabled, onAccept, onReject, onClose ]
  )

  React.useEffect (() => {
    addKeybinding ("esc", () => {
      onClose ()
    })

    return () => {
      removeKeybinding ("esc")
    }
  })

  return (
    <Dialog
      id={id}
      close={onClose}
      isOpen={isOpen}
      title={title}
      buttons={[
        {
          autoWidth: true,
          label: acceptLabel,
          disabled: accept_disabled,
          onClick: onAccept,
        },
        {
          autoWidth: true,
          label: rejectLabel,
          disabled: rejectDisabled,
          onClick: onReject,
        },
      ]}
      >
      <p className="description">{description}</p>
      <TextField
        value={value}
        onChange={onChange}
        fullWidth
        autoFocus
        error={invalid}
        onKeyUp={handleKeyUp}
        />
    </Dialog>
  )
}
