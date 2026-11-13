import { parseInt } from "@elyukai/utils/string/number"
import { isInteger, isNaturalNumber } from "@elyukai/utils/string/regex"
import { observer } from "mobx-react-lite"
import { useCallback, useState, type FC } from "react"
import { Dialog } from "../../../../../shared/components/dialog/Dialog.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"

/**
 * Returns a sheet for adding adventure points to the character.
 */
export const OverviewAddAP: FC<{ isOpen: boolean; close: () => void }> = observer(
  function OverviewAddAP({ isOpen, close }) {
    const translate = useTranslate()
    const [value, setValue] = useState("")
    const [prevIsOpen, setPrevIsOpen] = useState(false)
    const { canRemove } = useCharacterState()
    const actions = useCharacterActions()

    if (prevIsOpen !== isOpen) {
      setValue("")
      setPrevIsOpen(isOpen)
    }

    const addAP = useCallback(() => {
      const mvalue = parseInt(value)

      if (mvalue !== undefined) {
        actions.addAdventurePoints(mvalue)
      }
    }, [actions, value])

    return (
      <Dialog
        id="overview-add-ap"
        title={translate("Add Adventure Points")}
        buttons={[
          {
            disabled: canRemove ? !isInteger(value) : !isNaturalNumber(value) || value === "0",
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
          valid={canRemove ? isInteger(value) : isNaturalNumber(value) && value !== "0"}
        />
      </Dialog>
    )
  },
)
