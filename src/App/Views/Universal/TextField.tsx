// import { TextareaAutosize } from 'react-textarea-autosize'
import * as React from "react"
import { Either, isEither, isLeft } from "../../../Data/Either"
import { List } from "../../../Data/List"
import { guardReplace, isJust, isMaybe, Just, Maybe, maybeToUndefined, orN } from "../../../Data/Maybe"
import { InputKeyEvent } from "../../Models/Hero/heroTypeHelpers"
import { classListMaybe } from "../../Utilities/CSS"
import { TextFieldCounter } from "./TextFieldCounter"
import { TextFieldDeferred } from "./TextFieldDeferred"
import { TextFieldError } from "./TextFieldError"
import { TextFieldHint } from "./TextFieldHint"
import { TextFieldLabel } from "./TextFieldLabel"
import { TextFieldSync } from "./TextFieldSync"

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
  type?: string
  value?: string | number
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
    value: defaultValue,
    hint,
    everyKeyDown,
  } = props

  const value = defaultValue === undefined
                ? ""
                : typeof defaultValue === "number"
                ? defaultValue .toString ()
                : defaultValue

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
      {orN (everyKeyDown)
        ? (
          <TextFieldSync
            autoFocus={maybeToUndefined (Maybe.normalize (autoFocus))}
            disabled={disabled}
            type={type}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            />
        )
        : (
          <TextFieldDeferred
            autoFocus={maybeToUndefined (Maybe.normalize (autoFocus))}
            disabled={disabled}
            type={type}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            />
        )}
      <TextFieldHint hint={hint} value={value} />
      <TextFieldCounter current={countCurrent} max={countMax} />
      <TextFieldError error={error} />
    </div>
  )
}
