import * as React from "react"
import { fromJust, isJust } from "../../../Data/Maybe"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { toInt } from "../../Utilities/NumberUtils"
import { isInteger, isNaturalNumber } from "../../Utilities/RegexUtils"
import { Dialog } from "../Universal/Dialog"
import { TextField } from "../Universal/TextField"

interface OverviewAddAPProps {
  staticData: StaticDataRecord
  isOpen: boolean
  isRemovingEnabled: boolean
  addAdventurePoints (ap: number): void
  close (): void
}

export const OverviewAddAP: React.FC<OverviewAddAPProps> = props => {
  const { addAdventurePoints, isRemovingEnabled, staticData, isOpen, close } = props

  const [ value, setValue ] = React.useState ("")
  const [ prevIsOpen, setPrevIsOpen ] = React.useState (false)

  if (prevIsOpen !== isOpen) {
    setValue ("")
    setPrevIsOpen (isOpen)
  }

  const addAP =
    React.useCallback (
      () => {
        const mvalue = toInt (value)

        if (isJust (mvalue)) {
          addAdventurePoints (fromJust (mvalue))
        }
      },
      [ addAdventurePoints, value ]
    )

  return (
    <Dialog
      id="overview-add-ap"
      title={translate (staticData) ("profile.dialogs.addadventurepoints.title")}
      buttons={[
        {
          disabled: isRemovingEnabled
            ? !isInteger (value)
            : (!isNaturalNumber (value) || value === "0"),
          label: translate (staticData) ("general.dialogs.addbtn"),
          onClick: addAP,
        },
        {
          label: translate (staticData) ("general.dialogs.cancelbtn"),
        },
      ]}
      close={close}
      isOpen={isOpen}
      >
      <TextField
        hint={translate (staticData) ("profile.dialogs.addadventurepoints.label")}
        value={value}
        onChange={setValue}
        fullWidth
        valid={isRemovingEnabled ? isInteger (value) : isNaturalNumber (value) && value !== "0"}
        />
    </Dialog>
  )
}
