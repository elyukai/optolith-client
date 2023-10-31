import { createSelector } from "@reduxjs/toolkit"
import { getActiveDynamicLiturgicalChantsByAspect } from "../../shared/domain/liturgicalChant.ts"
import { checkPrecondition } from "../../shared/domain/prerequisites/prerequisiteValidationForType.ts"
import { checkActivatablePrerequisite } from "../../shared/domain/prerequisites/single/activatablePrerequisiteValidation.ts"
import { checkAncestorBloodPrerequisite } from "../../shared/domain/prerequisites/single/ancestorBloodPrerequisiteValidation.ts"
import { checkAnimistPowerPrerequisite } from "../../shared/domain/prerequisites/single/animistPowerPrerequisiteValidation.ts"
import { checkCommonSuggestedByRCPPrerequisite } from "../../shared/domain/prerequisites/single/commonSuggestedForRCPPrerequisiteValidation.ts"
import { checkCulturePrerequisite } from "../../shared/domain/prerequisites/single/culturePrerequisiteValidation.ts"
import { checkExternalEnhancementPrerequisite } from "../../shared/domain/prerequisites/single/enhancementPrerequisiteValidation.ts"
import { checkInfluencePrerequisite } from "../../shared/domain/prerequisites/single/influencePrerequisiteValidation.ts"
import { checkPactPrerequisite } from "../../shared/domain/prerequisites/single/pactPrerequisiteValidation.ts"
import { checkPrimaryAttributePrerequisite } from "../../shared/domain/prerequisites/single/primaryAttributePrerequisiteValidation.ts"
import { checkPublicationPrerequisite } from "../../shared/domain/prerequisites/single/publicationPrerequisiteValidation.ts"
import { checkRacePrerequisite } from "../../shared/domain/prerequisites/single/racePrerequisiteValidation.ts"
import { checkRatedMinimumNumberPrerequisite } from "../../shared/domain/prerequisites/single/ratedMinimumNumberPrerequisiteValidation.ts"
import { checkRatedPrerequisite } from "../../shared/domain/prerequisites/single/ratedPrerequisiteValidation.ts"
import { checkRatedSumPrerequisite } from "../../shared/domain/prerequisites/single/ratedSumPrerequisiteValidation.ts"
import { checkRulePrerequisite } from "../../shared/domain/prerequisites/single/rulePrerequisiteValidation.ts"
import { checkSexPrerequisite } from "../../shared/domain/prerequisites/single/sexPrerequisiteValidation.ts"
import { checkSexualCharacteristicPrerequisite } from "../../shared/domain/prerequisites/single/sexualCharacteristicPrerequisiteValidation.ts"
import { checkSocialStatusPrerequisite } from "../../shared/domain/prerequisites/single/socialStatusPrerequisiteValidation.ts"
import { checkStatePrerequisite } from "../../shared/domain/prerequisites/single/statePrerequisiteValidation.ts"
import { checkTextPrerequisite } from "../../shared/domain/prerequisites/single/textPrerequisiteValidation.ts"
import {
  checkBlessedTraditionPrerequisite,
  checkMagicalTraditionPrerequisite,
} from "../../shared/domain/prerequisites/single/traditionPrerequisiteValidation.ts"
import { getActiveDynamicSpellworksByProperty } from "../../shared/domain/spell.ts"
import { isStateActive } from "../../shared/domain/state.ts"
import {
  selectActiveFocusRules,
  selectActiveOptionalRules,
  selectActiveStates,
  selectCultureId,
  selectDynamicAdvantages,
  selectDynamicAttributes,
  selectDynamicCeremonies,
  selectDynamicCloseCombatTechniques,
  selectDynamicDisadvantages,
  selectDynamicLiturgicalChants,
  selectDynamicRangedCombatTechniques,
  selectDynamicRituals,
  selectDynamicSkills,
  selectDynamicSpecialAbilities,
  selectDynamicSpells,
  selectIncludeAllPublications,
  selectIncludePublications,
  selectPact,
  selectRaceId,
  selectSex,
  selectSocialStatusId,
} from "../slices/characterSlice.ts"
import {
  selectDatabase,
  selectStaticAdvantages,
  selectStaticCeremonies,
  selectStaticLiturgicalChants,
  selectStaticPublications,
  selectStaticRituals,
  selectStaticSpells,
} from "../slices/databaseSlice.ts"
import { selectCurrentCulture } from "./cultureSelectors.ts"
import {
  selectBlessedPrimaryAttribute,
  selectHighestMagicalPrimaryAttributes,
} from "./primaryAttributeSelectors.ts"
import { selectCurrentProfession } from "./professionSelectors.ts"
import { selectCurrentRace, selectCurrentRaceVariant } from "./raceSelectors.ts"
import {
  selectActiveBlessedTradition,
  selectActiveMagicalTraditions,
} from "./traditionSelectors.ts"

