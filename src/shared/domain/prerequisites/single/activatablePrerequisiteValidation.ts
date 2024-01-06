import { RequirableSelectOptionIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { PreconditionGroup } from "optolith-database-schema/types/prerequisites/PrerequisiteGroups"
import { ActivatablePrerequisite } from "optolith-database-schema/types/prerequisites/single/ActivatablePrerequisite"
import { filterNonNullable } from "../../../utils/array.ts"
import { mapNullable } from "../../../utils/nullable.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import {
  ActivatableInstance,
  equalsOptionPrerequisite,
} from "../../activatable/activatableEntry.ts"
import { GetById } from "../../getTypes.ts"

/**
 * Checks a single activatable prerequisite if it’s matched.
 */
export const checkActivatablePrerequisite = (
  caps: {
    getDynamicAdvantageById: GetById.Dynamic.Advantage
    getDynamicDisadvantageById: GetById.Dynamic.Disadvantage
    getDynamicGeneralSpecialAbilityById: GetById.Dynamic.GeneralSpecialAbility
    getDynamicFatePointSpecialAbilityById: GetById.Dynamic.FatePointSpecialAbility
    getDynamicCombatSpecialAbilityById: GetById.Dynamic.CombatSpecialAbility
    getDynamicMagicalSpecialAbilityById: GetById.Dynamic.MagicalSpecialAbility
    getDynamicStaffEnchantmentById: GetById.Dynamic.StaffEnchantment
    getDynamicFamiliarSpecialAbilityById: GetById.Dynamic.FamiliarSpecialAbility
    getDynamicKarmaSpecialAbilityById: GetById.Dynamic.KarmaSpecialAbility
    getDynamicProtectiveWardingCircleSpecialAbilityById: GetById.Dynamic.ProtectiveWardingCircleSpecialAbility
    getDynamicCombatStyleSpecialAbilityById: GetById.Dynamic.CombatStyleSpecialAbility
    getDynamicAdvancedCombatSpecialAbilityById: GetById.Dynamic.AdvancedCombatSpecialAbility
    getDynamicCommandSpecialAbilityById: GetById.Dynamic.CommandSpecialAbility
    getDynamicMagicStyleSpecialAbilityById: GetById.Dynamic.MagicStyleSpecialAbility
    getDynamicAdvancedMagicalSpecialAbilityById: GetById.Dynamic.AdvancedMagicalSpecialAbility
    getDynamicSpellSwordEnchantmentById: GetById.Dynamic.SpellSwordEnchantment
    getDynamicDaggerRitualById: GetById.Dynamic.DaggerRitual
    getDynamicInstrumentEnchantmentById: GetById.Dynamic.InstrumentEnchantment
    getDynamicAttireEnchantmentById: GetById.Dynamic.AttireEnchantment
    getDynamicOrbEnchantmentById: GetById.Dynamic.OrbEnchantment
    getDynamicWandEnchantmentById: GetById.Dynamic.WandEnchantment
    getDynamicBrawlingSpecialAbilityById: GetById.Dynamic.BrawlingSpecialAbility
    getDynamicAncestorGlyphById: GetById.Dynamic.AncestorGlyph
    getDynamicCeremonialItemSpecialAbilityById: GetById.Dynamic.CeremonialItemSpecialAbility
    getDynamicSermonById: GetById.Dynamic.Sermon
    getDynamicLiturgicalStyleSpecialAbilityById: GetById.Dynamic.LiturgicalStyleSpecialAbility
    getDynamicAdvancedKarmaSpecialAbilityById: GetById.Dynamic.AdvancedKarmaSpecialAbility
    getDynamicVisionById: GetById.Dynamic.Vision
    getDynamicMagicalTraditionById: GetById.Dynamic.MagicalTradition
    getDynamicBlessedTraditionById: GetById.Dynamic.BlessedTradition
    getDynamicPactGiftById: GetById.Dynamic.PactGift
    getDynamicSikaryanDrainSpecialAbilityById: GetById.Dynamic.SikaryanDrainSpecialAbility
    getDynamicLycantropicGiftById: GetById.Dynamic.LycantropicGift
    getDynamicSkillStyleSpecialAbilityById: GetById.Dynamic.SkillStyleSpecialAbility
    getDynamicAdvancedSkillSpecialAbilityById: GetById.Dynamic.AdvancedSkillSpecialAbility
    getDynamicArcaneOrbEnchantmentById: GetById.Dynamic.ArcaneOrbEnchantment
    getDynamicCauldronEnchantmentById: GetById.Dynamic.CauldronEnchantment
    getDynamicFoolsHatEnchantmentById: GetById.Dynamic.FoolsHatEnchantment
    getDynamicToyEnchantmentById: GetById.Dynamic.ToyEnchantment
    getDynamicBowlEnchantmentById: GetById.Dynamic.BowlEnchantment
    getDynamicFatePointSexSpecialAbilityById: GetById.Dynamic.FatePointSexSpecialAbility
    getDynamicSexSpecialAbilityById: GetById.Dynamic.SexSpecialAbility
    getDynamicWeaponEnchantmentById: GetById.Dynamic.WeaponEnchantment
    getDynamicSickleRitualById: GetById.Dynamic.SickleRitual
    getDynamicRingEnchantmentById: GetById.Dynamic.RingEnchantment
    getDynamicChronicleEnchantmentById: GetById.Dynamic.ChronicleEnchantment
    getDynamicKrallenkettenzauberById: GetById.Dynamic.Krallenkettenzauber
    getDynamicTrinkhornzauberById: GetById.Dynamic.Trinkhornzauber
    checkPrecondition: (pre: PreconditionGroup) => boolean
  },
  p: ActivatablePrerequisite,
): boolean => {
  const dynamicEntry = (() => {
    switch (p.id.tag) {
      case "Advantage":
        return caps.getDynamicAdvantageById(p.id.advantage)
      case "Disadvantage":
        return caps.getDynamicDisadvantageById(p.id.disadvantage)
      case "GeneralSpecialAbility":
        return caps.getDynamicGeneralSpecialAbilityById(p.id.general_special_ability)
      case "FatePointSpecialAbility":
        return caps.getDynamicFatePointSpecialAbilityById(p.id.fate_point_special_ability)
      case "CombatSpecialAbility":
        return caps.getDynamicCombatSpecialAbilityById(p.id.combat_special_ability)
      case "MagicalSpecialAbility":
        return caps.getDynamicMagicalSpecialAbilityById(p.id.magical_special_ability)
      case "StaffEnchantment":
        return caps.getDynamicStaffEnchantmentById(p.id.staff_enchantment)
      case "FamiliarSpecialAbility":
        return caps.getDynamicFamiliarSpecialAbilityById(p.id.familiar_special_ability)
      case "KarmaSpecialAbility":
        return caps.getDynamicKarmaSpecialAbilityById(p.id.karma_special_ability)
      case "ProtectiveWardingCircleSpecialAbility":
        return caps.getDynamicProtectiveWardingCircleSpecialAbilityById(
          p.id.protective_warding_circle_special_ability,
        )
      case "CombatStyleSpecialAbility":
        return caps.getDynamicCombatStyleSpecialAbilityById(p.id.combat_style_special_ability)
      case "AdvancedCombatSpecialAbility":
        return caps.getDynamicAdvancedCombatSpecialAbilityById(p.id.advanced_combat_special_ability)
      case "CommandSpecialAbility":
        return caps.getDynamicCommandSpecialAbilityById(p.id.command_special_ability)
      case "MagicStyleSpecialAbility":
        return caps.getDynamicMagicStyleSpecialAbilityById(p.id.magic_style_special_ability)
      case "AdvancedMagicalSpecialAbility":
        return caps.getDynamicAdvancedMagicalSpecialAbilityById(
          p.id.advanced_magical_special_ability,
        )
      case "SpellSwordEnchantment":
        return caps.getDynamicSpellSwordEnchantmentById(p.id.spell_sword_enchantment)
      case "DaggerRitual":
        return caps.getDynamicDaggerRitualById(p.id.dagger_ritual)
      case "InstrumentEnchantment":
        return caps.getDynamicInstrumentEnchantmentById(p.id.instrument_enchantment)
      case "AttireEnchantment":
        return caps.getDynamicAttireEnchantmentById(p.id.attire_enchantment)
      case "OrbEnchantment":
        return caps.getDynamicOrbEnchantmentById(p.id.orb_enchantment)
      case "WandEnchantment":
        return caps.getDynamicWandEnchantmentById(p.id.wand_enchantment)
      case "BrawlingSpecialAbility":
        return caps.getDynamicBrawlingSpecialAbilityById(p.id.brawling_special_ability)
      case "AncestorGlyph":
        return caps.getDynamicAncestorGlyphById(p.id.ancestor_glyph)
      case "CeremonialItemSpecialAbility":
        return caps.getDynamicCeremonialItemSpecialAbilityById(p.id.ceremonial_item_special_ability)
      case "Sermon":
        return caps.getDynamicSermonById(p.id.sermon)
      case "LiturgicalStyleSpecialAbility":
        return caps.getDynamicLiturgicalStyleSpecialAbilityById(
          p.id.liturgical_style_special_ability,
        )
      case "AdvancedKarmaSpecialAbility":
        return caps.getDynamicAdvancedKarmaSpecialAbilityById(p.id.advanced_karma_special_ability)
      case "Vision":
        return caps.getDynamicVisionById(p.id.vision)
      case "MagicalTradition":
        return caps.getDynamicMagicalTraditionById(p.id.magical_tradition)
      case "BlessedTradition":
        return caps.getDynamicBlessedTraditionById(p.id.blessed_tradition)
      case "PactGift":
        return caps.getDynamicPactGiftById(p.id.pact_gift)
      case "SikaryanDrainSpecialAbility":
        return caps.getDynamicSikaryanDrainSpecialAbilityById(p.id.sikaryan_drain_special_ability)
      case "LycantropicGift":
        return caps.getDynamicLycantropicGiftById(p.id.lycantropic_gift)
      case "SkillStyleSpecialAbility":
        return caps.getDynamicSkillStyleSpecialAbilityById(p.id.skill_style_special_ability)
      case "AdvancedSkillSpecialAbility":
        return caps.getDynamicAdvancedSkillSpecialAbilityById(p.id.advanced_skill_special_ability)
      case "ArcaneOrbEnchantment":
        return caps.getDynamicArcaneOrbEnchantmentById(p.id.arcane_orb_enchantment)
      case "CauldronEnchantment":
        return caps.getDynamicCauldronEnchantmentById(p.id.cauldron_enchantment)
      case "FoolsHatEnchantment":
        return caps.getDynamicFoolsHatEnchantmentById(p.id.fools_hat_enchantment)
      case "ToyEnchantment":
        return caps.getDynamicToyEnchantmentById(p.id.toy_enchantment)
      case "BowlEnchantment":
        return caps.getDynamicBowlEnchantmentById(p.id.bowl_enchantment)
      case "FatePointSexSpecialAbility":
        return caps.getDynamicFatePointSexSpecialAbilityById(p.id.fate_point_sex_special_ability)
      case "SexSpecialAbility":
        return caps.getDynamicSexSpecialAbilityById(p.id.sex_special_ability)
      case "WeaponEnchantment":
        return caps.getDynamicWeaponEnchantmentById(p.id.weapon_enchantment)
      case "SickleRitual":
        return caps.getDynamicSickleRitualById(p.id.sickle_ritual)
      case "RingEnchantment":
        return caps.getDynamicRingEnchantmentById(p.id.ring_enchantment)
      case "ChronicleEnchantment":
        return caps.getDynamicChronicleEnchantmentById(p.id.chronicle_enchantment)
      case "Krallenkettenzauber":
        return caps.getDynamicKrallenkettenzauberById(p.id.krallenkettenzauber)
      case "Trinkhornzauber":
        return caps.getDynamicTrinkhornzauberById(p.id.trinkhornzauber)
      default:
        return assertExhaustive(p.id)
    }
  })()

  if (p.when !== undefined && !p.when.every(pre => caps.checkPrecondition(pre))) {
    // ignore if precondition is not met
    return true
  }

  if (p.level === undefined && p.options === undefined) {
    // Shortcut for the most common case
    const isActive = dynamicEntry !== undefined && dynamicEntry.instances.length > 0
    return isActive === p.active
  }

  const checkLevel = (pLevel: number, i: ActivatableInstance): boolean =>
    i.level !== undefined && i.level >= pLevel

  const checkOptions = (
    pOptions: RequirableSelectOptionIdentifier[],
    i: ActivatableInstance,
  ): boolean =>
    pOptions.every((option, index) => {
      const instanceOption = i.options?.[index]
      return (
        instanceOption?.type === "Predefined" && equalsOptionPrerequisite(instanceOption.id, option)
      )
    })

  // all checks must satisfy, if applicable depending on the prerequisite
  const checks: ((i: ActivatableInstance) => boolean)[] = filterNonNullable([
    mapNullable(p.level, pLevel => i => checkLevel(pLevel, i)),
    mapNullable(p.options, pOptions => i => checkOptions(pOptions, i)),
  ])

  if (dynamicEntry === undefined) {
    // shortcut for a complex prerequisite but the dynamic entry does not exist
    // at all
    return !p.active
  }

  // for at least one instance, all applicable checks must be satified if it
  // should be active, or it must not be satisfied for all instances if it
  // should not be active
  return dynamicEntry.instances.some(i => checks.every(f => f(i))) === p.active
}
