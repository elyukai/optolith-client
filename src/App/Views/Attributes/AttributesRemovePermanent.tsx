import * as React from "react"
import { fromJust, isJust, Just, Nothing } from "../../../Data/Maybe"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { toInt } from "../../Utilities/NumberUtils"
import { isNaturalNumber } from "../../Utilities/RegexUtils"
import { Props } from "../Universal/BasicInputDialog"

export interface AttributesRemovePermanentProps {
  isOpen: boolean
  staticData: StaticDataRecord
  close (): void
  remove (value: number): void
}

export interface AttributesRemovePermanentState {
  value: string
}

export const AttributesRemovePermanent: React.FC<AttributesRemovePermanentProps> = props => {
  const { staticData, remove, isOpen, close } = props

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
    <Props
      id="overview-add-ap"
      isOpen={isOpen}
      title={translate (staticData) ("attributes.removeenergypointslostpermanently.message")}
      description=""
      value={value}
      invalid={isNaturalNumber (value) ? Nothing : Just ("")}
      acceptLabel={translate (staticData)
                             ("attributes.removeenergypointslostpermanently.removebtn")}
      rejectLabel={translate (staticData) ("general.dialogs.cancelbtn")}
      onClose={close}
      onAccept={handleRemove}
      onChange={setValue}
      />
  )
}
