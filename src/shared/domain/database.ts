import {
  ActivatableSelectOptionsCache,
  ResolvedSelectOption,
} from "optolith-database-schema/cache/activatableSelectOptions"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { assertExhaustive } from "../utils/typeSafety.ts"

/**
 * Returns the select options for a given activatable identifier from the
 * given cache.
 */
export const getSelectOptionsFromCacheById = (
  cache: ActivatableSelectOptionsCache,
  id: ActivatableIdentifier,
): ResolvedSelectOption[] | undefined => {
  // prettier-ignore
  switch (id.tag) {
    case "Advantage": return cache.advantages[id.advantage]
    case "Disadvantage": return cache.disadvantages[id.disadvantage]
    case "GeneralSpecialAbility": return cache.generalSpecialAbilities[id.general_special_ability]
    case "FatePointSpecialAbility": return cache.fatePointSpecialAbilities[id.fate_point_special_ability]
    case "CombatSpecialAbility": return cache.combatSpecialAbilities[id.combat_special_ability]
    case "MagicalSpecialAbility": return cache.magicalSpecialAbilities[id.magical_special_ability]
    case "StaffEnchantment": return cache.staffEnchantments[id.staff_enchantment]
    case "FamiliarSpecialAbility": return cache.familiarSpecialAbilities[id.familiar_special_ability]
    case "KarmaSpecialAbility": return cache.karmaSpecialAbilities[id.karma_special_ability]
    case "ProtectiveWardingCircleSpecialAbility": return cache.protectiveWardingCircleSpecialAbilities[id.protective_warding_circle_special_ability]
    case "CombatStyleSpecialAbility": return cache.combatStyleSpecialAbilities[id.combat_style_special_ability]
    case "AdvancedCombatSpecialAbility": return cache.advancedCombatSpecialAbilities[id.advanced_combat_special_ability]
    case "CommandSpecialAbility": return cache.commandSpecialAbilities[id.command_special_ability]
    case "MagicStyleSpecialAbility": return cache.magicStyleSpecialAbilities[id.magic_style_special_ability]
    case "AdvancedMagicalSpecialAbility": return cache.advancedMagicalSpecialAbilities[id.advanced_magical_special_ability]
    case "SpellSwordEnchantment": return cache.spellSwordEnchantments[id.spell_sword_enchantment]
    case "DaggerRitual": return cache.daggerRituals[id.dagger_ritual]
    case "InstrumentEnchantment": return cache.instrumentEnchantments[id.instrument_enchantment]
    case "AttireEnchantment": return cache.attireEnchantments[id.attire_enchantment]
    case "OrbEnchantment": return cache.orbEnchantments[id.orb_enchantment]
    case "WandEnchantment": return cache.wandEnchantments[id.wand_enchantment]
    case "BrawlingSpecialAbility": return cache.brawlingSpecialAbilities[id.brawling_special_ability]
    case "AncestorGlyph": return cache.ancestorGlyphs[id.ancestor_glyph]
    case "CeremonialItemSpecialAbility": return cache.ceremonialItemSpecialAbilities[id.ceremonial_item_special_ability]
    case "Sermon": return cache.sermons[id.sermon]
    case "LiturgicalStyleSpecialAbility": return cache.liturgicalStyleSpecialAbilities[id.liturgical_style_special_ability]
    case "AdvancedKarmaSpecialAbility": return cache.advancedKarmaSpecialAbilities[id.advanced_karma_special_ability]
    case "Vision": return cache.visions[id.vision]
    case "MagicalTradition": return cache.magicalTraditions[id.magical_tradition]
    case "BlessedTradition": return cache.blessedTraditions[id.blessed_tradition]
    case "PactGift": return cache.pactGifts[id.pact_gift]
    case "SikaryanDrainSpecialAbility": return cache.sikaryanDrainSpecialAbilities[id.sikaryan_drain_special_ability]
    case "VampiricGift": return cache.vampiricGifts[id.vampiric_gift]
    case "LycantropicGift": return cache.lycantropicGifts[id.lycantropic_gift]
    case "SkillStyleSpecialAbility": return cache.skillStyleSpecialAbilities[id.skill_style_special_ability]
    case "AdvancedSkillSpecialAbility": return cache.advancedSkillSpecialAbilities[id.advanced_skill_special_ability]
    case "ArcaneOrbEnchantment": return cache.arcaneOrbEnchantments[id.arcane_orb_enchantment]
    case "CauldronEnchantment": return cache.cauldronEnchantments[id.cauldron_enchantment]
    case "FoolsHatEnchantment": return cache.foolsHatEnchantments[id.fools_hat_enchantment]
    case "ToyEnchantment": return cache.toyEnchantments[id.toy_enchantment]
    case "BowlEnchantment": return cache.bowlEnchantments[id.bowl_enchantment]
    case "FatePointSexSpecialAbility": return cache.fatePointSexSpecialAbilities[id.fate_point_sex_special_ability]
    case "SexSpecialAbility": return cache.sexSpecialAbilities[id.sex_special_ability]
    case "WeaponEnchantment": return cache.weaponEnchantments[id.weapon_enchantment]
    case "SickleRitual": return cache.sickleRituals[id.sickle_ritual]
    case "RingEnchantment": return cache.ringEnchantments[id.ring_enchantment]
    case "ChronicleEnchantment": return cache.chronicleEnchantments[id.chronicle_enchantment]
    case "Krallenkettenzauber": return cache.krallenkettenzauber[id.krallenkettenzauber]
    case "Trinkhornzauber": return cache.trinkhornzauber[id.trinkhornzauber]
    // @ts-expect-error Magical Signs do not have select options; this is for forward compatibility
    case "MagicalSign": return cache.magicalSigns?.[id.magical_sign]
    default: assertExhaustive(id)
  }
}
