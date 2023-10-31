/**
 * This module includes validation logic for a possible prerequisite for a
 * certain entry type. It should not be directly used; instead, use the
 * functions that check all possible prerequisites, including logical
 * combinators and level-dependent prerequisites.
 */

import {
  AdvantageDisadvantagePrerequisiteGroup,
  AnimistPowerPrerequisiteGroup,
  ArcaneTraditionPrerequisiteGroup,
  DerivedCharacteristicPrerequisiteGroup,
  EnhancementPrerequisiteGroup,
  GeneralPrerequisiteGroup,
  GeodeRitualPrerequisiteGroup,
  InfluencePrerequisiteGroup,
  LanguagePrerequisiteGroup,
  LiturgyPrerequisiteGroup,
  PersonalityTraitPrerequisiteGroup,
  PreconditionGroup,
  ProfessionPrerequisiteGroup,
  PublicationPrerequisiteGroup,
  SpellworkPrerequisiteGroup,
} from "optolith-database-schema/types/prerequisites/PrerequisiteGroups"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { checkActivatablePrerequisite } from "./single/activatablePrerequisiteValidation.ts"
import { checkAncestorBloodPrerequisite } from "./single/ancestorBloodPrerequisiteValidation.ts"
import { checkAnimistPowerPrerequisite } from "./single/animistPowerPrerequisiteValidation.ts"
import { checkCommonSuggestedByRCPPrerequisite } from "./single/commonSuggestedForRCPPrerequisiteValidation.ts"
import { checkCulturePrerequisite } from "./single/culturePrerequisiteValidation.ts"
import {
  checkExternalEnhancementPrerequisite,
  checkInternalEnhancementPrerequisite,
} from "./single/enhancementPrerequisiteValidation.ts"
import { checkInfluencePrerequisite } from "./single/influencePrerequisiteValidation.ts"
import { checkPactPrerequisite } from "./single/pactPrerequisiteValidation.ts"
import { checkPrimaryAttributePrerequisite } from "./single/primaryAttributePrerequisiteValidation.ts"
import { checkPublicationPrerequisite } from "./single/publicationPrerequisiteValidation.ts"
import { checkRacePrerequisite } from "./single/racePrerequisiteValidation.ts"
import { checkRatedMinimumNumberPrerequisite } from "./single/ratedMinimumNumberPrerequisiteValidation.ts"
import { checkRatedPrerequisite } from "./single/ratedPrerequisiteValidation.ts"
import { checkRatedSumPrerequisite } from "./single/ratedSumPrerequisiteValidation.ts"
import { checkRulePrerequisite } from "./single/rulePrerequisiteValidation.ts"
import { checkSexPrerequisite } from "./single/sexPrerequisiteValidation.ts"
import { checkSexualCharacteristicPrerequisite } from "./single/sexualCharacteristicPrerequisiteValidation.ts"
import { checkSocialStatusPrerequisite } from "./single/socialStatusPrerequisiteValidation.ts"
import { checkStatePrerequisite } from "./single/statePrerequisiteValidation.ts"
import { checkTextPrerequisite } from "./single/textPrerequisiteValidation.ts"
import {
  checkBlessedTraditionPrerequisite,
  checkMagicalTraditionPrerequisite,
} from "./single/traditionPrerequisiteValidation.ts"

/**
 * Checks a prerequisite of a derived characteristic if it’s matched.
 */
export const checkPrerequisiteOfDerivedCharacteristic = (
  capabilities: Parameters<typeof checkRulePrerequisite>[0],
  p: DerivedCharacteristicPrerequisiteGroup,
): boolean => checkRulePrerequisite(capabilities, p.rule)

/**
 * Checks a prerequisite of a publication if it’s matched.
 */
export const checkPrerequisiteOfPublication = (
  capabilities: Parameters<typeof checkPublicationPrerequisite>[0],
  p: PublicationPrerequisiteGroup,
): boolean => checkPublicationPrerequisite(capabilities, p.publication)

/**
 * Checks a prerequisite of a general entry if it’s matched.
 */
