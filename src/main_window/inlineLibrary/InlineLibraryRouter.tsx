import { FC } from "react"
import { assertExhaustive } from "../../shared/utils/typeSafety.ts"
import { DisplayableMainIdentifier } from "../slices/inlineWikiSlice.ts"
import "./InlineLibrary.scss"
import { InlineLibraryPlaceholder } from "./InlineLibraryPlaceholder.tsx"
import { InlineLibraryExperienceLevel } from "./entities/InlineLibraryExperienceLevel.tsx"
import { InlineLibraryFocusRule } from "./entities/InlineLibraryFocusRule.tsx"
import { InlineLibraryOptionalRule } from "./entities/InlineLibraryOptionalRule.tsx"
import { InlineLibrarySkill } from "./entities/InlineLibrarySkill.tsx"

type Props = {
  id: DisplayableMainIdentifier
}

/**
 * Displays the right component for the requested entry.
 */
export const InlineLibraryRouter: FC<Props> = ({ id }) => {
  switch (id.tag) {
    case "AdvancedCombatSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "AdvancedKarmaSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "AdvancedMagicalSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "AdvancedSkillSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "Advantage":
      return <InlineLibraryPlaceholder />
    case "Ammunition":
      return <InlineLibraryPlaceholder />
    case "AncestorGlyph":
      return <InlineLibraryPlaceholder />
    case "AnimalCare":
      return <InlineLibraryPlaceholder />
    case "Animal":
      return <InlineLibraryPlaceholder />
    case "AnimistPower":
      return <InlineLibraryPlaceholder />
    case "ArcaneOrbEnchantment":
      return <InlineLibraryPlaceholder />
    case "Armor":
      return <InlineLibraryPlaceholder />
    case "AttireEnchantment":
      return <InlineLibraryPlaceholder />
    case "BandageOrRemedy":
      return <InlineLibraryPlaceholder />
    case "BlessedTradition":
      return <InlineLibraryPlaceholder />
    case "Blessing":
      return <InlineLibraryPlaceholder />
    case "Book":
      return <InlineLibraryPlaceholder />
    case "BowlEnchantment":
      return <InlineLibraryPlaceholder />
    case "BrawlingSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "Cantrip":
      return <InlineLibraryPlaceholder />
    case "CauldronEnchantment":
      return <InlineLibraryPlaceholder />
    case "CeremonialItem":
      return <InlineLibraryPlaceholder />
    case "CeremonialItemSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "Ceremony":
      return <InlineLibraryPlaceholder />
    case "ChronicleEnchantment":
      return <InlineLibraryPlaceholder />
    case "CloseCombatTechnique":
      return <InlineLibraryPlaceholder />
    case "Clothes":
      return <InlineLibraryPlaceholder />
    case "CombatSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "CombatStyleSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "CommandSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "Condition":
      return <InlineLibraryPlaceholder />
    case "Container":
      return <InlineLibraryPlaceholder />
    case "CoreRule":
      return <InlineLibraryPlaceholder />
    case "Culture":
      return <InlineLibraryPlaceholder />
    case "Curse":
      return <InlineLibraryPlaceholder />
    case "DaggerRitual":
      return <InlineLibraryPlaceholder />
    case "Disadvantage":
      return <InlineLibraryPlaceholder />
    case "DominationRitual":
      return <InlineLibraryPlaceholder />
    case "ElvenMagicalSong":
      return <InlineLibraryPlaceholder />
    case "EquipmentOfBlessedOnes":
      return <InlineLibraryPlaceholder />
    case "ExperienceLevel":
      return <InlineLibraryExperienceLevel id={id.experience_level} />
    case "FamiliarSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "FatePointSexSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "FatePointSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "FocusRule":
      return <InlineLibraryFocusRule id={id.focus_rule} />
    case "FoolsHatEnchantment":
      return <InlineLibraryPlaceholder />
    case "GemOrPreciousStone":
      return <InlineLibraryPlaceholder />
    case "GeneralSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "GeodeRitual":
      return <InlineLibraryPlaceholder />
    case "IlluminationLightSource":
      return <InlineLibraryPlaceholder />
    case "IlluminationRefillsOrSupplies":
      return <InlineLibraryPlaceholder />
    case "Influence":
      return <InlineLibraryPlaceholder />
    case "InstrumentEnchantment":
      return <InlineLibraryPlaceholder />
    case "JesterTrick":
      return <InlineLibraryPlaceholder />
    case "Jewelry":
      return <InlineLibraryPlaceholder />
    case "KarmaSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "Krallenkettenzauber":
      return <InlineLibraryPlaceholder />
    case "Liebesspielzeug":
      return <InlineLibraryPlaceholder />
    case "LiturgicalChant":
      return <InlineLibraryPlaceholder />
    case "LiturgicalStyleSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "LuxuryGood":
      return <InlineLibraryPlaceholder />
    case "LycantropicGift":
      return <InlineLibraryPlaceholder />
    case "MagicStyleSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "MagicalArtifact":
      return <InlineLibraryPlaceholder />
    case "MagicalDance":
      return <InlineLibraryPlaceholder />
    case "MagicalMelody":
      return <InlineLibraryPlaceholder />
    case "MagicalRune":
      return <InlineLibraryPlaceholder />
    case "MagicalSign":
      return <InlineLibraryPlaceholder />
    case "MagicalSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "MagicalTradition":
      return <InlineLibraryPlaceholder />
    case "MusicalInstrument":
      return <InlineLibraryPlaceholder />
    case "OptionalRule":
      return <InlineLibraryOptionalRule id={id.optional_rule} />
    case "OrbEnchantment":
      return <InlineLibraryPlaceholder />
    case "OrienteeringAid":
      return <InlineLibraryPlaceholder />
    case "PactGift":
      return <InlineLibraryPlaceholder />
    case "PersonalityTrait":
      return <InlineLibraryPlaceholder />
    case "Poison":
      return <InlineLibraryPlaceholder />
    case "Profession":
      return <InlineLibraryPlaceholder />
    case "ProtectiveWardingCircleSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "Race":
      return <InlineLibraryPlaceholder />
    case "RangedCombatTechnique":
      return <InlineLibraryPlaceholder />
    case "RingEnchantment":
      return <InlineLibraryPlaceholder />
    case "Ritual":
      return <InlineLibraryPlaceholder />
    case "RopeOrChain":
      return <InlineLibraryPlaceholder />
    case "Sermon":
      return <InlineLibraryPlaceholder />
    case "SexSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "SickleRitual":
      return <InlineLibraryPlaceholder />
    case "SikaryanDrainSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "Skill":
      return <InlineLibrarySkill id={id.skill} />
    case "SkillStyleSpecialAbility":
      return <InlineLibraryPlaceholder />
    case "Spell":
      return <InlineLibraryPlaceholder />
    case "SpellSwordEnchantment":
      return <InlineLibraryPlaceholder />
    case "StaffEnchantment":
      return <InlineLibraryPlaceholder />
    case "ThievesTool":
      return <InlineLibraryPlaceholder />
    case "ToolOfTheTrade":
      return <InlineLibraryPlaceholder />
    case "ToyEnchantment":
      return <InlineLibraryPlaceholder />
    case "TravelGearOrTool":
      return <InlineLibraryPlaceholder />
    case "Trinkhornzauber":
      return <InlineLibraryPlaceholder />
    case "VampiricGift":
      return <InlineLibraryPlaceholder />
    case "Vehicle":
      return <InlineLibraryPlaceholder />
    case "Vision":
      return <InlineLibraryPlaceholder />
    case "WandEnchantment":
      return <InlineLibraryPlaceholder />
    case "WeaponAccessory":
      return <InlineLibraryPlaceholder />
    case "WeaponEnchantment":
      return <InlineLibraryPlaceholder />
    case "Weapon":
      return <InlineLibraryPlaceholder />
    case "ZibiljaRitual":
      return <InlineLibraryPlaceholder />
    default:
      return assertExhaustive(id)
  }
}
