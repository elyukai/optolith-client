import { FC, useCallback, useState } from "react"
import { classList } from "../../utils/classList.ts"
import { IconButton } from "../iconButton/IconButton.tsx"
import { InputKeyEvent, TextField } from "../textField/TextField.tsx"
import "./EditText.scss"

type Props = {
  autoFocus?: boolean
  className?: string
  text: string | undefined
  submitLabel: string
  cancelLabel: string
  cancel(): void
  submit(text: string): void
}

export const EditText: FC<Props> = props => {
  const {
    autoFocus,
    className,
    text: defaultText,
    submit,
    submitLabel,
    cancel,
    cancelLabel,
  } = props

  const [text, setText] = useState(defaultText ?? "")

  const handleSubmit = useCallback(() => (text === "" ? undefined : submit(text)), [submit, text])

  const handleEnter = useCallback(
    (event: InputKeyEvent) => {
      if (event.key === "Enter" && text !== "") {
        submit(text)
      } else if (event.key === "Escape") {
        cancel()
      }
    },
    [cancel, submit, text],
  )

  return (
    <div className={classList("confirm-edit", className)}>
      <TextField value={text} onChange={setText} onKeyDown={handleEnter} autoFocus={autoFocus} />
      <IconButton
        icon="&#xE90a;"
        onClick={handleSubmit}
        disabled={text === ""}
        label={submitLabel}
      />
      <IconButton icon="&#xE915;" onClick={cancel} label={cancelLabel} />
    </div>
  )
}
