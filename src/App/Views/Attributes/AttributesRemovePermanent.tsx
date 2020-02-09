import * as React from "react"
import { fromJust, isJust, Just, Nothing } from "../../../Data/Maybe"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { toInt } from "../../Utilities/NumberUtils"
import { isNaturalNumber } from "../../Utilities/RegexUtils"
import { BasicInputDialog } from "../Universal/BasicInputDialog"

export interface AttributesRemovePermanentProps {
  isOpen: boolean
  l10n: L10nRecord
  close (): void
  remove (value: number): void
}

export interface AttributesRemovePermanentState {
  value: string
}

export const AttributesRemovePermanent: React.FC<AttributesRemovePermanentProps> = props => {
  const { l10n, remove, isOpen, close } = props

  const [ value, setValue ] = React.useState ("")

  const handleRemove = React.useCallback (
    () => {
      const mvalue = toInt (value)

      if (isJust (mvalue)) {
        remove (fromJust (mvalue))
      }
    },
    [ remove, value ]
  )

  return (
    <BasicInputDialog
      id="overview-add-ap"
      isOpen={isOpen}
      title={translate (l10n) ("attributes.removeenergypointslostpermanently.message")}
      description=""
      value={value}
      invalid={isNaturalNumber (value) ? Nothing : Just ("")}
      acceptLabel={translate (l10n) ("attributes.removeenergypointslostpermanently.removebtn")}
      rejectLabel={translate (l10n) ("general.dialogs.cancelbtn")}
      onClose={close}
      onAccept={handleRemove}
      onChange={setValue}
      />
  )
}