/**
 * Select the capabilities needed to check for a precondition.
 */
export const selectCapabilitiesForPrecondition = createSelector(
  selectIncludeAllPublications,
  selectIncludePublications,
  selectStaticPublications,
  selectSex,
  (
    areAllPublicationsEnabled,
    includedPublications,
    publications,
    sex,
  ): Parameters<typeof checkPrecondition>[0] => ({
    getAreAllPublicationsEnabled: () => areAllPublicationsEnabled,
    getIsPublicationEnabledManually: id => includedPublications.includes(id),
    getStaticPublication: id => publications[id],
    getSex: () => sex,
  }),
)

/**
 * Select the capabilities needed to check for an activatable prerequisite.
 */
export const selectCapabilitiesForActivatablePrerequisite = createSelector(
  selectDynamicAdvantages,
  selectDynamicDisadvantages,
  selectDynamicSpecialAbilities,
  selectCapabilitiesForPrecondition,
  (
    advantages,
    disadvantages,
    specialAbilities,
    precondition,
  ): Parameters<typeof checkActivatablePrerequisite>[0] => ({
    getDynamicAdvantage: id => advantages?.[id],
    getDynamicDisadvantage: id => disadvantages?.[id],
    getDynamicGeneralSpecialAbility: id => specialAbilities?.generalSpecialAbilities?.[id],
    getDynamicFatePointSpecialAbility: id => specialAbilities?.fatePointSpecialAbilities?.[id],
    getDynamicCombatSpecialAbility: id => specialAbilities?.combatSpecialAbilities?.[id],
    getDynamicMagicalSpecialAbility: id => specialAbilities?.magicalSpecialAbilities?.[id],
    getDynamicStaffEnchantment: id => specialAbilities?.staffEnchantments?.[id],
    getDynamicFamiliarSpecialAbility: id => specialAbilities?.familiarSpecialAbilities?.[id],
    getDynamicKarmaSpecialAbility: id => specialAbilities?.karmaSpecialAbilities?.[id],
    getDynamicProtectiveWardingCircleSpecialAbility: id =>
      specialAbilities?.protectiveWardingCircleSpecialAbilities?.[id],
    getDynamicCombatStyleSpecialAbility: id => specialAbilities?.combatStyleSpecialAbilities?.[id],
    getDynamicAdvancedCombatSpecialAbility: id =>
      specialAbilities?.advancedCombatSpecialAbilities?.[id],
    getDynamicCommandSpecialAbility: id => specialAbilities?.commandSpecialAbilities?.[id],
    getDynamicMagicStyleSpecialAbility: id => specialAbilities?.magicStyleSpecialAbilities?.[id],
    getDynamicAdvancedMagicalSpecialAbility: id =>
      specialAbilities?.advancedMagicalSpecialAbilities?.[id],
    getDynamicSpellSwordEnchantment: id => specialAbilities?.spellSwordEnchantments?.[id],
    getDynamicDaggerRitual: id => specialAbilities?.daggerRituals?.[id],
    getDynamicInstrumentEnchantment: id => specialAbilities?.instrumentEnchantments?.[id],
    getDynamicAttireEnchantment: id => specialAbilities?.attireEnchantments?.[id],
    getDynamicOrbEnchantment: id => specialAbilities?.orbEnchantments?.[id],
    getDynamicWandEnchantment: id => specialAbilities?.wandEnchantments?.[id],
    getDynamicBrawlingSpecialAbility: id => specialAbilities?.brawlingSpecialAbilities?.[id],
    getDynamicAncestorGlyph: id => specialAbilities?.ancestorGlyphs?.[id],
    getDynamicCeremonialItemSpecialAbility: id =>
      specialAbilities?.ceremonialItemSpecialAbilities?.[id],
    getDynamicSermon: id => specialAbilities?.sermons?.[id],
    getDynamicLiturgicalStyleSpecialAbility: id =>
      specialAbilities?.liturgicalStyleSpecialAbilities?.[id],
    getDynamicAdvancedKarmaSpecialAbility: id =>
      specialAbilities?.advancedKarmaSpecialAbilities?.[id],
    getDynamicVision: id => specialAbilities?.visions?.[id],
    getDynamicMagicalTradition: id => specialAbilities?.magicalTraditions?.[id],
    getDynamicBlessedTradition: id => specialAbilities?.blessedTraditions?.[id],
    getDynamicPactGift: id => specialAbilities?.pactGifts?.[id],
    getDynamicSikaryanDrainSpecialAbility: id =>
      specialAbilities?.sikaryanDrainSpecialAbilities?.[id],
    getDynamicLycantropicGift: id => specialAbilities?.lycantropicGifts?.[id],
    getDynamicSkillStyleSpecialAbility: id => specialAbilities?.skillStyleSpecialAbilities?.[id],
    getDynamicAdvancedSkillSpecialAbility: id =>
      specialAbilities?.advancedSkillSpecialAbilities?.[id],
    getDynamicArcaneOrbEnchantment: id => specialAbilities?.arcaneOrbEnchantments?.[id],
    getDynamicCauldronEnchantment: id => specialAbilities?.cauldronEnchantments?.[id],
    getDynamicFoolsHatEnchantment: id => specialAbilities?.foolsHatEnchantments?.[id],
    getDynamicToyEnchantment: id => specialAbilities?.toyEnchantments?.[id],
    getDynamicBowlEnchantment: id => specialAbilities?.bowlEnchantments?.[id],
    getDynamicFatePointSexSpecialAbility: id =>
      specialAbilities?.fatePointSexSpecialAbilities?.[id],
    getDynamicSexSpecialAbility: id => specialAbilities?.sexSpecialAbilities?.[id],
    getDynamicWeaponEnchantment: id => specialAbilities?.weaponEnchantments?.[id],
    getDynamicSickleRitual: id => specialAbilities?.sickleRituals?.[id],
    getDynamicRingEnchantment: id => specialAbilities?.ringEnchantments?.[id],
    getDynamicChronicleEnchantment: id => specialAbilities?.chronicleEnchantments?.[id],
    getDynamicKrallenkettenzauber: id => specialAbilities?.krallenkettenzauber?.[id],
    getDynamicTrinkhornzauber: id => specialAbilities?.trinkhornzauber?.[id],
    checkPrecondition: pre => checkPrecondition(precondition, pre),
  }),
)

