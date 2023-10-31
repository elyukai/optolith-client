import { Advantage } from "optolith-database-schema/types/Advantage"
import { Ceremony } from "optolith-database-schema/types/Ceremony"
import { Disadvantage } from "optolith-database-schema/types/Disadvantage"
import { LiturgicalChant } from "optolith-database-schema/types/LiturgicalChant"
import { Ritual } from "optolith-database-schema/types/Ritual"
import { Spell } from "optolith-database-schema/types/Spell"
import {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import {
  PlainPrerequisites,
  PrerequisitesForLevels,
} from "optolith-database-schema/types/_Prerequisite"
import { AdvancedCombatSpecialAbility } from "optolith-database-schema/types/specialAbility/AdvancedCombatSpecialAbility"
import { AdvancedKarmaSpecialAbility } from "optolith-database-schema/types/specialAbility/AdvancedKarmaSpecialAbility"
import { AdvancedMagicalSpecialAbility } from "optolith-database-schema/types/specialAbility/AdvancedMagicalSpecialAbility"
import { AdvancedSkillSpecialAbility } from "optolith-database-schema/types/specialAbility/AdvancedSkillSpecialAbility"
import { AncestorGlyph } from "optolith-database-schema/types/specialAbility/AncestorGlyph"
import { BlessedTradition } from "optolith-database-schema/types/specialAbility/BlessedTradition"
import { BrawlingSpecialAbility } from "optolith-database-schema/types/specialAbility/BrawlingSpecialAbility"
import { CeremonialItemSpecialAbility } from "optolith-database-schema/types/specialAbility/CeremonialItemSpecialAbility"
import { CombatSpecialAbility } from "optolith-database-schema/types/specialAbility/CombatSpecialAbility"
import { CombatStyleSpecialAbility } from "optolith-database-schema/types/specialAbility/CombatStyleSpecialAbility"
import { CommandSpecialAbility } from "optolith-database-schema/types/specialAbility/CommandSpecialAbility"
import { FamiliarSpecialAbility } from "optolith-database-schema/types/specialAbility/FamiliarSpecialAbility"
import { FatePointSexSpecialAbility } from "optolith-database-schema/types/specialAbility/FatePointSexSpecialAbility"
import { FatePointSpecialAbility } from "optolith-database-schema/types/specialAbility/FatePointSpecialAbility"
import { GeneralSpecialAbility } from "optolith-database-schema/types/specialAbility/GeneralSpecialAbility"
import { KarmaSpecialAbility } from "optolith-database-schema/types/specialAbility/KarmaSpecialAbility"
import { LiturgicalStyleSpecialAbility } from "optolith-database-schema/types/specialAbility/LiturgicalStyleSpecialAbility"
import { LycantropicGift } from "optolith-database-schema/types/specialAbility/LycantropicGift"
import { MagicStyleSpecialAbility } from "optolith-database-schema/types/specialAbility/MagicStyleSpecialAbility"
import { MagicalSpecialAbility } from "optolith-database-schema/types/specialAbility/MagicalSpecialAbility"
import { MagicalTradition } from "optolith-database-schema/types/specialAbility/MagicalTradition"
import { PactGift } from "optolith-database-schema/types/specialAbility/PactGift"
import { ProtectiveWardingCircleSpecialAbility } from "optolith-database-schema/types/specialAbility/ProtectiveWardingCircleSpecialAbility"
import { Sermon } from "optolith-database-schema/types/specialAbility/Sermon"
import { SexSpecialAbility } from "optolith-database-schema/types/specialAbility/SexSpecialAbility"
import { SikaryanDrainSpecialAbility } from "optolith-database-schema/types/specialAbility/SikaryanDrainSpecialAbility"
import { SkillStyleSpecialAbility } from "optolith-database-schema/types/specialAbility/SkillStyleSpecialAbility"
import { Vision } from "optolith-database-schema/types/specialAbility/Vision"
import { ArcaneOrbEnchantment } from "optolith-database-schema/types/traditionArtifacts/ArcaneOrbEnchantment"
import { AttireEnchantment } from "optolith-database-schema/types/traditionArtifacts/AttireEnchantment"
import { BowlEnchantment } from "optolith-database-schema/types/traditionArtifacts/BowlEnchantment"
import { CauldronEnchantment } from "optolith-database-schema/types/traditionArtifacts/CauldronEnchantment"
import { ChronicleEnchantment } from "optolith-database-schema/types/traditionArtifacts/ChronicleEnchantment"
import { DaggerRitual } from "optolith-database-schema/types/traditionArtifacts/DaggerRitual"
import { FoolsHatEnchantment } from "optolith-database-schema/types/traditionArtifacts/FoolsHatEnchantment"
import { InstrumentEnchantment } from "optolith-database-schema/types/traditionArtifacts/InstrumentEnchantment"
import { Krallenkettenzauber } from "optolith-database-schema/types/traditionArtifacts/Krallenkettenzauber"
import { OrbEnchantment } from "optolith-database-schema/types/traditionArtifacts/OrbEnchantment"
import { RingEnchantment } from "optolith-database-schema/types/traditionArtifacts/RingEnchantment"
import { SickleRitual } from "optolith-database-schema/types/traditionArtifacts/SickleRitual"
import { SpellSwordEnchantment } from "optolith-database-schema/types/traditionArtifacts/SpellSwordEnchantment"
import { StaffEnchantment } from "optolith-database-schema/types/traditionArtifacts/StaffEnchantment"
import { ToyEnchantment } from "optolith-database-schema/types/traditionArtifacts/ToyEnchantment"
import { Trinkhornzauber } from "optolith-database-schema/types/traditionArtifacts/Trinkhornzauber"
import { WandEnchantment } from "optolith-database-schema/types/traditionArtifacts/WandEnchantment"
import { WeaponEnchantment } from "optolith-database-schema/types/traditionArtifacts/WeaponEnchantment"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { checkIfMultipleDisjunctionPartsAreValid } from "./prerequisiteCombinatorValidation.ts"
import {
  checkPrerequisiteOfAdvantageOrDisadvantage,
  checkPrerequisiteOfGeneralEntry,
  checkPrerequisiteOfLiturgy,
  checkPrerequisiteOfSpellwork,
} from "./prerequisiteValidationForType.ts"

const checkPlainPrerequisite = <
  P,
  T extends { prerequisites?: PlainPrerequisites<P> } | undefined,
  C,
  O extends unknown[],
>(
  validateSingleForType: (caps: C, p: P, ...other: O) => boolean,
  entry: T,
  index: number,
  caps: C,
  ...other: O
): boolean => {
  const prerequisite = entry?.prerequisites?.[index]

  if (prerequisite === undefined) {
    return true
  }

  return checkIfMultipleDisjunctionPartsAreValid(prerequisite, p =>
    validateSingleForType(caps, p, ...other),
  )
}

const checkLevelPrerequisite = <
  P,
  T extends { prerequisites?: PrerequisitesForLevels<P> } | undefined,
  C,
  O extends unknown[],
>(
  validateSingleForType: (caps: C, p: P, ...other: O) => boolean,
  entry: T,
  index: number,
  caps: C,
  ...other: O
): boolean => {
  const prerequisite = entry?.prerequisites?.[index]

  if (prerequisite === undefined) {
    return true
  }

  return checkIfMultipleDisjunctionPartsAreValid(prerequisite.prerequisite, p =>
    validateSingleForType(caps, p, ...other),
  )
}

/**
 * Checks if other parts of a disjunction are valid, so that a dependency from
 * that disjunction can be ignored.
 */
export const checkMultipleDisjunctionPartsAreValid =
  (
    caps: {
      getStaticAdvantage: (id: number) => Advantage | undefined
      getStaticDisadvantage: (id: number) => Disadvantage | undefined
      getStaticGeneralSpecialAbility: (id: number) => GeneralSpecialAbility | undefined
      getStaticFatePointSpecialAbility: (id: number) => FatePointSpecialAbility | undefined
      getStaticCombatSpecialAbility: (id: number) => CombatSpecialAbility | undefined
      getStaticMagicalSpecialAbility: (id: number) => MagicalSpecialAbility | undefined
      getStaticStaffEnchantment: (id: number) => StaffEnchantment | undefined
      getStaticFamiliarSpecialAbility: (id: number) => FamiliarSpecialAbility | undefined
      getStaticKarmaSpecialAbility: (id: number) => KarmaSpecialAbility | undefined
      getStaticProtectiveWardingCircleSpecialAbility: (
        id: number,
      ) => ProtectiveWardingCircleSpecialAbility | undefined
      getStaticCombatStyleSpecialAbility: (id: number) => CombatStyleSpecialAbility | undefined
      getStaticAdvancedCombatSpecialAbility: (
        id: number,
      ) => AdvancedCombatSpecialAbility | undefined
      getStaticCommandSpecialAbility: (id: number) => CommandSpecialAbility | undefined
      getStaticMagicStyleSpecialAbility: (id: number) => MagicStyleSpecialAbility | undefined
      getStaticAdvancedMagicalSpecialAbility: (
        id: number,
      ) => AdvancedMagicalSpecialAbility | undefined
      getStaticSpellSwordEnchantment: (id: number) => SpellSwordEnchantment | undefined
      getStaticDaggerRitual: (id: number) => DaggerRitual | undefined
      getStaticInstrumentEnchantment: (id: number) => InstrumentEnchantment | undefined
      getStaticAttireEnchantment: (id: number) => AttireEnchantment | undefined
      getStaticOrbEnchantment: (id: number) => OrbEnchantment | undefined
      getStaticWandEnchantment: (id: number) => WandEnchantment | undefined
      getStaticBrawlingSpecialAbility: (id: number) => BrawlingSpecialAbility | undefined
      getStaticAncestorGlyph: (id: number) => AncestorGlyph | undefined
      getStaticCeremonialItemSpecialAbility: (
        id: number,
      ) => CeremonialItemSpecialAbility | undefined
      getStaticSermon: (id: number) => Sermon | undefined
      getStaticLiturgicalStyleSpecialAbility: (
        id: number,
      ) => LiturgicalStyleSpecialAbility | undefined
      getStaticAdvancedKarmaSpecialAbility: (id: number) => AdvancedKarmaSpecialAbility | undefined
      getStaticVision: (id: number) => Vision | undefined
      getStaticMagicalTradition: (id: number) => MagicalTradition | undefined
      getStaticBlessedTradition: (id: number) => BlessedTradition | undefined
      getStaticPactGift: (id: number) => PactGift | undefined
      getStaticSikaryanDrainSpecialAbility: (id: number) => SikaryanDrainSpecialAbility | undefined
      getStaticLycantropicGift: (id: number) => LycantropicGift | undefined
      getStaticSkillStyleSpecialAbility: (id: number) => SkillStyleSpecialAbility | undefined
      getStaticAdvancedSkillSpecialAbility: (id: number) => AdvancedSkillSpecialAbility | undefined
      getStaticArcaneOrbEnchantment: (id: number) => ArcaneOrbEnchantment | undefined
      getStaticCauldronEnchantment: (id: number) => CauldronEnchantment | undefined
      getStaticFoolsHatEnchantment: (id: number) => FoolsHatEnchantment | undefined
      getStaticToyEnchantment: (id: number) => ToyEnchantment | undefined
      getStaticBowlEnchantment: (id: number) => BowlEnchantment | undefined
      getStaticFatePointSexSpecialAbility: (id: number) => FatePointSexSpecialAbility | undefined
      getStaticSexSpecialAbility: (id: number) => SexSpecialAbility | undefined
      getStaticWeaponEnchantment: (id: number) => WeaponEnchantment | undefined
      getStaticSickleRitual: (id: number) => SickleRitual | undefined
      getStaticRingEnchantment: (id: number) => RingEnchantment | undefined
      getStaticChronicleEnchantment: (id: number) => ChronicleEnchantment | undefined
      getStaticKrallenkettenzauber: (id: number) => Krallenkettenzauber | undefined
      getStaticTrinkhornzauber: (id: number) => Trinkhornzauber | undefined
      getStaticSpell: (id: number) => Spell | undefined
      getStaticRitual: (id: number) => Ritual | undefined
      getStaticLiturgicalChant: (id: number) => LiturgicalChant | undefined
      getStaticCeremony: (id: number) => Ceremony | undefined
    } & Parameters<typeof checkPrerequisiteOfAdvantageOrDisadvantage>[0] &
      Parameters<typeof checkPrerequisiteOfGeneralEntry>[0] &
      Parameters<typeof checkPrerequisiteOfSpellwork>[0] &
      Parameters<typeof checkPrerequisiteOfLiturgy>[0],
  ) =>
  (source: ActivatableIdentifier | SkillWithEnhancementsIdentifier, index: number): boolean => {
    switch (source.tag) {
      case "Advantage":
        return checkLevelPrerequisite(
          checkPrerequisiteOfAdvantageOrDisadvantage,
          caps.getStaticAdvantage(source.advantage),
          index,
          caps,
          "Advantage",
          source.advantage,
        )
      case "Disadvantage":
        return checkLevelPrerequisite(
          checkPrerequisiteOfAdvantageOrDisadvantage,
          caps.getStaticDisadvantage(source.disadvantage),
          index,
          caps,
          "Disadvantage",
          source.disadvantage,
        )
      case "GeneralSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticGeneralSpecialAbility(source.general_special_ability),
          index,
          caps,
        )
      case "FatePointSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticFatePointSpecialAbility(source.fate_point_special_ability),
          index,
          caps,
        )
      case "CombatSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticCombatSpecialAbility(source.combat_special_ability),
          index,
          caps,
        )
      case "MagicalSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticMagicalSpecialAbility(source.magical_special_ability),
          index,
          caps,
        )
      case "StaffEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticStaffEnchantment(source.staff_enchantment),
          index,
          caps,
        )
      case "FamiliarSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticFamiliarSpecialAbility(source.familiar_special_ability),
          index,
          caps,
        )
      case "KarmaSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticKarmaSpecialAbility(source.karma_special_ability),
          index,
          caps,
        )
      case "ProtectiveWardingCircleSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticProtectiveWardingCircleSpecialAbility(
            source.protective_warding_circle_special_ability,
          ),
          index,
          caps,
        )
      case "CombatStyleSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticCombatStyleSpecialAbility(source.combat_style_special_ability),
          index,
          caps,
        )
      case "AdvancedCombatSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAdvancedCombatSpecialAbility(source.advanced_combat_special_ability),
          index,
          caps,
        )
      case "CommandSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticCommandSpecialAbility(source.command_special_ability),
          index,
          caps,
        )
      case "MagicStyleSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticMagicStyleSpecialAbility(source.magic_style_special_ability),
          index,
          caps,
        )
      case "AdvancedMagicalSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAdvancedMagicalSpecialAbility(source.advanced_magical_special_ability),
          index,
          caps,
        )
      case "SpellSwordEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSpellSwordEnchantment(source.spell_sword_enchantment),
          index,
          caps,
        )
      case "DaggerRitual":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticDaggerRitual(source.dagger_ritual),
          index,
          caps,
        )
      case "InstrumentEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticInstrumentEnchantment(source.instrument_enchantment),
          index,
          caps,
        )
      case "AttireEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAttireEnchantment(source.attire_enchantment),
          index,
          caps,
        )
      case "OrbEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticOrbEnchantment(source.orb_enchantment),
          index,
          caps,
        )
      case "WandEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticWandEnchantment(source.wand_enchantment),
          index,
          caps,
        )
      case "BrawlingSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticBrawlingSpecialAbility(source.brawling_special_ability),
          index,
          caps,
        )
      case "AncestorGlyph":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAncestorGlyph(source.ancestor_glyph),
          index,
          caps,
        )
      case "CeremonialItemSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticCeremonialItemSpecialAbility(source.ceremonial_item_special_ability),
          index,
          caps,
        )
      case "Sermon":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSermon(source.sermon),
          index,
          caps,
        )
      case "LiturgicalStyleSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticLiturgicalStyleSpecialAbility(source.liturgical_style_special_ability),
          index,
          caps,
        )
      case "AdvancedKarmaSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAdvancedKarmaSpecialAbility(source.advanced_karma_special_ability),
          index,
          caps,
        )
      case "Vision":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticVision(source.vision),
          index,
          caps,
        )
      case "MagicalTradition":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticMagicalTradition(source.magical_tradition),
          index,
          caps,
        )
      case "BlessedTradition":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticBlessedTradition(source.blessed_tradition),
          index,
          caps,
        )
      case "PactGift":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticPactGift(source.pact_gift),
          index,
          caps,
        )
      case "SikaryanDrainSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSikaryanDrainSpecialAbility(source.sikaryan_drain_special_ability),
          index,
          caps,
        )
      case "LycantropicGift":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticLycantropicGift(source.lycantropic_gift),
          index,
          caps,
        )
      case "SkillStyleSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSkillStyleSpecialAbility(source.skill_style_special_ability),
          index,
          caps,
        )
      case "AdvancedSkillSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAdvancedSkillSpecialAbility(source.advanced_skill_special_ability),
          index,
          caps,
        )
      case "ArcaneOrbEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticArcaneOrbEnchantment(source.arcane_orb_enchantment),
          index,
          caps,
        )
      case "CauldronEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticCauldronEnchantment(source.cauldron_enchantment),
          index,
          caps,
        )
      case "FoolsHatEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticFoolsHatEnchantment(source.fools_hat_enchantment),
          index,
          caps,
        )
      case "ToyEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticToyEnchantment(source.toy_enchantment),
          index,
          caps,
        )
      case "BowlEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticBowlEnchantment(source.bowl_enchantment),
          index,
          caps,
        )
      case "FatePointSexSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticFatePointSexSpecialAbility(source.fate_point_sex_special_ability),
          index,
          caps,
        )
      case "SexSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSexSpecialAbility(source.sex_special_ability),
          index,
          caps,
        )
      case "WeaponEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticWeaponEnchantment(source.weapon_enchantment),
          index,
          caps,
        )
      case "SickleRitual":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSickleRitual(source.sickle_ritual),
          index,
          caps,
        )
      case "RingEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticRingEnchantment(source.ring_enchantment),
          index,
          caps,
        )
      case "ChronicleEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticChronicleEnchantment(source.chronicle_enchantment),
          index,
          caps,
        )
      case "Krallenkettenzauber":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticKrallenkettenzauber(source.krallenkettenzauber),
          index,
          caps,
        )
      case "Trinkhornzauber":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticTrinkhornzauber(source.trinkhornzauber),
          index,
          caps,
        )
      case "Spell":
        return checkPlainPrerequisite(
          checkPrerequisiteOfSpellwork,
          caps.getStaticSpell(source.spell),
          index,
          caps,
        )
      case "Ritual":
        return checkPlainPrerequisite(
          checkPrerequisiteOfSpellwork,
          caps.getStaticRitual(source.ritual),
          index,
          caps,
        )
      case "LiturgicalChant":
        return checkPlainPrerequisite(
          checkPrerequisiteOfLiturgy,
          caps.getStaticLiturgicalChant(source.liturgical_chant),
          index,
          caps,
        )
      case "Ceremony":
        return checkPlainPrerequisite(
          checkPrerequisiteOfLiturgy,
          caps.getStaticCeremony(source.ceremony),
          index,
          caps,
        )
      default:
        return assertExhaustive(source)
    }
  }