export const checkPrerequisiteOfGeneralEntry = (
  capabilities: Parameters<typeof checkSexPrerequisite>[0] &
    Parameters<typeof checkRacePrerequisite>[0] &
    Parameters<typeof checkCulturePrerequisite>[0] &
    Parameters<typeof checkPactPrerequisite>[0] &
    Parameters<typeof checkSocialStatusPrerequisite>[0] &
    Parameters<typeof checkStatePrerequisite>[0] &
    Parameters<typeof checkRulePrerequisite>[0] &
    Parameters<typeof checkPrimaryAttributePrerequisite>[0] &
    Parameters<typeof checkActivatablePrerequisite>[0] &
    Parameters<typeof checkBlessedTraditionPrerequisite>[0] &
    Parameters<typeof checkMagicalTraditionPrerequisite>[0] &
    Parameters<typeof checkRatedPrerequisite>[0] &
    Parameters<typeof checkRatedMinimumNumberPrerequisite>[0] &
    Parameters<typeof checkRatedSumPrerequisite>[0] &
    Parameters<typeof checkExternalEnhancementPrerequisite>[0] &
    Parameters<typeof checkTextPrerequisite>[0] &
    Parameters<typeof checkSexualCharacteristicPrerequisite>[0],
  p: GeneralPrerequisiteGroup,
): boolean => {
  switch (p.tag) {
    case "Sex":
      return checkSexPrerequisite(capabilities, p.sex)
    case "Race":
      return checkRacePrerequisite(capabilities, p.race)
    case "Culture":
      return checkCulturePrerequisite(capabilities, p.culture)
    case "Pact":
      return checkPactPrerequisite(capabilities, p.pact)
    case "SocialStatus":
      return checkSocialStatusPrerequisite(capabilities, p.social_status)
    case "State":
      return checkStatePrerequisite(capabilities, p.state)
    case "Rule":
      return checkRulePrerequisite(capabilities, p.rule)
    case "PrimaryAttribute":
      return checkPrimaryAttributePrerequisite(capabilities, p.primary_attribute)
    case "Activatable":
      return checkActivatablePrerequisite(capabilities, p.activatable)
    case "BlessedTradition":
      return checkBlessedTraditionPrerequisite(capabilities, p.blessed_tradition)
    case "MagicalTradition":
      return checkMagicalTraditionPrerequisite(capabilities, p.magical_tradition)
    case "Rated":
      return checkRatedPrerequisite(capabilities, p.rated)
    case "RatedMinimumNumber":
      return checkRatedMinimumNumberPrerequisite(capabilities, p.rated_minimum_number)
    case "RatedSum":
      return checkRatedSumPrerequisite(capabilities, p.rated_sum)
    case "ExternalEnhancement":
      return checkExternalEnhancementPrerequisite(capabilities, p.external_enhancement)
    case "Text":
      return checkTextPrerequisite(capabilities, p.text)
    case "SexualCharacteristic":
      return checkSexualCharacteristicPrerequisite(capabilities, p.sexual_characteristic)
    default:
      return assertExhaustive(p)
  }
}

/**
 * Checks a prerequisite of a profession if it’s matched.
 */
export const checkPrerequisiteOfProfession = (
  capabilities: Parameters<typeof checkSexPrerequisite>[0] &
    Parameters<typeof checkRacePrerequisite>[0] &
    Parameters<typeof checkCulturePrerequisite>[0] &
    Parameters<typeof checkActivatablePrerequisite>[0] &
    Parameters<typeof checkRatedPrerequisite>[0],
  p: ProfessionPrerequisiteGroup,
): boolean => {
  switch (p.tag) {
    case "Sex":
      return checkSexPrerequisite(capabilities, p.sex)
    case "Race":
      return checkRacePrerequisite(capabilities, p.race)
    case "Culture":
      return checkCulturePrerequisite(capabilities, p.culture)
    case "Activatable":
      return checkActivatablePrerequisite(capabilities, p.activatable)
    case "Rated":
      return checkRatedPrerequisite(capabilities, p.rated)
    default:
      return assertExhaustive(p)
  }
}

/**
 * Checks a prerequisite of a advantage disadvantage if it’s matched.
 */