/**
 * Select the capabilities needed to check for an ancestor blood prerequisite.
 */
export const selectCapabilitiesForAncestorBloodPrerequisite = createSelector(
  selectStaticAdvantages,
  selectDynamicAdvantages,
  (staticAdvantages, dynamicAdvantages): Parameters<typeof checkAncestorBloodPrerequisite>[0] => ({
    getStaticAdvantage: id => staticAdvantages[id],
    getDynamicAdvantages: () => dynamicAdvantages,
  }),
)

/**
 * Select the capabilities needed to check for an animist power prerequisite.
 */
export const selectCapabilitiesForAnimistPowerPrerequisite = createSelector(
  selectDatabase,
  (): Parameters<typeof checkAnimistPowerPrerequisite>[0] => ({}),
)

/**
 * Select the capabilities needed to check for a common suggested by RCP prerequisite.
 */
export const selectCapabilitiesForCommonSuggestedByRCPPrerequisite = createSelector(
  selectCurrentRace,
  selectCurrentRaceVariant,
  selectCurrentCulture,
  selectCurrentProfession,
  (
    race,
    raceVariant,
    culture,
    profession,
  ): Parameters<typeof checkCommonSuggestedByRCPPrerequisite>[0] => ({
    getRace: () => race,
    getRaceVariant: () => raceVariant,
    getCulture: () => culture,
    getProfessionPackage: () => profession?.package,
  }),
)

/**
 * Select the capabilities needed to check for a culture prerequisite.
 */
export const selectCapabilitiesForCulturePrerequisite = createSelector(
  selectCultureId,
  (cultureId): Parameters<typeof checkCulturePrerequisite>[0] => ({
    getCurrentCultureIdentifier: () => cultureId,
  }),
)

/**
 * Select the capabilities needed to check for an external enhancement
 * prerequisite.
 */
export const selectCapabilitiesForExternalEnhancementPrerequisite = createSelector(
  selectDynamicSpells,
  selectDynamicRituals,
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
  (
    dynamicSpells,
    dynamicRituals,
    dynamicLiturgicalChants,
    dynamicCeremonies,
  ): Parameters<typeof checkExternalEnhancementPrerequisite>[0] => ({
    getDynamicSpell: id => dynamicSpells[id],
    getDynamicRitual: id => dynamicRituals[id],
    getDynamicLiturgicalChant: id => dynamicLiturgicalChants[id],
    getDynamicCeremony: id => dynamicCeremonies[id],
  }),
)

