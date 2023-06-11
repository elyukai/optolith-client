import { FC, useCallback, useState } from "react"
import { BasicInputDialog } from "../../../../../shared/components/basicInputDialog/BasicInputDialog.tsx"
import { parseInt } from "../../../../../shared/utils/math.ts"
import { isNaturalNumber } from "../../../../../shared/utils/regex.ts"
import { useTranslate } from "../../../../hooks/translate.ts"

type Props = {
  isOpen: boolean
  close(): void
  remove(value: number): void
}

export const PermanentLossSheet: FC<Props> = props => {
  const { remove, isOpen, close } = props

  const [ value, setValue ] = useState("")

  const handleRemove = useCallback(
    () => {
      const parsedValue = parseInt(value)

      if (parsedValue !== undefined) {
        remove(parsedValue)
      }
    },
    [ remove, value ]
  )

  const translate = useTranslate()

  return (
    <BasicInputDialog
      id="overview-add-ap"
      isOpen={isOpen}
      title={translate("attributes.removeenergypointslostpermanently.message")}
      description=""
      value={value}
      invalid={isNaturalNumber(value) ? undefined : ""}
      acceptLabel={translate("attributes.removeenergypointslostpermanently.removebtn")}
      rejectLabel={translate("general.dialogs.cancelbtn")}
      onClose={close}
      onAccept={handleRemove}
      onChange={setValue}
      />
  )
}
