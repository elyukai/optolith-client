import type { SpecialAbilityIdentifier } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import { Sheet } from "../Sheet.tsx"
import type { HeaderValue } from "../SheetHeaderAttribute.ts"
import { SheetSpecialAbilities } from "../SheetSpecialAbilities.tsx"
import { SheetWrapper } from "../SheetWrapper.tsx"
import { SpellsSheetCantrips } from "./SpellsSheetCantrips.tsx"
import { SpellsSheetSpells } from "./SpellsSheetSpells.tsx"

const includedSpecialAbilityTypes: SpecialAbilityIdentifier["kind"][] = [
  "Adoruzepterzauber",
  "AdvancedMagicalSpecialAbility",
  "AncestorGlyph",
  "ArcaneOrbEnchantment",
  "AttireEnchantment",
  "Beutelzauber",
  "BowlEnchantment",
  "CauldronEnchantment",
  "ChronicleEnchantment",
  "DaggerRitual",
  "FamiliarSpecialAbility",
  "FoolsHatEnchantment",
  "Haubenzauber",
  "Hauerkettenzauber",
  "InstrumentEnchantment",
  "Keulenzauber",
  "Krallenkettenzauber",
  "Kristallkugelzauber",
  "MagicalSign",
  "MagicalSpecialAbility",
  "MagicalTradition",
  "MagicStyleSpecialAbility",
  "OrbEnchantment",
  "ProtectiveWardingCircleSpecialAbility",
  "RingEnchantment",
  "Schweinetrommelzauber",
  "SickleRitual",
  "SpellSwordEnchantment",
  "StaffEnchantment",
  "ToyEnchantment",
  "Trinkhornzauber",
  "WandEnchantment",
  "WeaponEnchantment",
]

export const SpellsSheet: FC = observer(function MainSheet() {
  const translate = useTranslate()
  const { associatedMagicalEnergy: energy } = useCharacterState()

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
      <Sheet id="spells-sheet" title={translate("Spells & Rituals")} addHeaderInfo={addHeader}>
        {/* <div className="all"> */}
        <SpellsSheetSpells />
        {/* <AttributeMods
            staticData={staticData}
            attributes={attributes}
            /> */}
        {/* <SpellsSheetTraditionsProperties
            staticData={staticData}
            magicalPrimary={magicalPrimary}
            magicalTradition={magicalTradition}
            properties={properties}
            /> */}
        <SheetSpecialAbilities
          label={translate("Magical Special Abilities")}
          types={includedSpecialAbilityTypes}
        />
        <SpellsSheetCantrips />
        {/* </div> */}
      </Sheet>
    </SheetWrapper>
  )
})
