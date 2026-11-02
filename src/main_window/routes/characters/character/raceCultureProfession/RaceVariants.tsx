import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { RadioButtonGroup } from "../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"

export const RaceVariants: FC = observer(() => {
  const { raceVariants = [], raceVariantId } = useCharacterState()
  const { setRaceVariant } = useCharacterActions()

  if (raceVariants.length === 0) {
    return null
  }

  return (
    <RadioButtonGroup
      active={raceVariantId}
      onClickJust={setRaceVariant}
      options={raceVariants.map(e => ({
        name: e.name,
        value: e.id,
      }))}
    />
  )
})
