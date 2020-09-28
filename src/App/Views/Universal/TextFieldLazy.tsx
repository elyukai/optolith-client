// import { TextareaAutosize } from 'react-textarea-autosize'
import * as React from "react"
import { Either } from "../../../Data/Either"
import { Maybe, orN } from "../../../Data/Maybe"
import { InputKeyEvent } from "../../Models/Hero/heroTypeHelpers"
import { TextFieldContainer } from "./TextFieldContainer"

interface Props {
  autoFocus?: boolean
  className?: string
  countCurrent?: number
  countMax?: number
  disabled?: boolean
  error?: Maybe<string> | Either<string, any>
  fullWidth?: boolean
  hint?: Maybe<string> | string
  label?: Maybe<string> | string
  max?: string
  min?: string
  type?: string
  value?: string
  valid?: boolean
  checkDirectInput?: (text: string) => boolean
  onChange (newText: string): void
  onKeyDown? (event: InputKeyEvent): void
  onKeyUp? (event: InputKeyEvent): void
}

export const TextFieldLazy: React.FC<Props> = props => {
  const {
    autoFocus,
    className,
    countCurrent,
    countMax,
    disabled,
    error,
    fullWidth,
    hint,
    label,
    max,
    min,
    checkDirectInput,
    onChange,
    onKeyDown,
    onKeyUp,
    type = "text",
    valid,
    value: defaultValue = "",
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
        if (
          !orN (disabled)
          && (typeof checkDirectInput !== "function" || checkDirectInput (e.target.value))
        ) {
          setValue (e.target.value)
        }
      },
      [ disabled, checkDirectInput ]
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
    <TextFieldContainer
      className={className}
      countCurrent={countCurrent}
      countMax={countMax}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      hint={hint}
      isFieldEmpty={value.length === 0}
      label={label}
      valid={valid}
      >
      <input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        onKeyPress={orN (disabled) ? undefined : onKeyDown}
        onKeyUp={orN (disabled) ? undefined : onKeyUp}
        readOnly={disabled}
        ref={inputRef}
        onBlur={handleBlur}
        />
    </TextFieldContainer>
  )
}