/**
 * Select the capabilities needed to check for an influence prerequisite.
 */
export const selectCapabilitiesForInfluencePrerequisite = createSelector(
  selectDatabase,
  (): Parameters<typeof checkInfluencePrerequisite>[0] => ({}),
)

/**
 * Select the capabilities needed to check for a pact prerequisite.
 */
export const selectCapabilitiesForPactPrerequisite = createSelector(
  selectPact,
  (pact): Parameters<typeof checkPactPrerequisite>[0] => ({
    getPact: () => pact,
  }),
)

/**
 * Select the capabilities needed to check for a primary attribute prerequisite.
 */
export const selectCapabilitiesForPrimaryAttributePrerequisite = createSelector(
  selectBlessedPrimaryAttribute,
  selectHighestMagicalPrimaryAttributes,
  (
    blessedPrimaryAttribute,
    magicalPrimaryAttributes,
  ): Parameters<typeof checkPrimaryAttributePrerequisite>[0] => ({
    getDynamicBlessedPrimaryAttribute: () => blessedPrimaryAttribute,
    getDynamicMagicalPrimaryAttributes: () => magicalPrimaryAttributes.list,
  }),
)

/**
 * Select the capabilities needed to check for a publication prerequisite.
 */
export const selectCapabilitiesForPublicationPrerequisite = createSelector(
  selectStaticPublications,
  selectIncludeAllPublications,
  selectIncludePublications,
  (
    staticPublications,
    areAllPublicationsEnabled,
    enabledPublications,
  ): Parameters<typeof checkPublicationPrerequisite>[0] => ({
    getAreAllPublicationsEnabled: () => areAllPublicationsEnabled,
    getIsPublicationEnabledManually: id => enabledPublications.includes(id),
    getStaticPublication: id => staticPublications[id],
  }),
)

/**
 * Select the capabilities needed to check for a race prerequisite.
 */
export const selectCapabilitiesForRacePrerequisite = createSelector(
  selectRaceId,
  (raceId): Parameters<typeof checkRacePrerequisite>[0] => ({
    getCurrentRaceIdentifier: () => raceId,
  }),
)

/**
 * Select the capabilities needed to check for a rated minimum number
 * prerequisite.
 */
export const selectCapabilitiesForRatedMinimumNumberPrerequisite = createSelector(
  selectDynamicSkills,
  selectDynamicCloseCombatTechniques,
  selectDynamicRangedCombatTechniques,
  selectDynamicSpells,
  selectDynamicRituals,
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
  selectStaticSpells,
  selectStaticRituals,
  selectStaticLiturgicalChants,
  selectStaticCeremonies,
  (
    dynamicSkills,
    dynamicCloseCombatTechniques,
    dynamicRangedCombatTechniques,
    dynamicSpells,
    dynamicRituals,
    dynamicLiturgicalChants,
    dynamicCeremonies,
    staticSpells,
    staticRituals,
    staticLiturgicalChants,
    staticCeremonies,
  ): Parameters<typeof checkRatedMinimumNumberPrerequisite>[0] => ({
    getDynamicSkillById: id => dynamicSkills[id],
    getDynamicCloseCombatTechniques: () => Object.values(dynamicCloseCombatTechniques),
    getDynamicRangedCombatTechniques: () => Object.values(dynamicRangedCombatTechniques),
    getDynamicSpellsByProperty: propertyId =>
      getActiveDynamicSpellworksByProperty(
        id => staticSpells[id]?.property.id,
        dynamicSpells,
        propertyId,
      ),
    getDynamicRitualsByProperty: propertyId =>
      getActiveDynamicSpellworksByProperty(
        id => staticRituals[id]?.property.id,
        dynamicRituals,
        propertyId,
      ),
    getDynamicLiturgicalChantsByAspect: aspectId =>
      getActiveDynamicLiturgicalChantsByAspect(
        id => staticLiturgicalChants[id]?.traditions ?? [],
        dynamicLiturgicalChants,
        aspectId,
      ),
    getDynamicCeremoniesByAspect: aspectId =>
      getActiveDynamicLiturgicalChantsByAspect(
        id => staticCeremonies[id]?.traditions ?? [],
        dynamicCeremonies,
        aspectId,
      ),
  }),
)

/**
 * Select the capabilities needed to check for a rated prerequisite.
 */
