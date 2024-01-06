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
    getDynamicAdvantage: GetById.Dynamic.Advantage
    getDynamicDisadvantage: GetById.Dynamic.Disadvantage
    getDynamicGeneralSpecialAbility: GetById.Dynamic.GeneralSpecialAbility
    getDynamicFatePointSpecialAbility: GetById.Dynamic.FatePointSpecialAbility
    getDynamicCombatSpecialAbility: GetById.Dynamic.CombatSpecialAbility
    getDynamicMagicalSpecialAbility: GetById.Dynamic.MagicalSpecialAbility
    getDynamicStaffEnchantment: GetById.Dynamic.StaffEnchantment
    getDynamicFamiliarSpecialAbility: GetById.Dynamic.FamiliarSpecialAbility
    getDynamicKarmaSpecialAbility: GetById.Dynamic.KarmaSpecialAbility
    getDynamicProtectiveWardingCircleSpecialAbility: GetById.Dynamic.ProtectiveWardingCircleSpecialAbility
    getDynamicCombatStyleSpecialAbility: GetById.Dynamic.CombatStyleSpecialAbility
    getDynamicAdvancedCombatSpecialAbility: GetById.Dynamic.AdvancedCombatSpecialAbility
    getDynamicCommandSpecialAbility: GetById.Dynamic.CommandSpecialAbility
    getDynamicMagicStyleSpecialAbility: GetById.Dynamic.MagicStyleSpecialAbility
    getDynamicAdvancedMagicalSpecialAbility: GetById.Dynamic.AdvancedMagicalSpecialAbility
    getDynamicSpellSwordEnchantment: GetById.Dynamic.SpellSwordEnchantment
    getDynamicDaggerRitual: GetById.Dynamic.DaggerRitual
    getDynamicInstrumentEnchantment: GetById.Dynamic.InstrumentEnchantment
    getDynamicAttireEnchantment: GetById.Dynamic.AttireEnchantment
    getDynamicOrbEnchantment: GetById.Dynamic.OrbEnchantment
    getDynamicWandEnchantment: GetById.Dynamic.WandEnchantment
    getDynamicBrawlingSpecialAbility: GetById.Dynamic.BrawlingSpecialAbility
    getDynamicAncestorGlyph: GetById.Dynamic.AncestorGlyph
    getDynamicCeremonialItemSpecialAbility: GetById.Dynamic.CeremonialItemSpecialAbility
    getDynamicSermon: GetById.Dynamic.Sermon
    getDynamicLiturgicalStyleSpecialAbility: GetById.Dynamic.LiturgicalStyleSpecialAbility
    getDynamicAdvancedKarmaSpecialAbility: GetById.Dynamic.AdvancedKarmaSpecialAbility
    getDynamicVision: GetById.Dynamic.Vision
    getDynamicMagicalTradition: GetById.Dynamic.MagicalTradition
    getDynamicBlessedTradition: GetById.Dynamic.BlessedTradition
    getDynamicPactGift: GetById.Dynamic.PactGift
    getDynamicSikaryanDrainSpecialAbility: GetById.Dynamic.SikaryanDrainSpecialAbility
    getDynamicLycantropicGift: GetById.Dynamic.LycantropicGift
    getDynamicSkillStyleSpecialAbility: GetById.Dynamic.SkillStyleSpecialAbility
    getDynamicAdvancedSkillSpecialAbility: GetById.Dynamic.AdvancedSkillSpecialAbility
    getDynamicArcaneOrbEnchantment: GetById.Dynamic.ArcaneOrbEnchantment
    getDynamicCauldronEnchantment: GetById.Dynamic.CauldronEnchantment
    getDynamicFoolsHatEnchantment: GetById.Dynamic.FoolsHatEnchantment
    getDynamicToyEnchantment: GetById.Dynamic.ToyEnchantment
    getDynamicBowlEnchantment: GetById.Dynamic.BowlEnchantment
    getDynamicFatePointSexSpecialAbility: GetById.Dynamic.FatePointSexSpecialAbility
    getDynamicSexSpecialAbility: GetById.Dynamic.SexSpecialAbility
    getDynamicWeaponEnchantment: GetById.Dynamic.WeaponEnchantment
    getDynamicSickleRitual: GetById.Dynamic.SickleRitual
    getDynamicRingEnchantment: GetById.Dynamic.RingEnchantment
    getDynamicChronicleEnchantment: GetById.Dynamic.ChronicleEnchantment
    getDynamicKrallenkettenzauber: GetById.Dynamic.Krallenkettenzauber
    getDynamicTrinkhornzauber: GetById.Dynamic.Trinkhornzauber
    checkPrecondition: (pre: PreconditionGroup) => boolean
  },
  p: ActivatablePrerequisite,
): boolean => {
  const dynamicEntry = (() => {
    switch (p.id.tag) {
      case "Advantage":
        return caps.getDynamicAdvantage(p.id.advantage)
      case "Disadvantage":
        return caps.getDynamicDisadvantage(p.id.disadvantage)
      case "GeneralSpecialAbility":
        return caps.getDynamicGeneralSpecialAbility(p.id.general_special_ability)
      case "FatePointSpecialAbility":
        return caps.getDynamicFatePointSpecialAbility(p.id.fate_point_special_ability)
      case "CombatSpecialAbility":
        return caps.getDynamicCombatSpecialAbility(p.id.combat_special_ability)
      case "MagicalSpecialAbility":
        return caps.getDynamicMagicalSpecialAbility(p.id.magical_special_ability)
      case "StaffEnchantment":
        return caps.getDynamicStaffEnchantment(p.id.staff_enchantment)
      case "FamiliarSpecialAbility":
        return caps.getDynamicFamiliarSpecialAbility(p.id.familiar_special_ability)
      case "KarmaSpecialAbility":
        return caps.getDynamicKarmaSpecialAbility(p.id.karma_special_ability)
      case "ProtectiveWardingCircleSpecialAbility":
        return caps.getDynamicProtectiveWardingCircleSpecialAbility(
          p.id.protective_warding_circle_special_ability,
        )
      case "CombatStyleSpecialAbility":
        return caps.getDynamicCombatStyleSpecialAbility(p.id.combat_style_special_ability)
      case "AdvancedCombatSpecialAbility":
        return caps.getDynamicAdvancedCombatSpecialAbility(p.id.advanced_combat_special_ability)
      case "CommandSpecialAbility":
        return caps.getDynamicCommandSpecialAbility(p.id.command_special_ability)
      case "MagicStyleSpecialAbility":
        return caps.getDynamicMagicStyleSpecialAbility(p.id.magic_style_special_ability)
      case "AdvancedMagicalSpecialAbility":
        return caps.getDynamicAdvancedMagicalSpecialAbility(p.id.advanced_magical_special_ability)
      case "SpellSwordEnchantment":
        return caps.getDynamicSpellSwordEnchantment(p.id.spell_sword_enchantment)
      case "DaggerRitual":
        return caps.getDynamicDaggerRitual(p.id.dagger_ritual)
      case "InstrumentEnchantment":
        return caps.getDynamicInstrumentEnchantment(p.id.instrument_enchantment)
      case "AttireEnchantment":
        return caps.getDynamicAttireEnchantment(p.id.attire_enchantment)
      case "OrbEnchantment":
        return caps.getDynamicOrbEnchantment(p.id.orb_enchantment)
      case "WandEnchantment":
        return caps.getDynamicWandEnchantment(p.id.wand_enchantment)
      case "BrawlingSpecialAbility":
        return caps.getDynamicBrawlingSpecialAbility(p.id.brawling_special_ability)
      case "AncestorGlyph":
        return caps.getDynamicAncestorGlyph(p.id.ancestor_glyph)
      case "CeremonialItemSpecialAbility":
        return caps.getDynamicCeremonialItemSpecialAbility(p.id.ceremonial_item_special_ability)
      case "Sermon":
        return caps.getDynamicSermon(p.id.sermon)
      case "LiturgicalStyleSpecialAbility":
        return caps.getDynamicLiturgicalStyleSpecialAbility(p.id.liturgical_style_special_ability)
      case "AdvancedKarmaSpecialAbility":
        return caps.getDynamicAdvancedKarmaSpecialAbility(p.id.advanced_karma_special_ability)
      case "Vision":
        return caps.getDynamicVision(p.id.vision)
      case "MagicalTradition":
        return caps.getDynamicMagicalTradition(p.id.magical_tradition)
      case "BlessedTradition":
        return caps.getDynamicBlessedTradition(p.id.blessed_tradition)
      case "PactGift":
        return caps.getDynamicPactGift(p.id.pact_gift)
      case "SikaryanDrainSpecialAbility":
        return caps.getDynamicSikaryanDrainSpecialAbility(p.id.sikaryan_drain_special_ability)
      case "LycantropicGift":
        return caps.getDynamicLycantropicGift(p.id.lycantropic_gift)
      case "SkillStyleSpecialAbility":
        return caps.getDynamicSkillStyleSpecialAbility(p.id.skill_style_special_ability)
      case "AdvancedSkillSpecialAbility":
        return caps.getDynamicAdvancedSkillSpecialAbility(p.id.advanced_skill_special_ability)
      case "ArcaneOrbEnchantment":
        return caps.getDynamicArcaneOrbEnchantment(p.id.arcane_orb_enchantment)
      case "CauldronEnchantment":
        return caps.getDynamicCauldronEnchantment(p.id.cauldron_enchantment)
      case "FoolsHatEnchantment":
        return caps.getDynamicFoolsHatEnchantment(p.id.fools_hat_enchantment)
      case "ToyEnchantment":
        return caps.getDynamicToyEnchantment(p.id.toy_enchantment)
      case "BowlEnchantment":
        return caps.getDynamicBowlEnchantment(p.id.bowl_enchantment)
      case "FatePointSexSpecialAbility":
        return caps.getDynamicFatePointSexSpecialAbility(p.id.fate_point_sex_special_ability)
      case "SexSpecialAbility":
        return caps.getDynamicSexSpecialAbility(p.id.sex_special_ability)
      case "WeaponEnchantment":
        return caps.getDynamicWeaponEnchantment(p.id.weapon_enchantment)
      case "SickleRitual":
        return caps.getDynamicSickleRitual(p.id.sickle_ritual)
      case "RingEnchantment":
        return caps.getDynamicRingEnchantment(p.id.ring_enchantment)
      case "ChronicleEnchantment":
        return caps.getDynamicChronicleEnchantment(p.id.chronicle_enchantment)
      case "Krallenkettenzauber":
        return caps.getDynamicKrallenkettenzauber(p.id.krallenkettenzauber)
      case "Trinkhornzauber":
        return caps.getDynamicTrinkhornzauber(p.id.trinkhornzauber)
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
