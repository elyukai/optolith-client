import { FC, useCallback, useState } from "react"
import { BasicInputDialog } from "../../../../../shared/components/basicInputDialog/BasicInputDialog.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { parseInt } from "../../../../../shared/utils/math.ts"
import { isNaturalNumber } from "../../../../../shared/utils/regex.ts"

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
      title={translate("Loose Permanent Points")}
      description=""
      value={value}
      invalid={isNaturalNumber(value) ? undefined : ""}
      acceptLabel={translate("Remove")}
      rejectLabel={translate("Cancel")}
      onClose={close}
      onAccept={handleRemove}
      onChange={setValue}
      />
  )
}
