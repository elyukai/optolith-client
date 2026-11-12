import type { SpecialAbilityIdentifier } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { ActivatableList } from "./ActivatableList.tsx"

interface Props {
  label: string
  types: SpecialAbilityIdentifier["kind"][]
}

export const SheetSpecialAbilities: FC<Props> = observer(({ label, types }) => {
  const { activeSpecialAbilities } = useCharacterState()

  return (
    <ActivatableList
      label={label}
      list={activeSpecialAbilities.filter(entry => types.includes(entry.type))}
    />
  )
})
