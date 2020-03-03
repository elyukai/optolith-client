// import { TextareaAutosize } from 'react-textarea-autosize'
import * as React from "react"
import { Maybe, orN } from "../../../Data/Maybe"
import { InputKeyEvent } from "../../Models/Hero/heroTypeHelpers"

interface Props {
  autoFocus?: boolean
  disabled?: boolean
  type: string
  value: string
  onChange (newText: string): void
  onKeyDown? (event: InputKeyEvent): void
  onKeyUp? (event: InputKeyEvent): void
}

export const TextFieldSync: React.FC<Props> = props => {
  const {
    autoFocus,
    disabled,
    type,
    value,
    onChange,
    onKeyDown,
    onKeyUp,
  } = props

  const inputRef = React.useRef<HTMLInputElement | null> (null)

  React.useEffect (
    () => {
      if (Maybe.elem (true) (Maybe.normalize (autoFocus)) && inputRef.current !== null) {
        inputRef.current.focus ()
      }
    },
    [ autoFocus ]
  )

  const handleChange =
    React.useCallback (
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!orN (disabled)) {
          onChange (e.target.value)
        }
      },
      [ disabled, onChange ]
    )

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      onKeyPress={orN (disabled) ? undefined : onKeyDown}
      onKeyUp={orN (disabled) ? undefined : onKeyUp}
      readOnly={disabled}
      ref={inputRef}
      />
  )
}