export const checkPrerequisiteOfAdvantageOrDisadvantage = (
  capabilities: Parameters<typeof checkCommonSuggestedByRCPPrerequisite>[0] &
    Parameters<typeof checkSexPrerequisite>[0] &
    Parameters<typeof checkRacePrerequisite>[0] &
    Parameters<typeof checkCulturePrerequisite>[0] &
    Parameters<typeof checkPactPrerequisite>[0] &
    Parameters<typeof checkSocialStatusPrerequisite>[0] &
    Parameters<typeof checkStatePrerequisite>[0] &
    Parameters<typeof checkRulePrerequisite>[0] &
    Parameters<typeof checkPrimaryAttributePrerequisite>[0] &
    Parameters<typeof checkActivatablePrerequisite>[0] &
    Parameters<typeof checkBlessedTraditionPrerequisite>[0] &
    Parameters<typeof checkMagicalTraditionPrerequisite>[0] &
    Parameters<typeof checkRatedPrerequisite>[0] &
    Parameters<typeof checkRatedMinimumNumberPrerequisite>[0] &
    Parameters<typeof checkRatedSumPrerequisite>[0] &
    Parameters<typeof checkExternalEnhancementPrerequisite>[0] &
    Parameters<typeof checkTextPrerequisite>[0] &
    Parameters<typeof checkAncestorBloodPrerequisite>[0] &
    Parameters<typeof checkSexualCharacteristicPrerequisite>[0],
  p: AdvantageDisadvantagePrerequisiteGroup,
  sourceKind: "Advantage" | "Disadvantage",
  sourceId: number,
): boolean => {
  switch (p.tag) {
    case "CommonSuggestedByRCP":
      return checkCommonSuggestedByRCPPrerequisite(capabilities, sourceKind, sourceId)
    case "Sex":
      return checkSexPrerequisite(capabilities, p.sex)
    case "Race":
      return checkRacePrerequisite(capabilities, p.race)
    case "Culture":
      return checkCulturePrerequisite(capabilities, p.culture)
    case "Pact":
      return checkPactPrerequisite(capabilities, p.pact)
    case "SocialStatus":
      return checkSocialStatusPrerequisite(capabilities, p.social_status)
    case "State":
      return checkStatePrerequisite(capabilities, p.state)
    case "Rule":
      return checkRulePrerequisite(capabilities, p.rule)
    case "PrimaryAttribute":
      return checkPrimaryAttributePrerequisite(capabilities, p.primary_attribute)
    case "Activatable":
      return checkActivatablePrerequisite(capabilities, p.activatable)
    case "BlessedTradition":
      return checkBlessedTraditionPrerequisite(capabilities, p.blessed_tradition)
    case "MagicalTradition":
      return checkMagicalTraditionPrerequisite(capabilities, p.magical_tradition)
    case "Rated":
      return checkRatedPrerequisite(capabilities, p.rated)
    case "RatedMinimumNumber":
      return checkRatedMinimumNumberPrerequisite(capabilities, p.rated_minimum_number)
    case "RatedSum":
      return checkRatedSumPrerequisite(capabilities, p.rated_sum)
    case "ExternalEnhancement":
      return checkExternalEnhancementPrerequisite(capabilities, p.external_enhancement)
    case "Text":
      return checkTextPrerequisite(capabilities, p.text)
    case "NoOtherAncestorBloodAdvantage":
      return checkAncestorBloodPrerequisite(
        capabilities,
        p.no_other_ancestor_blood_advantage,
        sourceId,
      )
    case "SexualCharacteristic":
      return checkSexualCharacteristicPrerequisite(capabilities, p.sexual_characteristic)
    default:
      return assertExhaustive(p)
  }
}

/**
 * Checks a prerequisite of a arcane tradition if it’s matched.
 */
export const checkPrerequisiteOfArcaneTradition = (
  capabilities: Parameters<typeof checkSexPrerequisite>[0] &
    Parameters<typeof checkCulturePrerequisite>[0],
  p: ArcaneTraditionPrerequisiteGroup,
): boolean => {
  switch (p.tag) {
    case "Sex":
      return checkSexPrerequisite(capabilities, p.sex)
    case "Culture":
      return checkCulturePrerequisite(capabilities, p.culture)
    default:
      return assertExhaustive(p)
  }
}

/**
 * Checks a prerequisite of a personality trait if it’s matched.
 */
