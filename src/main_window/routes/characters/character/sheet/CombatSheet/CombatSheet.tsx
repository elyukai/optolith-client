import type { SpecialAbilityIdentifier } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import { Sheet } from "../Sheet.tsx"
import type { HeaderValue } from "../SheetHeaderAttribute.tsx"
import { SheetSpecialAbilities } from "../SheetSpecialAbilities.tsx"
import { SheetWrapper } from "../SheetWrapper.tsx"
import { CombatSheetTechniques } from "./CombatSheetTechniques.tsx"

const includedSpecialAbilityTypes: SpecialAbilityIdentifier["kind"][] = [
  "AdvancedCombatSpecialAbility",
  "BrawlingSpecialAbility",
  "CombatSpecialAbility",
  "CombatStyleSpecialAbility",
  "CommandSpecialAbility",
]

export const CombatSheet: FC = observer(function MainSheet() {
  const translate = useTranslate()
  const { derivedCharacteristics } = useCharacterState()

  const addHeader = derivedCharacteristics
    .filter(dc => dc.isCombatRelated)
    .map((dc): HeaderValue => ({ id: dc.id, label: dc.abbreviation, value: dc.value }))

  return (
    <SheetWrapper>
      <Sheet id="combat-sheet" title={translate("Combat")} addHeaderInfo={addHeader}>
        {/* <div className="upper"> */}
        <CombatSheetTechniques />
        {/* <CombatSheetLifePoints
            derivedCharacteristics={derivedCharacteristics}
            staticData={staticData}
            /> */}
        {/* </div> */}
        {/* <div className="lower"> */}
        {/* <CombatSheetMeleeWeapons
            staticData={staticData}
            meleeWeapons={meleeWeapons}
            /> */}
        {/* <CombatSheetRangedWeapons
            staticData={staticData}
            rangedWeapons={rangedWeapons}
            /> */}
        {/* <CombatSheetArmor
            armors={armors}
            staticData={staticData}
            /> */}
        {/* <CombatSheetShields
            staticData={staticData}
            shieldsAndParryingWeapons={shieldsAndParryingWeapons}
            /> */}
        <SheetSpecialAbilities
          label={translate("Combat Special Abilities")}
          types={includedSpecialAbilityTypes}
        />
        {/* <CombatSheetStates staticData={staticData} conditions={conditions} states={states} /> */}
        {/* </div> */}
      </Sheet>
    </SheetWrapper>
  )
})
