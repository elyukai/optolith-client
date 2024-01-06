import { createSelector } from "@reduxjs/toolkit"
import * as FullCheck from "../../shared/domain/prerequisites/fullPrerequisiteValidationForType.ts"
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
import { getActiveDynamicLiturgicalChantsByAspect } from "../../shared/domain/rated/liturgicalChant.ts"
import { getActiveDynamicSpellworksByProperty } from "../../shared/domain/rated/spell.ts"
import {
  selectCultureId,
  selectDynamicAdvantages,
  selectDynamicAttributes,
  selectDynamicCeremonies,
  selectDynamicCloseCombatTechniques,
  selectDynamicDisadvantages,
  selectDynamicFocusRules,
  selectDynamicLiturgicalChants,
  selectDynamicOptionalRules,
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
import { SelectGetById } from "./basicCapabilitySelectors.ts"
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
    getStaticPublicationById: id => publications[id],
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
    getDynamicAdvantageById: id => advantages?.[id],
    getDynamicDisadvantageById: id => disadvantages?.[id],
    getDynamicGeneralSpecialAbilityById: id => specialAbilities?.generalSpecialAbilities?.[id],
    getDynamicFatePointSpecialAbilityById: id => specialAbilities?.fatePointSpecialAbilities?.[id],
    getDynamicCombatSpecialAbilityById: id => specialAbilities?.combatSpecialAbilities?.[id],
    getDynamicMagicalSpecialAbilityById: id => specialAbilities?.magicalSpecialAbilities?.[id],
    getDynamicStaffEnchantmentById: id => specialAbilities?.staffEnchantments?.[id],
    getDynamicFamiliarSpecialAbilityById: id => specialAbilities?.familiarSpecialAbilities?.[id],
    getDynamicKarmaSpecialAbilityById: id => specialAbilities?.karmaSpecialAbilities?.[id],
    getDynamicProtectiveWardingCircleSpecialAbilityById: id =>
      specialAbilities?.protectiveWardingCircleSpecialAbilities?.[id],
    getDynamicCombatStyleSpecialAbilityById: id =>
      specialAbilities?.combatStyleSpecialAbilities?.[id],
    getDynamicAdvancedCombatSpecialAbilityById: id =>
      specialAbilities?.advancedCombatSpecialAbilities?.[id],
    getDynamicCommandSpecialAbilityById: id => specialAbilities?.commandSpecialAbilities?.[id],
    getDynamicMagicStyleSpecialAbilityById: id =>
      specialAbilities?.magicStyleSpecialAbilities?.[id],
    getDynamicAdvancedMagicalSpecialAbilityById: id =>
      specialAbilities?.advancedMagicalSpecialAbilities?.[id],
    getDynamicSpellSwordEnchantmentById: id => specialAbilities?.spellSwordEnchantments?.[id],
    getDynamicDaggerRitualById: id => specialAbilities?.daggerRituals?.[id],
    getDynamicInstrumentEnchantmentById: id => specialAbilities?.instrumentEnchantments?.[id],
    getDynamicAttireEnchantmentById: id => specialAbilities?.attireEnchantments?.[id],
    getDynamicOrbEnchantmentById: id => specialAbilities?.orbEnchantments?.[id],
    getDynamicWandEnchantmentById: id => specialAbilities?.wandEnchantments?.[id],
    getDynamicBrawlingSpecialAbilityById: id => specialAbilities?.brawlingSpecialAbilities?.[id],
    getDynamicAncestorGlyphById: id => specialAbilities?.ancestorGlyphs?.[id],
    getDynamicCeremonialItemSpecialAbilityById: id =>
      specialAbilities?.ceremonialItemSpecialAbilities?.[id],
    getDynamicSermonById: id => specialAbilities?.sermons?.[id],
    getDynamicLiturgicalStyleSpecialAbilityById: id =>
      specialAbilities?.liturgicalStyleSpecialAbilities?.[id],
    getDynamicAdvancedKarmaSpecialAbilityById: id =>
      specialAbilities?.advancedKarmaSpecialAbilities?.[id],
    getDynamicVisionById: id => specialAbilities?.visions?.[id],
    getDynamicMagicalTraditionById: id => specialAbilities?.magicalTraditions?.[id],
    getDynamicBlessedTraditionById: id => specialAbilities?.blessedTraditions?.[id],
    getDynamicPactGiftById: id => specialAbilities?.pactGifts?.[id],
    getDynamicSikaryanDrainSpecialAbilityById: id =>
      specialAbilities?.sikaryanDrainSpecialAbilities?.[id],
    getDynamicLycantropicGiftById: id => specialAbilities?.lycantropicGifts?.[id],
    getDynamicSkillStyleSpecialAbilityById: id =>
      specialAbilities?.skillStyleSpecialAbilities?.[id],
    getDynamicAdvancedSkillSpecialAbilityById: id =>
      specialAbilities?.advancedSkillSpecialAbilities?.[id],
    getDynamicArcaneOrbEnchantmentById: id => specialAbilities?.arcaneOrbEnchantments?.[id],
    getDynamicCauldronEnchantmentById: id => specialAbilities?.cauldronEnchantments?.[id],
    getDynamicFoolsHatEnchantmentById: id => specialAbilities?.foolsHatEnchantments?.[id],
    getDynamicToyEnchantmentById: id => specialAbilities?.toyEnchantments?.[id],
    getDynamicBowlEnchantmentById: id => specialAbilities?.bowlEnchantments?.[id],
    getDynamicFatePointSexSpecialAbilityById: id =>
      specialAbilities?.fatePointSexSpecialAbilities?.[id],
    getDynamicSexSpecialAbilityById: id => specialAbilities?.sexSpecialAbilities?.[id],
    getDynamicWeaponEnchantmentById: id => specialAbilities?.weaponEnchantments?.[id],
    getDynamicSickleRitualById: id => specialAbilities?.sickleRituals?.[id],
    getDynamicRingEnchantmentById: id => specialAbilities?.ringEnchantments?.[id],
    getDynamicChronicleEnchantmentById: id => specialAbilities?.chronicleEnchantments?.[id],
    getDynamicKrallenkettenzauberById: id => specialAbilities?.krallenkettenzauber?.[id],
    getDynamicTrinkhornzauberById: id => specialAbilities?.trinkhornzauber?.[id],
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
    getStaticAdvantageById: id => staticAdvantages[id],
    getDynamicAdvantages: () => Object.values(dynamicAdvantages),
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
    getDynamicSpellById: id => dynamicSpells[id],
    getDynamicRitualById: id => dynamicRituals[id],
    getDynamicLiturgicalChantById: id => dynamicLiturgicalChants[id],
    getDynamicCeremonyById: id => dynamicCeremonies[id],
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
    getBlessedPrimaryAttribute: () => blessedPrimaryAttribute,
    getHighestMagicalPrimaryAttributes: () => magicalPrimaryAttributes.list,
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
    getStaticPublicationById: id => staticPublications[id],
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
    getDynamicAttributeById: id => attributes[id],
    getDynamicSkillById: id => skills[id],
    getDynamicCloseCombatTechniqueById: id => closeCombatTechniques[id],
    getDynamicRangedCombatTechniqueById: id => rangedCombatTechniques[id],
    getDynamicSpellById: id => spells[id],
    getDynamicRitualById: id => rituals[id],
    getDynamicLiturgicalChantById: id => liturgicalChants[id],
    getDynamicCeremonyById: id => ceremonies[id],
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
    getDynamicSkillById: id => dynamicSkills[id],
    getDynamicSpellById: id => dynamicSpells[id],
    getDynamicRitualById: id => dynamicRituals[id],
    getDynamicLiturgicalChantById: id => dynamicLiturgicalChants[id],
    getDynamicCeremonyById: id => dynamicCeremonys[id],
  }),
)

