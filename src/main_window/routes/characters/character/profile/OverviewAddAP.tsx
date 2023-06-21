import { FC, useCallback, useState } from "react"
import { Dialog } from "../../../../../shared/components/dialog/Dialog.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { parseInt } from "../../../../../shared/utils/math.ts"
import { isInteger, isNaturalNumber } from "../../../../../shared/utils/regex.ts"
import { useTranslate } from "../../../../hooks/translate.ts"

type Props = {
  isOpen: boolean
  isRemovingEnabled: boolean
  addAdventurePoints(ap: number): void
  close(): void
}

export const OverviewAddAP: FC<Props> = props => {
  const { addAdventurePoints, isRemovingEnabled, isOpen, close } = props

  const translate = useTranslate()
  const [ value, setValue ] = useState("")
  const [ prevIsOpen, setPrevIsOpen ] = useState(false)

  if (prevIsOpen !== isOpen) {
    setValue("")
    setPrevIsOpen(isOpen)
  }

  const addAP =
    useCallback(
      () => {
        const mvalue = parseInt(value)

        if (mvalue !== undefined) {
          addAdventurePoints(mvalue)
        }
      },
      [ addAdventurePoints, value ]
    )

  return (
    <Dialog
      id="overview-add-ap"
      title={translate("Add Adventure Points")}
      buttons={[
        {
          disabled: isRemovingEnabled
            ? !isInteger(value)
            : (!isNaturalNumber(value) || value === "0"),
          label: translate("Add"),
          onClick: addAP,
        },
        {
          label: translate("Cancel"),
        },
      ]}
      close={close}
      isOpen={isOpen}
      >
      <TextField
        hint={translate("How many Adventure Points do you want to add?")}
        value={value}
        onChange={setValue}
        fullWidth
        valid={isRemovingEnabled ? isInteger(value) : isNaturalNumber(value) && value !== "0"}
        />
    </Dialog>
  )
}
