import * as React from "react"
import { InputKeyEvent } from "../../Models/Hero/heroTypeHelpers"
import { IconButton } from "../Universal/IconButton"
import { TextField } from "../Universal/TextField"

interface Props {
  name: string
  cancel (): void
  change (name: string): void
}

export const OverviewNameChange: React.FC<Props> = props => {
  const { name: defaultName, change, cancel } = props

  const [ name, setName ] = React.useState (defaultName)

  const handleSubmit =
    React.useCallback (
      () => change (name),
      [ change, name ]
    )

  const handleEnter =
    React.useCallback (
      (event: InputKeyEvent) => {
        if (event.charCode === 13 && name !== "") {
          change (name)
        }
      },
      [ change, name ]
    )

  return (
    <div className="change-name">
      <TextField
        value={name}
        onChange={setName}
        onKeyDown={handleEnter}
        autoFocus
        />
      <IconButton
        icon="&#xE90a;"
        onClick={handleSubmit}
        disabled={name === ""}
        />
      <IconButton
        icon="&#xE915;"
        onClick={cancel}
        />
    </div>
  )
}
