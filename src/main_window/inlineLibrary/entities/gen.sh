#!/usr/bin/env bash

files=(
  "AdvancedCombatSpecialAbility"
  "AdvancedKarmaSpecialAbility"
  "AdvancedMagicalSpecialAbility"
  "AdvancedSkillSpecialAbility"
  "Advantage"
  "Alchemicum"
  "Ammunition"
  "AncestorGlyph"
  "AnimalCare"
  "Animal"
  "AnimistPower"
  "ArcaneOrbEnchantment"
  "Armor"
  "AttireEnchantment"
  "BandageOrRemedy"
  "BlessedTradition"
  "Blessing"
  "Book"
  "BowlEnchantment"
  "BrawlingSpecialAbility"
  "Cantrip"
  "CauldronEnchantment"
  "CeremonialItem"
  "CeremonialItemSpecialAbility"
  "Ceremony"
  "ChronicleEnchantment"
  "CloseCombatTechnique"
  "Clothes"
  "CombatSpecialAbility"
  "CombatStyleSpecialAbility"
  "CommandSpecialAbility"
  "Condition"
  "Container"
  "CoreRule"
  "Culture"
  "Curse"
  "DaggerRitual"
  "Disadvantage"
  "DominationRitual"
  "ElvenMagicalSong"
  "EquipmentOfBlessedOnes"
  "FamiliarSpecialAbility"
  "FatePointSexSpecialAbility"
  "GemOrPreciousStone"
  "GeneralSpecialAbility"
  "GeodeRitual"
  "IlluminationLightSource"
  "IlluminationRefillsOrSupplies"
  "Influence"
  "InstrumentEnchantment"
  "JesterTrick"
  "Jewelry"
  "KarmaSpecialAbility"
  "Krallenkettenzauber"
  "Liebesspielzeug"
  "LiturgicalChant"
  "LiturgicalStyleSpecialAbility"
  "LuxuryGood"
  "LycantropicGift"
  "MagicStyleSpecialAbility"
  "MagicalArtifact"
  "MagicalDance"
  "MagicalMelody"
  "MagicalSpecialAbility"
  "MagicalTradition"
  "MusicalInstrument"
  "OptionalRule"
  "OrbEnchantment"
  "OrienteeringAid"
  "PactGift"
  "PersonalityTrait"
  "Poison"
  "Profession"
  "ProtectiveWardingCircleSpecialAbility"
  "Race"
  "RangedCombatTechnique"
  "RingEnchantment"
  "Ritual"
  "RopeOrChain"
  "Sermon"
  "SexSpecialAbility"
  "SickleRitual"
  "SikaryanDrainSpecialAbility"
  "Skill"
  "ThievesTool"
  "ToolOfTheTrade"
  "ToyEnchantment"
  "TravelGearOrTool"
  "Trinkhornzauber"
  "Vehicle"
  "Vision"
  "WandEnchantment"
  "WeaponAccessory"
  "WeaponEnchantment"
  "Weapon"
  "ZibiljaRitual"
)

for item in "${files[@]}"; do
  touch "InlineLibrary$item.tsx"
  echo "import { FC } from \"react\"
import { useAppSelector } from \"../../hooks/redux.ts\"
import { useTranslate } from \"../../hooks/translate.ts\"
import { useTranslateMap } from \"../../hooks/translateMap.ts\"
import { select${item}s } from \"../../slices/databaseSlice.ts\"
import { InlineLibraryPlaceholder } from \"../InlineLibraryPlaceholder.tsx\"
import { InlineLibraryProperties } from \"../InlineLibraryProperties.tsx\"
import { InlineLibraryTemplate } from \"../InlineLibraryTemplate.tsx\"

type Props = {
  id: number
}

export const InlineLibrary$item: FC<Props> = ({ id }) => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()

  const entry = useAppSelector(select${item}s)[id]

  if (entry === undefined) {
    return <InlineLibraryPlaceholder />
  }

  const translations = translateMap(entry.translations)

  return (
    <InlineLibraryTemplate
      className=\"$item\"
      title={translations?.name ?? entry.id.toString()}
      >
      <InlineLibraryProperties
        list={[]}
        />
    </InlineLibraryTemplate>
  )
}" > "InlineLibrary$item.tsx"
done
