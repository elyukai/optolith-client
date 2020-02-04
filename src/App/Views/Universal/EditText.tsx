import * as React from "react"
import { fnullStr, List, notNullStr } from "../../../Data/List"
import { fromMaybe, Just, Maybe } from "../../../Data/Maybe"
import { InputKeyEvent } from "../../Models/Hero/heroTypeHelpers"
import { classListMaybe } from "../../Utilities/CSS"
import { IconButton } from "./IconButton"
import { TextField } from "./TextField"

export interface EditTextProps {
  autoFocus?: boolean
  className?: string
  text: string | undefined
  cancel (): void
  submit (text: string): void
}

export const EditText: React.FC<EditTextProps> = props => {
  const { autoFocus, className, text: defaultText, submit, cancel } = props

  const [ text, setText ] = React.useState (fromMaybe ("") (Maybe (defaultText)))

  const handleSubmit =
    React.useCallback (
      () => notNullStr (text) ? submit (text) : undefined,
      [ submit, text ]
    )

  const handleEnter =
    React.useCallback (
      (event: InputKeyEvent) => {
        if (event.charCode === 13 && text !== "") {
          submit (text)
        }
      },
      [ submit, text ]
    )

  return (
    <div
      className={
        classListMaybe (List (
          Just ("confirm-edit"),
          Maybe (className)
        ))
      }
      >
      <TextField
        value={text}
        onChange={setText}
        onKeyDown={handleEnter}
        autoFocus={autoFocus}
        />
      <IconButton
        icon="&#xE90a;"
        onClick={handleSubmit}
        disabled={fnullStr (text)}
        />
      <IconButton
        icon="&#xE915;"
        onClick={cancel}
        />
    </div>
  )
}
