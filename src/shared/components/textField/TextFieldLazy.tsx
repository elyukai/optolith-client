import { useCallback, useEffect, useRef, useState } from "react"
import { InputKeyEvent } from "./TextField.tsx"
import { TextFieldContainer } from "./TextFieldContainer.tsx"

type Props = {
  autoFocus?: boolean
  className?: string
  countCurrent?: number
  countMax?: number
  disabled?: boolean
  error?: string
  fullWidth?: boolean
  hint?: string
  label?: string
  max?: string
  min?: string
  type?: string
  value?: string
  valid?: boolean
  checkDirectInput?: (text: string) => boolean
  onChange(newText: string): void
  onKeyDown?(event: InputKeyEvent): void
  onKeyUp?(event: InputKeyEvent): void
}

/**
 * A text field with label, hint, error, and character count that only updates
 * its value when it loses focus.
 */
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

  const inputRef = useRef<HTMLInputElement | null>(null)

  const [value, setValue] = useState(defaultValue)
  const [prevValue, setPrevValue] = useState(defaultValue)

  if (prevValue !== defaultValue) {
    setValue(defaultValue)
    setPrevValue(defaultValue)
  }

  useEffect(() => {
    if (autoFocus === true && inputRef.current !== null) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        disabled !== true &&
        (typeof checkDirectInput !== "function" || checkDirectInput(e.target.value))
      ) {
        setValue(e.target.value)
      }
    },
    [disabled, checkDirectInput],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (disabled !== true && defaultValue !== value) {
        onChange(e.target.value)
      }
    },
    [defaultValue, disabled, onChange, value],
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
        onKeyDown={disabled === true ? undefined : onKeyDown}
        onKeyUp={disabled === true ? undefined : onKeyUp}
        readOnly={disabled}
        ref={inputRef}
        onBlur={handleBlur}
      />
    </TextFieldContainer>
  )
}
