import { FC, useCallback, useEffect } from "react"
import { addKeybinding, removeKeybinding } from "../../../App/Utilities/Keybindings.ts"
import { Dialog } from "../dialog/Dialog.tsx"
import { InputKeyEvent, TextField } from "../textField/TextField.tsx"

type Props = {
  id: string
  isOpen: boolean
  title: string
  description: string
  value: string | undefined
  invalid?: string
  acceptLabel: string
  rejectLabel: string
  rejectDisabled?: boolean
  onClose: () => void
  onAccept: () => void
  onReject?: () => void
  onChange: (newText: string) => void
}

export const BasicInputDialog: FC<Props> = props => {
  const {
    id,
    isOpen,
    title,
    description,
    value,
    invalid,
    acceptLabel,
    rejectLabel,
    rejectDisabled = false,
    onClose,
    onAccept,
    onReject = () => undefined,
    onChange,
  } = props

  const isInputEmpty = value === undefined || value === ""

  const acceptDisabled = isInputEmpty || invalid !== undefined

  const handleKeyUp = useCallback(
    (event: InputKeyEvent) => {
      if (event.key === "Enter" && !acceptDisabled) {
        onAccept()
        onClose()
      } else if (event.key === "Enter" && isInputEmpty && !rejectDisabled) {
        onReject()
        onClose()
      } else if (event.key === "Escape") {
        onClose()
      }
    },
    [acceptDisabled, isInputEmpty, rejectDisabled, onAccept, onReject, onClose],
  )

  useEffect(() => {
    addKeybinding("esc", () => {
      onClose()
    })

    return () => {
      removeKeybinding("esc")
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
          disabled: acceptDisabled,
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