/**
 * Select the capabilities needed to check for a rule prerequisite.
 */
export const selectCapabilitiesForRulePrerequisite = createSelector(
  selectDynamicFocusRules,
  selectDynamicOptionalRules,
  (activeFocusRules, activeOptionalRules): Parameters<typeof checkRulePrerequisite>[0] => ({
    getDynamicFocusRuleById: id => activeFocusRules[id],
    getDynamicOptionalRuleById: id => activeOptionalRules[id],
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
  SelectGetById.Dynamic.State,
  (getDynamicStateById): Parameters<typeof checkStatePrerequisite>[0] => ({
    getDynamicStateById,
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

/**
 * Select the capabilities needed to check all prerequisites of a derived characteristic.
 */
export const selectCapabilitiesForPrerequisitesOfDerivedCharacteristic = createSelector(
  selectCapabilitiesForRulePrerequisite,
  (ruleCaps): Parameters<typeof FullCheck.checkPrerequisitesOfDerivedCharacteristic>[1] => ({
    ...ruleCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of a publication.
 */
export const selectCapabilitiesForPrerequisitesOfPublication = createSelector(
  selectCapabilitiesForPublicationPrerequisite,
  (publicationCaps): Parameters<typeof FullCheck.checkPrerequisitesOfPublication>[1] => ({
    ...publicationCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of a general entry.
 */
export const selectCapabilitiesForPrerequisitesOfGeneralEntry = createSelector(
  selectCapabilitiesForSexPrerequisite,
  selectCapabilitiesForRacePrerequisite,
  selectCapabilitiesForCulturePrerequisite,
  selectCapabilitiesForPactPrerequisite,
  selectCapabilitiesForSocialStatusPrerequisite,
  selectCapabilitiesForStatePrerequisite,
  selectCapabilitiesForRulePrerequisite,
  selectCapabilitiesForPrimaryAttributePrerequisite,
  selectCapabilitiesForActivatablePrerequisite,
  selectCapabilitiesForBlessedTraditionPrerequisite,
  selectCapabilitiesForMagicalTraditionPrerequisite,
  selectCapabilitiesForRatedPrerequisite,
  selectCapabilitiesForRatedMinimumNumberPrerequisite,
  selectCapabilitiesForRatedSumPrerequisite,
  selectCapabilitiesForExternalEnhancementPrerequisite,
  selectCapabilitiesForTextPrerequisite,
  selectCapabilitiesForSexualCharacteristicPrerequisite,
  (
    sexCaps,
    raceCaps,
    cultureCaps,
    pactCaps,
    socialStatusCaps,
    stateCaps,
    ruleCaps,
    primaryAttributeCaps,
    activatableCaps,
    blessedTraditionCaps,
    magicalTraditionCaps,
    ratedCaps,
    ratedMinimumNumberCaps,
    ratedSumCaps,
    externalEnhancementCaps,
    textCaps,
    sexualCharacteristicCaps,
  ): Parameters<typeof FullCheck.checkPrerequisitesOfGeneralEntry>[1] => ({
    ...sexCaps,
    ...raceCaps,
    ...cultureCaps,
    ...pactCaps,
    ...socialStatusCaps,
    ...stateCaps,
    ...ruleCaps,
    ...primaryAttributeCaps,
    ...activatableCaps,
    ...blessedTraditionCaps,
    ...magicalTraditionCaps,
    ...ratedCaps,
    ...ratedMinimumNumberCaps,
    ...ratedSumCaps,
    ...externalEnhancementCaps,
    ...textCaps,
    ...sexualCharacteristicCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of a general entry with levels.
 */
export const selectCapabilitiesForPrerequisitesOfGeneralEntryWithLevels = createSelector(
  selectCapabilitiesForSexPrerequisite,
  selectCapabilitiesForRacePrerequisite,
  selectCapabilitiesForCulturePrerequisite,
  selectCapabilitiesForPactPrerequisite,
  selectCapabilitiesForSocialStatusPrerequisite,
  selectCapabilitiesForStatePrerequisite,
  selectCapabilitiesForRulePrerequisite,
  selectCapabilitiesForPrimaryAttributePrerequisite,
  selectCapabilitiesForActivatablePrerequisite,
  selectCapabilitiesForBlessedTraditionPrerequisite,
  selectCapabilitiesForMagicalTraditionPrerequisite,
  selectCapabilitiesForRatedPrerequisite,
  selectCapabilitiesForRatedMinimumNumberPrerequisite,
  selectCapabilitiesForRatedSumPrerequisite,
  selectCapabilitiesForExternalEnhancementPrerequisite,
  selectCapabilitiesForTextPrerequisite,
  selectCapabilitiesForSexualCharacteristicPrerequisite,
  (
    sexCaps,
    raceCaps,
    cultureCaps,
    pactCaps,
    socialStatusCaps,
    stateCaps,
    ruleCaps,
    primaryAttributeCaps,
    activatableCaps,
    blessedTraditionCaps,
    magicalTraditionCaps,
    ratedCaps,
    ratedMinimumNumberCaps,
    ratedSumCaps,
    externalEnhancementCaps,
    textCaps,
    sexualCharacteristicCaps,
  ): Parameters<typeof FullCheck.checkPrerequisitesOfGeneralEntryWithLevels>[2] => ({
    ...sexCaps,
    ...raceCaps,
    ...cultureCaps,
    ...pactCaps,
    ...socialStatusCaps,
    ...stateCaps,
    ...ruleCaps,
    ...primaryAttributeCaps,
    ...activatableCaps,
    ...blessedTraditionCaps,
    ...magicalTraditionCaps,
    ...ratedCaps,
    ...ratedMinimumNumberCaps,
    ...ratedSumCaps,
    ...externalEnhancementCaps,
    ...textCaps,
    ...sexualCharacteristicCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of a profession.
 */
export const selectCapabilitiesForPrerequisitesOfProfession = createSelector(
  selectCapabilitiesForSexPrerequisite,
  selectCapabilitiesForRacePrerequisite,
  selectCapabilitiesForCulturePrerequisite,
  selectCapabilitiesForActivatablePrerequisite,
  selectCapabilitiesForRatedPrerequisite,
  (
    sexCaps,
    raceCaps,
    cultureCaps,
    activatableCaps,
    ratedCaps,
  ): Parameters<typeof FullCheck.checkPrerequisitesOfProfession>[1] => ({
    ...sexCaps,
    ...raceCaps,
    ...cultureCaps,
    ...activatableCaps,
    ...ratedCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of an advantage or disadvantage.
 */
export const selectCapabilitiesForPrerequisitesOfAdvantageOrDisadvantage = createSelector(
  selectCapabilitiesForCommonSuggestedByRCPPrerequisite,
  selectCapabilitiesForSexPrerequisite,
  selectCapabilitiesForRacePrerequisite,
  selectCapabilitiesForCulturePrerequisite,
  selectCapabilitiesForPactPrerequisite,
  selectCapabilitiesForSocialStatusPrerequisite,
  selectCapabilitiesForStatePrerequisite,
  selectCapabilitiesForRulePrerequisite,
  selectCapabilitiesForPrimaryAttributePrerequisite,
  selectCapabilitiesForActivatablePrerequisite,
  selectCapabilitiesForBlessedTraditionPrerequisite,
  selectCapabilitiesForMagicalTraditionPrerequisite,
  selectCapabilitiesForRatedPrerequisite,
  selectCapabilitiesForRatedMinimumNumberPrerequisite,
  selectCapabilitiesForRatedSumPrerequisite,
  selectCapabilitiesForExternalEnhancementPrerequisite,
  selectCapabilitiesForTextPrerequisite,
  selectCapabilitiesForAncestorBloodPrerequisite,
  selectCapabilitiesForSexualCharacteristicPrerequisite,
  (
    commonSuggestedByRCPCaps,
    sexCaps,
    raceCaps,
    cultureCaps,
    pactCaps,
    socialStatusCaps,
    stateCaps,
    ruleCaps,
    primaryAttributeCaps,
    activatableCaps,
    blessedTraditionCaps,
    magicalTraditionCaps,
    ratedCaps,
    ratedMinimumNumberCaps,
    ratedSumCaps,
    externalEnhancementCaps,
    textCaps,
    ancestorBloodCaps,
    sexualCharacteristicCaps,
  ): Parameters<typeof FullCheck.checkPrerequisitesOfAdvantageOrDisadvantage>[4] => ({
    ...commonSuggestedByRCPCaps,
    ...sexCaps,
    ...raceCaps,
    ...cultureCaps,
    ...pactCaps,
    ...socialStatusCaps,
    ...stateCaps,
    ...ruleCaps,
    ...primaryAttributeCaps,
    ...activatableCaps,
    ...blessedTraditionCaps,
    ...magicalTraditionCaps,
    ...ratedCaps,
    ...ratedMinimumNumberCaps,
    ...ratedSumCaps,
    ...externalEnhancementCaps,
    ...textCaps,
    ...ancestorBloodCaps,
    ...sexualCharacteristicCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of an arcane tradition.
 */
export const selectCapabilitiesForPrerequisitesOfArcaneTradition = createSelector(
  selectCapabilitiesForSexPrerequisite,
  selectCapabilitiesForCulturePrerequisite,
  (sexCaps, cultureCaps): Parameters<typeof FullCheck.checkPrerequisitesOfArcaneTradition>[1] => ({
    ...sexCaps,
    ...cultureCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of a personality trait.
 */
export const selectCapabilitiesForPrerequisitesOfPersonalityTrait = createSelector(
  selectCapabilitiesForCulturePrerequisite,
  selectCapabilitiesForTextPrerequisite,
  (
    cultureCaps,
    textCaps,
  ): Parameters<typeof FullCheck.checkPrerequisitesOfPersonalityTrait>[1] => ({
    ...cultureCaps,
    ...textCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of a spellwork.
 */
export const selectCapabilitiesForPrerequisitesOfSpellwork = createSelector(
  selectCapabilitiesForRulePrerequisite,
  selectCapabilitiesForRatedPrerequisite,
  (ruleCaps, ratedCaps): Parameters<typeof FullCheck.checkPrerequisitesOfSpellwork>[1] => ({
    ...ruleCaps,
    ...ratedCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of a liturgy.
 */
export const selectCapabilitiesForPrerequisitesOfLiturgy = createSelector(
  selectCapabilitiesForRulePrerequisite,
  (ruleCaps): Parameters<typeof FullCheck.checkPrerequisitesOfLiturgy>[1] => ({
    ...ruleCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of an influence.
 */
export const selectCapabilitiesForPrerequisitesOfInfluence = createSelector(
  selectCapabilitiesForInfluencePrerequisite,
  selectCapabilitiesForTextPrerequisite,
  (influenceCaps, textCaps): Parameters<typeof FullCheck.checkPrerequisitesOfInfluence>[1] => ({
    ...influenceCaps,
    ...textCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of a language.
 */
export const selectCapabilitiesForPrerequisitesOfLanguage = createSelector(
  selectCapabilitiesForRacePrerequisite,
  selectCapabilitiesForActivatablePrerequisite,
  selectCapabilitiesForTextPrerequisite,
  (
    raceCaps,
    activatableCaps,
    textCaps,
  ): Parameters<typeof FullCheck.checkPrerequisitesOfLanguage>[2] => ({
    ...raceCaps,
    ...activatableCaps,
    ...textCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of an animist power.
 */
export const selectCapabilitiesForPrerequisitesOfAnimistPower = createSelector(
  selectCapabilitiesForAnimistPowerPrerequisite,
  (animistPowerCaps): Parameters<typeof FullCheck.checkPrerequisitesOfAnimistPower>[1] => ({
    ...animistPowerCaps,
  }),
)

/**
 * Select the capabilities needed to check all prerequisites of a geode ritual.
 */
export const selectCapabilitiesForPrerequisitesOfGeodeRitual = createSelector(
  selectCapabilitiesForInfluencePrerequisite,
  (influenceCaps): Parameters<typeof FullCheck.checkPrerequisitesOfGeodeRitual>[1] => ({
    ...influenceCaps,
  }),
)