export const selectCapabilitiesForRatedPrerequisite = createSelector(
  selectDynamicAttributes,
  selectDynamicSkills,
  selectDynamicCloseCombatTechniques,
  selectDynamicRangedCombatTechniques,
  selectDynamicSpells,
  selectDynamicRituals,
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
  (
    attributes,
    skills,
    closeCombatTechniques,
    rangedCombatTechniques,
    spells,
    rituals,
    liturgicalChants,
    ceremonies,
  ): Parameters<typeof checkRatedPrerequisite>[0] => ({
    getDynamicAttribute: id => attributes[id],
    getDynamicSkill: id => skills[id],
    getDynamicCloseCombatTechnique: id => closeCombatTechniques[id],
    getDynamicRangedCombatTechnique: id => rangedCombatTechniques[id],
    getDynamicSpell: id => spells[id],
    getDynamicRitual: id => rituals[id],
    getDynamicLiturgicalChant: id => liturgicalChants[id],
    getDynamicCeremony: id => ceremonies[id],
  }),
)

/**
 * Select the capabilities needed to check for a rated sum prerequisite.
 */
export const selectCapabilitiesForRatedSumPrerequisite = createSelector(
  selectDynamicSkills,
  selectDynamicSpells,
  selectDynamicRituals,
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
  (
    dynamicSkills,
    dynamicSpells,
    dynamicRituals,
    dynamicLiturgicalChants,
    dynamicCeremonys,
  ): Parameters<typeof checkRatedSumPrerequisite>[0] => ({
    getDynamicSkill: id => dynamicSkills[id],
    getDynamicSpell: id => dynamicSpells[id],
    getDynamicRitual: id => dynamicRituals[id],
    getDynamicLiturgicalChant: id => dynamicLiturgicalChants[id],
    getDynamicCeremony: id => dynamicCeremonys[id],
  }),
)

/**
 * Select the capabilities needed to check for a rule prerequisite.
 */
export const selectCapabilitiesForRulePrerequisite = createSelector(
  selectActiveFocusRules,
  selectActiveOptionalRules,
  (activeFocusRules, activeOptionalRules): Parameters<typeof checkRulePrerequisite>[0] => ({
    getDynamicFocusRule: id => activeFocusRules[id],
    getDynamicOptionalRule: id => activeOptionalRules[id],
  }),
)

/**
 * Select the capabilities needed to check for a sex prerequisite.
 */
export const selectCapabilitiesForSexPrerequisite = createSelector(
  selectSex,
  (sex): Parameters<typeof checkSexPrerequisite>[0] => ({ getSex: () => sex }),
)

/**
 * Select the capabilities needed to check for a sexual characteristic
 * prerequisite.
 */
export const selectCapabilitiesForSexualCharacteristicPrerequisite = createSelector(
  selectSex,
  (sex): Parameters<typeof checkSexualCharacteristicPrerequisite>[0] => ({ getSex: () => sex }),
)

/**
 * Select the capabilities needed to check for a social status prerequisite.
 */
export const selectCapabilitiesForSocialStatusPrerequisite = createSelector(
  selectSocialStatusId,
  (socialStatusId): Parameters<typeof checkSocialStatusPrerequisite>[0] => ({
    getSocialStatus: () => socialStatusId,
  }),
)

/**
 * Select the capabilities needed to check for a state prerequisite.
 */
export const selectCapabilitiesForStatePrerequisite = createSelector(
  selectActiveStates,
  (activeStates): Parameters<typeof checkStatePrerequisite>[0] => ({
    getDynamicState: id => isStateActive(activeStates, id),
  }),
)

/**
 * Select the capabilities needed to check for a text prerequisite.
 */
export const selectCapabilitiesForTextPrerequisite = createSelector(
  selectDatabase,
  (): Parameters<typeof checkTextPrerequisite>[0] => ({}),
)

/**
 * Select the capabilities needed to check for a culture prerequisite.
 */
export const selectCapabilitiesForBlessedTraditionPrerequisite = createSelector(
  selectActiveBlessedTradition,
  (activeBlessedTradition): Parameters<typeof checkBlessedTraditionPrerequisite>[0] => ({
    getActiveBlessedTradition: () => activeBlessedTradition,
  }),
)

/**
 * Select the capabilities needed to check for a culture prerequisite.
 */
export const selectCapabilitiesForMagicalTraditionPrerequisite = createSelector(
  selectActiveMagicalTraditions,
  (activeMagicalTraditions): Parameters<typeof checkMagicalTraditionPrerequisite>[0] => ({
    getActiveMagicalTraditions: () => activeMagicalTraditions,
  }),
)
