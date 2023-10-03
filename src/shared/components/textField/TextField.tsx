import { ChangeEvent, FC, KeyboardEvent, useCallback, useEffect, useRef } from "react"
import "./TextField.scss"
import { TextFieldContainer } from "./TextFieldContainer.tsx"

/**
 * A keyboard event for an input element.
 */
export type InputKeyEvent = KeyboardEvent<HTMLInputElement>

export interface TextFieldProps {
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
  onChange(newText: string): void
  onKeyDown?(event: InputKeyEvent): void
  onKeyUp?(event: InputKeyEvent): void
}

/**
 * A text field with label, hint, error, and character count.
 */
export const TextField: React.FC<TextFieldProps> = props => {
  const {
    autoFocus,
    className,
    countCurrent,
    countMax,
    disabled,
    error,
    fullWidth,
    label,
    max,
    min,
    onChange,
    onKeyDown,
    onKeyUp,
    type = "text",
    valid,
    value = "",
    hint,
  } = props

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (autoFocus === true && inputRef.current !== null) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (disabled !== true) {
        onChange(e.target.value)
      }
    },
    [disabled, onChange],
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
        disabled={disabled}
        ref={inputRef}
      />
    </TextFieldContainer>
  )
}
