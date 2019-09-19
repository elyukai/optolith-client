import * as React from "react";
import { fromJust, isJust } from "../../../Data/Maybe";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { toInt } from "../../Utilities/NumberUtils";
import { isInteger, isNaturalNumber } from "../../Utilities/RegexUtils";
import { Dialog } from "../Universal/DialogNew";
import { TextField } from "../Universal/TextField";

interface OverviewAddAPProps {
  l10n: L10nRecord
  isOpen: boolean
  isRemovingEnabled: boolean
  addAdventurePoints (ap: number): void
  close (): void
}

export const OverviewAddAP: React.FC<OverviewAddAPProps> = props => {
  const { addAdventurePoints, isRemovingEnabled, l10n, isOpen, close } = props

  const [value, setValue] = React.useState ("")
  const [prevIsOpen, setPrevIsOpen] = React.useState (false)

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
      [addAdventurePoints, value]
    )

  return (
    <Dialog
      id="overview-add-ap"
      title={translate (l10n) ("addadventurepoints")}
      buttons={[
        {
          disabled: isRemovingEnabled
            ? !isInteger (value)
            : (!isNaturalNumber (value) || value === "0"),
          label: translate (l10n) ("add"),
          onClick: addAP,
        },
        {
          label: translate (l10n) ("cancel"),
        },
      ]}
      close={close}
      isOpen={isOpen}
      >
      <TextField
        hint={translate (l10n) ("adventurepoints")}
        value={value}
        onChange={setValue}
        fullWidth
        valid={isRemovingEnabled ? isInteger (value) : isNaturalNumber (value) && value !== "0"}
        />
    </Dialog>
  )
}
