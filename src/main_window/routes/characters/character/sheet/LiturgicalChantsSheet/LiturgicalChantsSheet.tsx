import type { SpecialAbilityIdentifier } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import { Sheet } from "../Sheet.tsx"
import type { HeaderValue } from "../SheetHeaderAttribute.tsx"
import { SheetSpecialAbilities } from "../SheetSpecialAbilities.tsx"
import { SheetWrapper } from "../SheetWrapper.tsx"
import { LiturgicalChantsSheetBlessings } from "./LiturgicalChantsSheetBlessings.tsx"
import { LiturgicalChantsSheetLiturgicalChants } from "./LiturgicalChantsSheetLiturgicalChants.tsx"

const includedSpecialAbilityTypes: SpecialAbilityIdentifier["kind"][] = [
  "AdvancedKarmaSpecialAbility",
  "BlessedTradition",
  "CeremonialItemSpecialAbility",
  "KarmaSpecialAbility",
  "LiturgicalStyleSpecialAbility",
  "Sermon",
  "Vision",
]

export const LiturgicalChantsSheet: FC = observer(function MainSheet() {
  const translate = useTranslate()
  const { associatedBlessedEnergy: energy } = useCharacterState()

  const addHeader: HeaderValue[] =
    energy === undefined
      ? []
      : [
          {
            id: energy.id,
            label: translate("{$energy} Max", {
              energy: energy.unitAbbreviation ?? energy.abbreviation,
            }),
            value: energy.value,
            stretch: 2,
          },
          {
            id: `${energy.id}_current`,
            label: translate("Current"),
            stretch: true,
          },
        ]

  return (
    <SheetWrapper>
      <Sheet
        id="liturgies-sheet"
        title={translate("Liturgical Chants & Ceremonies")}
        addHeaderInfo={addHeader}
      >
        {/* <div className="all"> */}
        <LiturgicalChantsSheetLiturgicalChants />
        {/* <AttributeMods staticData={staticData} attributes={attributes} /> */}
        {/* <LiturgicalChantsSheetTraditionsAspects
            staticData={staticData}
            aspects={aspects}
            blessedPrimary={blessedPrimary}
            blessedTradition={blessedTradition}
          /> */}
        <SheetSpecialAbilities
          label={translate("Blessed Special Abilities")}
          types={includedSpecialAbilityTypes}
        />
        <LiturgicalChantsSheetBlessings />
        {/* </div> */}
      </Sheet>
    </SheetWrapper>
  )
})
