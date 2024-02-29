import {
  ActivatableIdentifier,
  SkillWithEnhancementsIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import {
  PlainPrerequisites,
  PrerequisitesForLevels,
} from "optolith-database-schema/types/_Prerequisite"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { GetById } from "../getTypes.ts"
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
      getStaticAdvantageById: GetById.Static.Advantage
      getStaticDisadvantageById: GetById.Static.Disadvantage
      getStaticGeneralSpecialAbilityById: GetById.Static.GeneralSpecialAbility
      getStaticFatePointSpecialAbilityById: GetById.Static.FatePointSpecialAbility
      getStaticCombatSpecialAbilityById: GetById.Static.CombatSpecialAbility
      getStaticMagicalSpecialAbilityById: GetById.Static.MagicalSpecialAbility
      getStaticStaffEnchantmentById: GetById.Static.StaffEnchantment
      getStaticFamiliarSpecialAbilityById: GetById.Static.FamiliarSpecialAbility
      getStaticKarmaSpecialAbilityById: GetById.Static.KarmaSpecialAbility
      getStaticProtectiveWardingCircleSpecialAbilityById: GetById.Static.ProtectiveWardingCircleSpecialAbility
      getStaticCombatStyleSpecialAbilityById: GetById.Static.CombatStyleSpecialAbility
      getStaticAdvancedCombatSpecialAbilityById: GetById.Static.AdvancedCombatSpecialAbility
      getStaticCommandSpecialAbilityById: GetById.Static.CommandSpecialAbility
      getStaticMagicStyleSpecialAbilityById: GetById.Static.MagicStyleSpecialAbility
      getStaticAdvancedMagicalSpecialAbilityById: GetById.Static.AdvancedMagicalSpecialAbility
      getStaticSpellSwordEnchantmentById: GetById.Static.SpellSwordEnchantment
      getStaticDaggerRitualById: GetById.Static.DaggerRitual
      getStaticInstrumentEnchantmentById: GetById.Static.InstrumentEnchantment
      getStaticAttireEnchantmentById: GetById.Static.AttireEnchantment
      getStaticOrbEnchantmentById: GetById.Static.OrbEnchantment
      getStaticWandEnchantmentById: GetById.Static.WandEnchantment
      getStaticBrawlingSpecialAbilityById: GetById.Static.BrawlingSpecialAbility
      getStaticAncestorGlyphById: GetById.Static.AncestorGlyph
      getStaticCeremonialItemSpecialAbilityById: GetById.Static.CeremonialItemSpecialAbility
      getStaticSermonById: GetById.Static.Sermon
      getStaticLiturgicalStyleSpecialAbilityById: GetById.Static.LiturgicalStyleSpecialAbility
      getStaticAdvancedKarmaSpecialAbilityById: GetById.Static.AdvancedKarmaSpecialAbility
      getStaticVisionById: GetById.Static.Vision
      getStaticMagicalTraditionById: GetById.Static.MagicalTradition
      getStaticBlessedTraditionById: GetById.Static.BlessedTradition
      getStaticPactGiftById: GetById.Static.PactGift
      getStaticVampiricGiftById: GetById.Static.VampiricGift
      getStaticSikaryanDrainSpecialAbilityById: GetById.Static.SikaryanDrainSpecialAbility
      getStaticLycantropicGiftById: GetById.Static.LycantropicGift
      getStaticSkillStyleSpecialAbilityById: GetById.Static.SkillStyleSpecialAbility
      getStaticAdvancedSkillSpecialAbilityById: GetById.Static.AdvancedSkillSpecialAbility
      getStaticArcaneOrbEnchantmentById: GetById.Static.ArcaneOrbEnchantment
      getStaticCauldronEnchantmentById: GetById.Static.CauldronEnchantment
      getStaticFoolsHatEnchantmentById: GetById.Static.FoolsHatEnchantment
      getStaticToyEnchantmentById: GetById.Static.ToyEnchantment
      getStaticBowlEnchantmentById: GetById.Static.BowlEnchantment
      getStaticFatePointSexSpecialAbilityById: GetById.Static.FatePointSexSpecialAbility
      getStaticSexSpecialAbilityById: GetById.Static.SexSpecialAbility
      getStaticWeaponEnchantmentById: GetById.Static.WeaponEnchantment
      getStaticSickleRitualById: GetById.Static.SickleRitual
      getStaticRingEnchantmentById: GetById.Static.RingEnchantment
      getStaticChronicleEnchantmentById: GetById.Static.ChronicleEnchantment
      getStaticKrallenkettenzauberById: GetById.Static.Krallenkettenzauber
      getStaticTrinkhornzauberById: GetById.Static.Trinkhornzauber
      getStaticMagicalSignById: GetById.Static.MagicalSign
      getStaticSpellById: GetById.Static.Spell
      getStaticRitualById: GetById.Static.Ritual
      getStaticLiturgicalChantById: GetById.Static.LiturgicalChant
      getStaticCeremonyById: GetById.Static.Ceremony
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
          caps.getStaticAdvantageById(source.advantage),
          index,
          caps,
          "Advantage",
          source.advantage,
        )
      case "Disadvantage":
        return checkLevelPrerequisite(
          checkPrerequisiteOfAdvantageOrDisadvantage,
          caps.getStaticDisadvantageById(source.disadvantage),
          index,
          caps,
          "Disadvantage",
          source.disadvantage,
        )
      case "GeneralSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticGeneralSpecialAbilityById(source.general_special_ability),
          index,
          caps,
        )
      case "FatePointSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticFatePointSpecialAbilityById(source.fate_point_special_ability),
          index,
          caps,
        )
      case "CombatSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticCombatSpecialAbilityById(source.combat_special_ability),
          index,
          caps,
        )
      case "MagicalSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticMagicalSpecialAbilityById(source.magical_special_ability),
          index,
          caps,
        )
      case "StaffEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticStaffEnchantmentById(source.staff_enchantment),
          index,
          caps,
        )
      case "FamiliarSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticFamiliarSpecialAbilityById(source.familiar_special_ability),
          index,
          caps,
        )
      case "KarmaSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticKarmaSpecialAbilityById(source.karma_special_ability),
          index,
          caps,
        )
      case "ProtectiveWardingCircleSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticProtectiveWardingCircleSpecialAbilityById(
            source.protective_warding_circle_special_ability,
          ),
          index,
          caps,
        )
      case "CombatStyleSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticCombatStyleSpecialAbilityById(source.combat_style_special_ability),
          index,
          caps,
        )
      case "AdvancedCombatSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAdvancedCombatSpecialAbilityById(source.advanced_combat_special_ability),
          index,
          caps,
        )
      case "CommandSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticCommandSpecialAbilityById(source.command_special_ability),
          index,
          caps,
        )
      case "MagicStyleSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticMagicStyleSpecialAbilityById(source.magic_style_special_ability),
          index,
          caps,
        )
      case "AdvancedMagicalSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAdvancedMagicalSpecialAbilityById(source.advanced_magical_special_ability),
          index,
          caps,
        )
      case "SpellSwordEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSpellSwordEnchantmentById(source.spell_sword_enchantment),
          index,
          caps,
        )
      case "DaggerRitual":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticDaggerRitualById(source.dagger_ritual),
          index,
          caps,
        )
      case "InstrumentEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticInstrumentEnchantmentById(source.instrument_enchantment),
          index,
          caps,
        )
      case "AttireEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAttireEnchantmentById(source.attire_enchantment),
          index,
          caps,
        )
      case "OrbEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticOrbEnchantmentById(source.orb_enchantment),
          index,
          caps,
        )
      case "WandEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticWandEnchantmentById(source.wand_enchantment),
          index,
          caps,
        )
      case "BrawlingSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticBrawlingSpecialAbilityById(source.brawling_special_ability),
          index,
          caps,
        )
      case "AncestorGlyph":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAncestorGlyphById(source.ancestor_glyph),
          index,
          caps,
        )
      case "CeremonialItemSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticCeremonialItemSpecialAbilityById(source.ceremonial_item_special_ability),
          index,
          caps,
        )
      case "Sermon":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSermonById(source.sermon),
          index,
          caps,
        )
      case "LiturgicalStyleSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticLiturgicalStyleSpecialAbilityById(source.liturgical_style_special_ability),
          index,
          caps,
        )
      case "AdvancedKarmaSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAdvancedKarmaSpecialAbilityById(source.advanced_karma_special_ability),
          index,
          caps,
        )
      case "Vision":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticVisionById(source.vision),
          index,
          caps,
        )
      case "MagicalTradition":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticMagicalTraditionById(source.magical_tradition),
          index,
          caps,
        )
      case "BlessedTradition":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticBlessedTraditionById(source.blessed_tradition),
          index,
          caps,
        )
      case "PactGift":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticPactGiftById(source.pact_gift),
          index,
          caps,
        )
      case "VampiricGift":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticVampiricGiftById(source.vampiric_gift),
          index,
          caps,
        )
      case "SikaryanDrainSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSikaryanDrainSpecialAbilityById(source.sikaryan_drain_special_ability),
          index,
          caps,
        )
      case "LycantropicGift":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticLycantropicGiftById(source.lycantropic_gift),
          index,
          caps,
        )
      case "SkillStyleSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSkillStyleSpecialAbilityById(source.skill_style_special_ability),
          index,
          caps,
        )
      case "AdvancedSkillSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticAdvancedSkillSpecialAbilityById(source.advanced_skill_special_ability),
          index,
          caps,
        )
      case "ArcaneOrbEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticArcaneOrbEnchantmentById(source.arcane_orb_enchantment),
          index,
          caps,
        )
      case "CauldronEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticCauldronEnchantmentById(source.cauldron_enchantment),
          index,
          caps,
        )
      case "FoolsHatEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticFoolsHatEnchantmentById(source.fools_hat_enchantment),
          index,
          caps,
        )
      case "ToyEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticToyEnchantmentById(source.toy_enchantment),
          index,
          caps,
        )
      case "BowlEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticBowlEnchantmentById(source.bowl_enchantment),
          index,
          caps,
        )
      case "FatePointSexSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticFatePointSexSpecialAbilityById(source.fate_point_sex_special_ability),
          index,
          caps,
        )
      case "SexSpecialAbility":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSexSpecialAbilityById(source.sex_special_ability),
          index,
          caps,
        )
      case "WeaponEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticWeaponEnchantmentById(source.weapon_enchantment),
          index,
          caps,
        )
      case "SickleRitual":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticSickleRitualById(source.sickle_ritual),
          index,
          caps,
        )
      case "RingEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticRingEnchantmentById(source.ring_enchantment),
          index,
          caps,
        )
      case "ChronicleEnchantment":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticChronicleEnchantmentById(source.chronicle_enchantment),
          index,
          caps,
        )
      case "Krallenkettenzauber":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticKrallenkettenzauberById(source.krallenkettenzauber),
          index,
          caps,
        )
      case "Trinkhornzauber":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticTrinkhornzauberById(source.trinkhornzauber),
          index,
          caps,
        )
      case "MagicalSign":
        return checkLevelPrerequisite(
          checkPrerequisiteOfGeneralEntry,
          caps.getStaticMagicalSignById(source.magical_sign),
          index,
          caps,
        )
      case "Spell":
        return checkPlainPrerequisite(
          checkPrerequisiteOfSpellwork,
          caps.getStaticSpellById(source.spell),
          index,
          caps,
        )
      case "Ritual":
        return checkPlainPrerequisite(
          checkPrerequisiteOfSpellwork,
          caps.getStaticRitualById(source.ritual),
          index,
          caps,
        )
      case "LiturgicalChant":
        return checkPlainPrerequisite(
          checkPrerequisiteOfLiturgy,
          caps.getStaticLiturgicalChantById(source.liturgical_chant),
          index,
          caps,
        )
      case "Ceremony":
        return checkPlainPrerequisite(
          checkPrerequisiteOfLiturgy,
          caps.getStaticCeremonyById(source.ceremony),
          index,
          caps,
        )
      default:
        return assertExhaustive(source)
    }
  }
