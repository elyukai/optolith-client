import { FC, useCallback, useEffect, useRef, useState } from "react"
import { InputKeyEvent } from "./TextField.tsx"

type Props = {
  autoFocus?: boolean
  disabled?: boolean
  type: string
  value: string
  onChange(newText: string): void
  onKeyDown?(event: InputKeyEvent): void
  onKeyUp?(event: InputKeyEvent): void
}

export const TextFieldDeferred: FC<Props> = props => {
  const {
    autoFocus,
    disabled,
    type,
    value: defaultValue,
    onChange,
    onKeyDown,
    onKeyUp,
  } = props

  const inputRef = useRef<HTMLInputElement | null>(null)

  const [ value, setValue ] = useState(defaultValue)
  const [ prevValue, setPrevValue ] = useState(defaultValue)

  if (prevValue !== defaultValue) {
    setValue(defaultValue)
    setPrevValue(defaultValue)
  }

  useEffect(
    () => {
      if (autoFocus === true && inputRef.current !== null) {
        inputRef.current.focus()
      }
    },
    [ autoFocus ]
  )

  const handleChange =
    useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled !== true) {
          setValue(e.target.value)
        }
      },
      [ disabled ]
    )

  const handleBlur =
    useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (disabled !== true && defaultValue !== value) {
          onChange(e.target.value)
        }
      },
      [ defaultValue, disabled, onChange, value ]
    )

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      onKeyDown={disabled === true ? undefined : onKeyDown}
      onKeyUp={disabled === true ? undefined : onKeyUp}
      readOnly={disabled}
      ref={inputRef}
      onBlur={handleBlur}
      />
  )
}
