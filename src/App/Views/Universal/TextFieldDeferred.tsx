// import { TextareaAutosize } from 'react-textarea-autosize'
import * as React from "react"
import { orN } from "../../../Data/Maybe"
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

export const TextFieldDeferred: React.FC<Props> = props => {
  const {
    autoFocus,
    disabled,
    type,
    value: defaultValue,
    onChange,
    onKeyDown,
    onKeyUp,
  } = props

  const inputRef = React.useRef<HTMLInputElement | null> (null)

  const [ value, setValue ] = React.useState (defaultValue)
  const [ prevValue, setPrevValue ] = React.useState (defaultValue)

  if (prevValue !== defaultValue) {
    setValue (defaultValue)
    setPrevValue (defaultValue)
  }

  React.useEffect (
    () => {
      if (orN (autoFocus) && inputRef.current !== null) {
        inputRef.current.focus ()
      }
    },
    [ autoFocus ]
  )

  const handleChange =
    React.useCallback (
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!orN (disabled)) {
          setValue (e.target.value)
        }
      },
      [ disabled ]
    )

  const handleBlur =
    React.useCallback (
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (!orN (disabled) && defaultValue !== value) {
          onChange (e.target.value)
        }
      },
      [ defaultValue, disabled, onChange, value ]
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
      onBlur={handleBlur}
      />
  )
}
