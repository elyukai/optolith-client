// import { TextareaAutosize } from 'react-textarea-autosize'
import * as React from "react"
import { Either, isEither, isLeft } from "../../../Data/Either"
import { List } from "../../../Data/List"
import { guardReplace, isJust, isMaybe, Just, Maybe, orN } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import { TextFieldCounter } from "./TextFieldCounter"
import { TextFieldError } from "./TextFieldError"
import { TextFieldHint } from "./TextFieldHint"
import { TextFieldLabel } from "./TextFieldLabel"

interface Props {
  className?: string
  countCurrent?: number
  countMax?: number
  disabled?: boolean
  error?: Maybe<string> | Either<string, any>
  fullWidth?: boolean
  hint?: Maybe<string> | string
  isFieldEmpty: boolean
  label?: Maybe<string> | string
  valid?: boolean
}

export const TextFieldContainer: React.FC<Props> = props => {
  const {
    children,
    className,
    countCurrent,
    countMax,
    disabled,
    error,
    fullWidth,
    hint,
    isFieldEmpty,
    label,
    valid,
  } = props

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
      {children}
      <TextFieldHint hint={hint} isFieldEmpty={isFieldEmpty} />
      <TextFieldCounter current={countCurrent} max={countMax} />
      <TextFieldError error={error} />
    </div>
  )
}
