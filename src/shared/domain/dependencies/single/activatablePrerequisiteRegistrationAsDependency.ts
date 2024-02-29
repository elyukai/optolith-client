import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { ActivatablePrerequisite } from "optolith-database-schema/types/prerequisites/single/ActivatablePrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { ActivatableDependency } from "../../activatable/activatableDependency.ts"
import { createEmptyDynamicActivatable } from "../../activatable/activatableEntry.ts"
import { RegistrationFunction, addOrRemoveDependencyInSlice } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link ActivatablePrerequisite} as a dependency on
 * the character's draft.
 */
export const registerOrUnregisterActivatablePrerequisiteAsDependency: RegistrationFunction<
  ActivatablePrerequisite,
  ActivatableIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  const dependency: ActivatableDependency = {
    sourceId,
    index,
    isPartOfDisjunction,
    active: p.active,
    level: p.level,
    options: p.options,
    when: p.when,
  }

  switch (p.id.tag) {
    case "Advantage":
      return addOrRemoveDependencyInSlice(
        method,
        character.advantages,
        p.id.advantage,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "Disadvantage":
      return addOrRemoveDependencyInSlice(
        method,
        character.disadvantages,
        p.id.disadvantage,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "GeneralSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.generalSpecialAbilities,
        p.id.general_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "FatePointSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.fatePointSpecialAbilities,
        p.id.fate_point_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "CombatSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.combatSpecialAbilities,
        p.id.combat_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "MagicalSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.magicalSpecialAbilities,
        p.id.magical_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "StaffEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.staffEnchantments,
        p.id.staff_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "FamiliarSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.familiarSpecialAbilities,
        p.id.familiar_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "KarmaSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.karmaSpecialAbilities,
        p.id.karma_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "ProtectiveWardingCircleSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.protectiveWardingCircleSpecialAbilities,
        p.id.protective_warding_circle_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "CombatStyleSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.combatStyleSpecialAbilities,
        p.id.combat_style_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "AdvancedCombatSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.advancedCombatSpecialAbilities,
        p.id.advanced_combat_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "CommandSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.commandSpecialAbilities,
        p.id.command_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "MagicStyleSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.magicStyleSpecialAbilities,
        p.id.magic_style_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "AdvancedMagicalSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.advancedMagicalSpecialAbilities,
        p.id.advanced_magical_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "SpellSwordEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.spellSwordEnchantments,
        p.id.spell_sword_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "DaggerRitual":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.daggerRituals,
        p.id.dagger_ritual,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "InstrumentEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.instrumentEnchantments,
        p.id.instrument_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "AttireEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.attireEnchantments,
        p.id.attire_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "OrbEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.orbEnchantments,
        p.id.orb_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "WandEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.wandEnchantments,
        p.id.wand_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "BrawlingSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.brawlingSpecialAbilities,
        p.id.brawling_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "AncestorGlyph":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.ancestorGlyphs,
        p.id.ancestor_glyph,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "CeremonialItemSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.ceremonialItemSpecialAbilities,
        p.id.ceremonial_item_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "Sermon":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.sermons,
        p.id.sermon,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "LiturgicalStyleSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.liturgicalStyleSpecialAbilities,
        p.id.liturgical_style_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "AdvancedKarmaSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.advancedKarmaSpecialAbilities,
        p.id.advanced_karma_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "Vision":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.visions,
        p.id.vision,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "MagicalTradition":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.magicalTraditions,
        p.id.magical_tradition,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "BlessedTradition":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.blessedTraditions,
        p.id.blessed_tradition,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "PactGift":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.pactGifts,
        p.id.pact_gift,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "VampiricGift":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.vampiricGifts,
        p.id.vampiric_gift,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "SikaryanDrainSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.sikaryanDrainSpecialAbilities,
        p.id.sikaryan_drain_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "LycantropicGift":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.lycantropicGifts,
        p.id.lycantropic_gift,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "SkillStyleSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.skillStyleSpecialAbilities,
        p.id.skill_style_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "AdvancedSkillSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.advancedSkillSpecialAbilities,
        p.id.advanced_skill_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "ArcaneOrbEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.arcaneOrbEnchantments,
        p.id.arcane_orb_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "CauldronEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.cauldronEnchantments,
        p.id.cauldron_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "FoolsHatEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.foolsHatEnchantments,
        p.id.fools_hat_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "ToyEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.toyEnchantments,
        p.id.toy_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "BowlEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.bowlEnchantments,
        p.id.bowl_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "FatePointSexSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.fatePointSexSpecialAbilities,
        p.id.fate_point_sex_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "SexSpecialAbility":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.sexSpecialAbilities,
        p.id.sex_special_ability,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "WeaponEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.weaponEnchantments,
        p.id.weapon_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "SickleRitual":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.sickleRituals,
        p.id.sickle_ritual,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "RingEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.ringEnchantments,
        p.id.ring_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "ChronicleEnchantment":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.chronicleEnchantments,
        p.id.chronicle_enchantment,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "Krallenkettenzauber":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.krallenkettenzauber,
        p.id.krallenkettenzauber,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "Trinkhornzauber":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.trinkhornzauber,
        p.id.trinkhornzauber,
        createEmptyDynamicActivatable,
        dependency,
      )
    case "MagicalSign":
      return addOrRemoveDependencyInSlice(
        method,
        character.specialAbilities.magicalSigns,
        p.id.magical_sign,
        createEmptyDynamicActivatable,
        dependency,
      )
    default:
      return assertExhaustive(p.id)
  }
}
