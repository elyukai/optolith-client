// import { TextareaAutosize } from 'react-textarea-autosize'
import * as React from "react";
import { fmapF } from "../../../Data/Functor";
import { List, notNullStr } from "../../../Data/List";
import { bindF, ensure, fromMaybe, guardReplace, Just, Maybe, maybe, normalize, orN } from "../../../Data/Maybe";
import { InputKeyEvent, InputTextEvent } from "../../Models/Hero/heroTypeHelpers";
import { classListMaybe } from "../../Utilities/CSS";
import { pipe_ } from "../../Utilities/pipe";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { isNumber } from "../../Utilities/typeCheckUtils";
import { Label } from "./Label";

export interface TextFieldProps {
  autoFocus?: boolean | Maybe<boolean>
  className?: string
  countCurrent?: number
  countMax?: number
  disabled?: boolean
  fullWidth?: boolean
  hint?: Maybe<string> | string
  label?: Maybe<string> | string
  multiLine?: boolean
  onChange? (event: InputTextEvent): void
  onChangeString? (updatedText: string): void
  onKeyDown? (event: InputKeyEvent): void
  type?: string
  value?: string | number | Maybe<string | number>
  valid?: boolean
}

export const TextField: React.FC<TextFieldProps> = props => {
  const inputRef = React.useRef<HTMLInputElement | null> (null)

  React.useEffect (
    () => {
      const { autoFocus } = props

      if (Maybe.elem (true) (Maybe.normalize (autoFocus)) && inputRef.current !== null) {
        inputRef.current.focus ()
      }
    },
    []
  )

  const {
    className,
    countCurrent,
    countMax,
    disabled,
    fullWidth,
    label,
    onChange,
    onChangeString,
    onKeyDown,
    type = "text",
    valid,
    value: mvalue,
    hint: mhint,
  } = props

  const value = renderMaybe (normalize (mvalue))
  const mlabel = normalize (label)

  const hintElement =
    fmapF (normalize (mhint))
          (hint => (
            <div
              className={
                classListMaybe (List (
                  Just ("textfield-hint"),
                  guardReplace (value !== "") ("hide")
                ))
              }
              >
              {hint}
            </div>
          ))

  const handleChange =
    React.useCallback (
      orN (disabled)
        ? () => undefined
        : (typeof onChange === "function" && typeof onChangeString === "function")
        ? (event: InputTextEvent) => {
          onChange (event)
          onChangeString (event.target.value)
        }
        : typeof onChangeString === "function"
        ? (event: InputTextEvent) => onChangeString (event.target.value)
        : typeof onChange === "function"
        ? onChange
        : () => undefined,
      [disabled, onChange, onChangeString]
    )

  // const inputElement = multiLine ? (
  //  <TextareaAutosize
  //    defaultValue={trueValue}
  //    onChange={onChange}
  //    onKeyPress={onKeyDown}
  //  />
  // ) : (
  const inputElement = (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      onKeyPress={orN (disabled) ? undefined : onKeyDown}
      readOnly={disabled}
      ref={inputRef}
      />
  )
  const counterTextElement =
    isNumber (countMax)
    ? (
      <div>
        {countCurrent}
        {" / "}
        {countMax}
      </div>
    )
    : null

  return (
    <div
      className={
        classListMaybe (List (
          Just ("textfield"),
          Maybe (className),
          guardReplace (orN (fullWidth)) ("fullWidth"),
          guardReplace (orN (disabled)) ("disabled"),
          guardReplace (valid === false) ("invalid")
        ))
      }
      >
      {pipe_ (mlabel, bindF (ensure (notNullStr)), maybe (null as React.ReactNode)
                                                         (l => <Label text={l} />))}
      {inputElement}
      {fromMaybe (null as React.ReactNode) (hintElement)}
      {counterTextElement}
    </div>
  )
}
