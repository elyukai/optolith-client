import { createSelector } from "@reduxjs/toolkit"
import { filterApplyingRatedDependencies } from "../../shared/domain/dependencies/filterApplyingDependencies.ts"
import { checkMultipleDisjunctionPartsAreValid } from "../../shared/domain/prerequisites/disjunctionPrerequisiteMultipartValidation.ts"
import { selectDatabase } from "../slices/databaseSlice.ts"
import * as PrerequisiteCaps from "./prerequisiteSelectors.ts"

/**
 * Selects a filter function to filter unapplying dependencies of rated entries.
 */
export const selectFilterApplyingRatedDependencies = createSelector(
  selectDatabase,
  PrerequisiteCaps.selectCapabilitiesForActivatablePrerequisite,
  PrerequisiteCaps.selectCapabilitiesForAncestorBloodPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForBlessedTraditionPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForCommonSuggestedByRCPPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForCulturePrerequisite,
  PrerequisiteCaps.selectCapabilitiesForExternalEnhancementPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForInfluencePrerequisite,
  PrerequisiteCaps.selectCapabilitiesForMagicalTraditionPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForPactPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForPrimaryAttributePrerequisite,
  PrerequisiteCaps.selectCapabilitiesForPublicationPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForRacePrerequisite,
  PrerequisiteCaps.selectCapabilitiesForRatedMinimumNumberPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForRatedPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForRatedSumPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForRulePrerequisite,
  PrerequisiteCaps.selectCapabilitiesForSexPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForSexualCharacteristicPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForSocialStatusPrerequisite,
  PrerequisiteCaps.selectCapabilitiesForStatePrerequisite,
  PrerequisiteCaps.selectCapabilitiesForTextPrerequisite,
  (
    database,
    activatablePrerequisiteCapabilities,
    ancestorBloodPrerequisiteCapabilities,
    blessedTraditionPrerequisiteCapabilities,
    commonSuggestedByRCPPrerequisiteCapabilities,
    culturePrerequisiteCapabilities,
    externalEnhancementPrerequisiteCapabilities,
    influencePrerequisiteCapabilities,
    magicalTraditionPrerequisiteCapabilities,
    pactPrerequisiteCapabilities,
    primaryAttributePrerequisiteCapabilities,
    publicationPrerequisiteCapabilities,
    racePrerequisiteCapabilities,
    ratedMinimumNumberPrerequisiteCapabilities,
    ratedPrerequisiteCapabilities,
    ratedSumPrerequisiteCapabilities,
    rulePrerequisiteCapabilities,
    sexPrerequisiteCapabilities,
    sexualCharacteristicPrerequisiteCapabilities,
    socialStatusPrerequisiteCapabilities,
    statePrerequisiteCapabilities,
    textPrerequisiteCapabilities,
  ) =>
    filterApplyingRatedDependencies(
      checkMultipleDisjunctionPartsAreValid({
        getStaticDisadvantage: id => database.disadvantages[id],
        getStaticGeneralSpecialAbility: id => database.generalSpecialAbilities[id],
        getStaticFatePointSpecialAbility: id => database.fatePointSpecialAbilities[id],
        getStaticCombatSpecialAbility: id => database.combatSpecialAbilities[id],
        getStaticMagicalSpecialAbility: id => database.magicalSpecialAbilities[id],
        getStaticStaffEnchantment: id => database.staffEnchantments[id],
        getStaticFamiliarSpecialAbility: id => database.familiarSpecialAbilities[id],
        getStaticKarmaSpecialAbility: id => database.karmaSpecialAbilities[id],
        getStaticProtectiveWardingCircleSpecialAbility: id =>
          database.protectiveWardingCircleSpecialAbilities[id],
        getStaticCombatStyleSpecialAbility: id => database.combatStyleSpecialAbilities[id],
        getStaticAdvancedCombatSpecialAbility: id => database.advancedCombatSpecialAbilities[id],
        getStaticCommandSpecialAbility: id => database.commandSpecialAbilities[id],
        getStaticMagicStyleSpecialAbility: id => database.magicStyleSpecialAbilities[id],
        getStaticAdvancedMagicalSpecialAbility: id => database.advancedMagicalSpecialAbilities[id],
        getStaticSpellSwordEnchantment: id => database.spellSwordEnchantments[id],
        getStaticDaggerRitual: id => database.daggerRituals[id],
        getStaticInstrumentEnchantment: id => database.instrumentEnchantments[id],
        getStaticAttireEnchantment: id => database.attireEnchantments[id],
        getStaticOrbEnchantment: id => database.orbEnchantments[id],
        getStaticWandEnchantment: id => database.wandEnchantments[id],
        getStaticBrawlingSpecialAbility: id => database.brawlingSpecialAbilities[id],
        getStaticAncestorGlyph: id => database.ancestorGlyphs[id],
        getStaticCeremonialItemSpecialAbility: id => database.ceremonialItemSpecialAbilities[id],
        getStaticSermon: id => database.sermons[id],
        getStaticLiturgicalStyleSpecialAbility: id => database.liturgicalStyleSpecialAbilities[id],
        getStaticAdvancedKarmaSpecialAbility: id => database.advancedKarmaSpecialAbilities[id],
        getStaticVision: id => database.visions[id],
        getStaticMagicalTradition: id => database.magicalTraditions[id],
        getStaticBlessedTradition: id => database.blessedTraditions[id],
        getStaticPactGift: id => database.pactGifts[id],
        getStaticSikaryanDrainSpecialAbility: id => database.sikaryanDrainSpecialAbilities[id],
        getStaticLycantropicGift: id => database.lycantropicGifts[id],
        getStaticSkillStyleSpecialAbility: id => database.skillStyleSpecialAbilities[id],
        getStaticAdvancedSkillSpecialAbility: id => database.advancedSkillSpecialAbilities[id],
        getStaticArcaneOrbEnchantment: id => database.arcaneOrbEnchantments[id],
        getStaticCauldronEnchantment: id => database.cauldronEnchantments[id],
        getStaticFoolsHatEnchantment: id => database.foolsHatEnchantments[id],
        getStaticToyEnchantment: id => database.toyEnchantments[id],
        getStaticBowlEnchantment: id => database.bowlEnchantments[id],
        getStaticFatePointSexSpecialAbility: id => database.fatePointSexSpecialAbilities[id],
        getStaticSexSpecialAbility: id => database.sexSpecialAbilities[id],
        getStaticWeaponEnchantment: id => database.weaponEnchantments[id],
        getStaticSickleRitual: id => database.sickleRituals[id],
        getStaticRingEnchantment: id => database.ringEnchantments[id],
        getStaticChronicleEnchantment: id => database.chronicleEnchantments[id],
        getStaticKrallenkettenzauber: id => database.krallenkettenzauber[id],
        getStaticTrinkhornzauber: id => database.trinkhornzauber[id],
        getStaticSpell: id => database.spells[id],
        getStaticRitual: id => database.rituals[id],
        getStaticLiturgicalChant: id => database.liturgicalChants[id],
        getStaticCeremony: id => database.ceremonies[id],
        ...activatablePrerequisiteCapabilities,
        ...ancestorBloodPrerequisiteCapabilities,
        ...blessedTraditionPrerequisiteCapabilities,
        ...commonSuggestedByRCPPrerequisiteCapabilities,
        ...culturePrerequisiteCapabilities,
        ...externalEnhancementPrerequisiteCapabilities,
        ...influencePrerequisiteCapabilities,
        ...magicalTraditionPrerequisiteCapabilities,
        ...pactPrerequisiteCapabilities,
        ...primaryAttributePrerequisiteCapabilities,
        ...publicationPrerequisiteCapabilities,
        ...racePrerequisiteCapabilities,
        ...ratedMinimumNumberPrerequisiteCapabilities,
        ...ratedPrerequisiteCapabilities,
        ...ratedSumPrerequisiteCapabilities,
        ...rulePrerequisiteCapabilities,
        ...sexPrerequisiteCapabilities,
        ...sexualCharacteristicPrerequisiteCapabilities,
        ...socialStatusPrerequisiteCapabilities,
        ...statePrerequisiteCapabilities,
        ...textPrerequisiteCapabilities,
      }),
    ),
)