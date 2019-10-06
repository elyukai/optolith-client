import * as React from "react";
import { fromJust, isJust } from "../../../Data/Maybe";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { toInt } from "../../Utilities/NumberUtils";
import { isNaturalNumber } from "../../Utilities/RegexUtils";
import { Dialog } from "../Universal/Dialog";
import { TextField } from "../Universal/TextField";

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

  const [value, setValue] = React.useState ("")

  const handleRemove = React.useCallback (
    () => {
      const mvalue = toInt (value)

      if (isJust (mvalue)) {
        remove (fromJust (mvalue))
      }
    },
    [remove, value]
  )

  return (
    <Dialog
      id="overview-add-ap"
      title={translate (l10n) ("removeenergypointslostpermanently")}
      buttons={[
        {
          disabled: !isNaturalNumber (value),
          label: translate (l10n) ("remove"),
          onClick: handleRemove,
        },
        {
          label: translate (l10n) ("cancel"),
        },
      ]}
      isOpen={isOpen}
      close={close}
      >
      <TextField
        hint={translate (l10n) ("removeenergypointslostpermanentlyinputhint")}
        value={value}
        onChange={setValue}
        fullWidth
        autoFocus
        />
    </Dialog>
  )
}