export const checkPrerequisiteOfPersonalityTrait = (
  capabilities: Parameters<typeof checkCulturePrerequisite>[0] &
    Parameters<typeof checkTextPrerequisite>[0],
  p: PersonalityTraitPrerequisiteGroup,
): boolean => {
  switch (p.tag) {
    case "Culture":
      return checkCulturePrerequisite(capabilities, p.culture)
    case "Text":
      return checkTextPrerequisite(capabilities, p.text)
    default:
      return assertExhaustive(p)
  }
}

/**
 * Checks a prerequisite of a spellwork if it’s matched.
 */
export const checkPrerequisiteOfSpellwork = (
  capabilities: Parameters<typeof checkRulePrerequisite>[0] &
    Parameters<typeof checkRatedPrerequisite>[0],
  p: SpellworkPrerequisiteGroup,
): boolean => {
  switch (p.tag) {
    case "Rule":
      return checkRulePrerequisite(capabilities, p.rule)
    case "Rated":
      return checkRatedPrerequisite(capabilities, p.rated)
    default:
      return assertExhaustive(p)
  }
}

/**
 * Checks a prerequisite of a liturgy if it’s matched.
 */
export const checkPrerequisiteOfLiturgy = (
  capabilities: Parameters<typeof checkRulePrerequisite>[0],
  p: LiturgyPrerequisiteGroup,
): boolean => checkRulePrerequisite(capabilities, p.rule)

/**
 * Checks a prerequisite of a influence if it’s matched.
 */
export const checkPrerequisiteOfInfluence = (
  capabilities: Parameters<typeof checkInfluencePrerequisite>[0] &
    Parameters<typeof checkTextPrerequisite>[0],
  p: InfluencePrerequisiteGroup,
): boolean => {
  switch (p.tag) {
    case "Influence":
      return checkInfluencePrerequisite(capabilities, p.influence)
    case "Text":
      return checkTextPrerequisite(capabilities, p.text)
    default:
      return assertExhaustive(p)
  }
}

/**
 * Checks a prerequisite of a language if it’s matched.
 */
export const checkPrerequisiteOfLanguage = (
  capabilities: Parameters<typeof checkRacePrerequisite>[0] &
    Parameters<typeof checkActivatablePrerequisite>[0] &
    Parameters<typeof checkTextPrerequisite>[0],
  p: LanguagePrerequisiteGroup,
): boolean => {
  switch (p.tag) {
    case "Race":
      return checkRacePrerequisite(capabilities, p.race)
    case "Activatable":
      return checkActivatablePrerequisite(capabilities, p.activatable)
    case "Text":
      return checkTextPrerequisite(capabilities, p.text)
    default:
      return assertExhaustive(p)
  }
}

/**
 * Checks a prerequisite of a animist power if it’s matched.
 */
export const checkPrerequisiteOfAnimistPower = (
  capabilities: Parameters<typeof checkAnimistPowerPrerequisite>[0],
  p: AnimistPowerPrerequisiteGroup,
): boolean => checkAnimistPowerPrerequisite(capabilities, p.animist_power)

/**
 * Checks a prerequisite of a geode ritual if it’s matched.
 */
export const checkPrerequisiteOfGeodeRitual = (
  capabilities: Parameters<typeof checkInfluencePrerequisite>[0],
  p: GeodeRitualPrerequisiteGroup,
): boolean => checkInfluencePrerequisite(capabilities, p.influence)

/**
 * Checks a prerequisite of a enhancement if it’s matched.
 */
export const checkPrerequisiteOfEnhancement = (
  capabilities: Parameters<typeof checkInternalEnhancementPrerequisite>[0],
  p: EnhancementPrerequisiteGroup,
): boolean => checkInternalEnhancementPrerequisite(capabilities, p.internal_enhancement)

/**
 * Checks prerequisite’s precondition if it’s matched.
 */
export const checkPrecondition = (
  capabilities: Parameters<typeof checkPublicationPrerequisite>[0] &
    Parameters<typeof checkSexualCharacteristicPrerequisite>[0],
  p: PreconditionGroup,
): boolean => {
  switch (p.tag) {
    case "Publication":
      return checkPublicationPrerequisite(capabilities, p.publication)
    case "SexualCharacteristic":
      return checkSexualCharacteristicPrerequisite(capabilities, p.sexual_characteristic)
    default:
      return assertExhaustive(p)
  }
}
