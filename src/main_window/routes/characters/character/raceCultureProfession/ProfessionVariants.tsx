import { isNotNullish } from "@elyukai/utils/nullable"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { RadioButtonGroup } from "../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"

export const ProfessionVariants: FC = observer(() => {
  const {
    professionVariants = [],
    professionVariantId,
    isVariantSelectionRequired,
  } = useCharacterState()
  const { setProfessionVariant } = useCharacterActions()
  const translate = useTranslate()

  if (professionVariants.length === 0) {
    return null
  }

  return (
    <RadioButtonGroup
      active={professionVariantId}
      onClick={setProfessionVariant}
      options={[
        isVariantSelectionRequired
          ? undefined
          : { name: translate("No variant"), value: undefined },
        ...professionVariants.map(e => ({
          name: e.name,
          value: e.id,
        })),
      ].filter(isNotNullish)}
    />
  )
})
