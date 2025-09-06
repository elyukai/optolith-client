import * as React from "react"
import { Either } from "../../../Data/Either"
import { Maybe, orN } from "../../../Data/Maybe"
import { InputKeyEvent } from "../../Models/Hero/heroTypeHelpers"
import { TextFieldContainer } from "./TextFieldContainer"

export interface TextAreaProps {
  autoFocus?: boolean | Maybe<boolean>
  className?: string
  countCurrent?: number
  countMax?: number
  disabled?: boolean
  error?: Maybe<string> | Either<string, any>
  fullWidth?: boolean
  hint?: Maybe<string> | string
  label?: Maybe<string> | string
  type?: string
  value?: string
  valid?: boolean
  resize?: "both"|"vertical"|"horizontal"
  initialHeight?: string|number
  onChange (newText: string): void
  onKeyDown? (event: InputKeyEvent): void
  onKeyUp? (event: InputKeyEvent): void
}

export const TextArea: React.FC<TextAreaProps> = props => {
  const {
    autoFocus,
    className,
    countCurrent,
    countMax,
    disabled,
    error,
    fullWidth,
    label,
    onChange,
    onKeyDown,
    onKeyUp,
    valid,
    value = "",
    resize = "both",
    initialHeight = "150px",
    hint,
  } = props

  const inputRef = React.useRef<HTMLTextAreaElement | null> (null)

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
      (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!orN (disabled)) {
          onChange (e.target.value)
        }
      },
      [ disabled, onChange ]
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
      <textarea
        value={value}
        onChange={handleChange}
        onKeyPress={orN (disabled) ? undefined : onKeyDown}
        onKeyUp={orN (disabled) ? undefined : onKeyUp}
        readOnly={disabled}
        ref={inputRef}
        style={{ height: initialHeight, resize }}

        />
    </TextFieldContainer>
  )
}
