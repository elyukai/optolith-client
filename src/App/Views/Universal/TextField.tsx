// import { TextareaAutosize } from 'react-textarea-autosize'
import * as React from "react";
import { Either, isEither, isLeft } from "../../../Data/Either";
import { List } from "../../../Data/List";
import { guardReplace, isJust, isMaybe, Just, Maybe, normalize, orN } from "../../../Data/Maybe";
import { InputKeyEvent, InputTextEvent } from "../../Models/Hero/heroTypeHelpers";
import { classListMaybe } from "../../Utilities/CSS";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { TextFieldCounter } from "./TextFieldCounter";
import { TextFieldError } from "./TextFieldError";
import { TextFieldHint } from "./TextFieldHint";
import { TextFieldLabel } from "./TextFieldLabel";

export interface TextFieldProps {
  autoFocus?: boolean | Maybe<boolean>
  className?: string
  countCurrent?: number
  countMax?: number
  disabled?: boolean
  error?: Maybe<string> | Either<string, any>
  fullWidth?: boolean
  hint?: Maybe<string> | string
  label?: Maybe<string> | string
  multiLine?: boolean
  type?: string
  value?: string | number | Maybe<string | number>
  valid?: boolean
  everyKeyDown?: boolean
  onChange (newText: string): void
  onKeyDown? (event: InputKeyEvent): void
  onKeyUp? (event: InputKeyEvent): void
}

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
    onChange,
    onKeyDown,
    onKeyUp,
    type = "text",
    valid,
    value: mvalue,
    hint,
    everyKeyDown,
  } = props

  const saved_value = renderMaybe (normalize (mvalue))

  const inputRef = React.useRef<HTMLInputElement | null> (null)

  const defaultValue = typeof saved_value === "number" ? saved_value .toString () : saved_value

  const [ value, setValue ] = React.useState (defaultValue)
  const [ prevValue, setPrevValue ] = React.useState (defaultValue)

  if (prevValue !== defaultValue) {
    setValue (defaultValue)
    setPrevValue (defaultValue)
  }

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
      everyKeyDown === true
        ? (event: InputTextEvent) => {
          setValue (event.target.value)
          setPrevValue (event.target.value)
          onChange (event.target.value)
        }
        : orN (disabled)
        ? () => undefined
        : (event: InputTextEvent) => setValue (event.target.value),
      [ disabled, onChange, onChange ]
    )

  const handleBlur =
    React.useCallback (
      orN (disabled) || everyKeyDown === true
        ? () => undefined
        : () => defaultValue === value ? undefined : onChange (value),
      [ disabled, onChange, value ]
    )

  return (
    <div
      className={classListMaybe (List (
        Just ("textfield"),
        Maybe (className),
        guardReplace (orN (fullWidth)) ("fullWidth"),
        guardReplace (orN (disabled)) ("disabled"),
        guardReplace (valid === false
                        || (isMaybe (error) && isJust (error))
                        || (isEither (error) && isLeft (error)))
                      ("invalid")
      ))}
      >
      <TextFieldLabel label={label} />
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
      <TextFieldHint hint={hint} value={value} />
      <TextFieldCounter current={countCurrent} max={countMax} />
      <TextFieldError error={error} />
    </div>
  )
}
