import {
  AdvantageIdentifier,
  DisadvantageIdentifier,
} from "optolith-database-schema/types/_Identifier"
import {
  LiturgyIdentifier,
  SpecialAbilityIdentifier,
  SpellworkIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import {
  AdvantageDisadvantagePrerequisiteGroup,
  GeneralPrerequisiteGroup,
  LiturgyPrerequisiteGroup,
  SpellworkPrerequisiteGroup,
} from "optolith-database-schema/types/prerequisites/PrerequisiteGroups"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { RegistrationFunction } from "./registrationHelpers.ts"
import { registerOrUnregisterActivatablePrerequisiteAsDependency } from "./single/activatablePrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterNoOtherAncestorBloodAdvantagePrerequisiteAsDependency } from "./single/ancestorBloodAdvantagePrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterCommonSuggestedByRCPPrerequisiteAsDependency } from "./single/commonSuggestedByRCPPrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterCulturePrerequisiteAsDependency } from "./single/culturePrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterExternalEnhancementPrerequisiteAsDependency } from "./single/enhancementPrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterPactPrerequisiteAsDependency } from "./single/pactPrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterPrimaryAttributePrerequisiteAsDependency } from "./single/primaryAttributePrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterRacePrerequisiteAsDependency } from "./single/racePrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterRatedMinimumNumberPrerequisiteAsDependency } from "./single/ratedMinimumNumberPrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterRatedPrerequisiteAsDependency } from "./single/ratedPrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterRatedSumPrerequisiteAsDependency } from "./single/ratedSumPrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterRulePrerequisiteAsDependency } from "./single/rulePrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterSexPrerequisiteAsDependency } from "./single/sexPrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterSexualCharacteristicPrerequisiteAsDependency } from "./single/sexualCharacteristicPrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterSocialStatusPrerequisiteAsDependency } from "./single/socialStatusPrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterStatePrerequisiteAsDependency } from "./single/statePrerequisiteRegistrationAsDependency.ts"
import { registerOrUnregisterTextPrerequisiteAsDependency } from "./single/textPrerequisiteRegistrationAsDependency.ts"
import {
  registerOrUnregisterBlessedTraditionPrerequisiteAsDependency,
  registerOrUnregisterMagicalTraditionPrerequisiteAsDependency,
} from "./single/traditionPrerequisiteRegistrationAsDependency.ts"

/**
 * Registers or unregisters a prerequisite of a general entry as a dependency on
 * the character's draft.
 */
export const registerOrUnregisterPrerequisiteOfGeneralAsDependency: RegistrationFunction<
  GeneralPrerequisiteGroup,
  SpecialAbilityIdentifier,
  {
    closeCombatTechniqueIds: number[]
    rangedCombatTechniqueIds: number[]
    blessedTraditionChurchIds: number[]
    blessedTraditionShamanisticIds: number[]
    magicalTraditionIds: number[]
    magicalTraditionIdsThatCanLearnRituals: number[]
    magicalTraditionIdsThatCanBindFamiliars: number[]
    getSpellIdsByPropertyId: (id: number) => number[]
    getRitualIdsByPropertyId: (id: number) => number[]
    getLiturgicalChantIdsByAspectId: (id: number) => number[]
    getCeremonyIdsByAspectId: (id: number) => number[]
  }
> = (method, character, p, sourceId, index, isPartOfDisjunction, capabilities): void => {
  switch (p.tag) {
    case "Sex":
      return registerOrUnregisterSexPrerequisiteAsDependency(
        method,
        character,
        p.sex,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Race":
      return registerOrUnregisterRacePrerequisiteAsDependency(
        method,
        character,
        p.race,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Culture":
      return registerOrUnregisterCulturePrerequisiteAsDependency(
        method,
        character,
        p.culture,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Pact":
      return registerOrUnregisterPactPrerequisiteAsDependency(
        method,
        character,
        p.pact,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "SocialStatus":
      return registerOrUnregisterSocialStatusPrerequisiteAsDependency(
        method,
        character,
        p.social_status,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "State":
      return registerOrUnregisterStatePrerequisiteAsDependency(
        method,
        character,
        p.state,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Rule":
      return registerOrUnregisterRulePrerequisiteAsDependency(
        method,
        character,
        p.rule,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "PrimaryAttribute":
      return registerOrUnregisterPrimaryAttributePrerequisiteAsDependency(
        method,
        character,
        p.primary_attribute,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Activatable":
      return registerOrUnregisterActivatablePrerequisiteAsDependency(
        method,
        character,
        p.activatable,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "BlessedTradition":
      return registerOrUnregisterBlessedTraditionPrerequisiteAsDependency(
        method,
        character,
        p.blessed_tradition,
        sourceId,
        index,
        isPartOfDisjunction,
        capabilities,
      )
    case "MagicalTradition":
      return registerOrUnregisterMagicalTraditionPrerequisiteAsDependency(
        method,
        character,
        p.magical_tradition,
        sourceId,
        index,
        isPartOfDisjunction,
        capabilities,
      )
    case "Rated":
      return registerOrUnregisterRatedPrerequisiteAsDependency(
        method,
        character,
        p.rated,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "RatedMinimumNumber":
      return registerOrUnregisterRatedMinimumNumberPrerequisiteAsDependency(
        method,
        character,
        p.rated_minimum_number,
        sourceId,
        index,
        isPartOfDisjunction,
        capabilities,
      )
    case "RatedSum":
      return registerOrUnregisterRatedSumPrerequisiteAsDependency(
        method,
        character,
        p.rated_sum,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "ExternalEnhancement":
      return registerOrUnregisterExternalEnhancementPrerequisiteAsDependency(
        method,
        character,
        p.external_enhancement,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Text":
      return registerOrUnregisterTextPrerequisiteAsDependency(
        method,
        character,
        p.text,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "SexualCharacteristic":
      return registerOrUnregisterSexualCharacteristicPrerequisiteAsDependency(
        method,
        character,
        p.sexual_characteristic,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    default:
      return assertExhaustive(p)
  }
}

/**
 * Registers or unregisters a prerequisite of a profession as a dependency on
 * the character's draft.
 */
// export const registerOrUnregisterPrerequisiteOfProfessionAsDependency: RegistrationFunction<ProfessionPrerequisiteGroup, ProfessionIdentifier>  = (method, character, p, sourceId, index, isPartOfDisjunction, capabilities): void => {
//   switch (p.tag) {
//     default:
//       return assertExhaustive(p)
//   }
// }

/**
 * Registers or unregisters a prerequisite of an advantage or disadvantage as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterPrerequisiteOfAdvantageOrDisadvantageAsDependency: RegistrationFunction<
  AdvantageDisadvantagePrerequisiteGroup,
  AdvantageIdentifier | DisadvantageIdentifier,
  {
    ancestorBloodAdvantageIds: number[]
    closeCombatTechniqueIds: number[]
    rangedCombatTechniqueIds: number[]
    blessedTraditionChurchIds: number[]
    blessedTraditionShamanisticIds: number[]
    magicalTraditionIds: number[]
    magicalTraditionIdsThatCanLearnRituals: number[]
    magicalTraditionIdsThatCanBindFamiliars: number[]
    getSpellIdsByPropertyId: (id: number) => number[]
    getRitualIdsByPropertyId: (id: number) => number[]
    getLiturgicalChantIdsByAspectId: (id: number) => number[]
    getCeremonyIdsByAspectId: (id: number) => number[]
  }
> = (method, character, p, sourceId, index, isPartOfDisjunction, capabilities): void => {
  switch (p.tag) {
    case "CommonSuggestedByRCP":
      return registerOrUnregisterCommonSuggestedByRCPPrerequisiteAsDependency(
        method,
        character,
        p.common_suggested_by_rcp,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Sex":
      return registerOrUnregisterSexPrerequisiteAsDependency(
        method,
        character,
        p.sex,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Race":
      return registerOrUnregisterRacePrerequisiteAsDependency(
        method,
        character,
        p.race,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Culture":
      return registerOrUnregisterCulturePrerequisiteAsDependency(
        method,
        character,
        p.culture,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Pact":
      return registerOrUnregisterPactPrerequisiteAsDependency(
        method,
        character,
        p.pact,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "SocialStatus":
      return registerOrUnregisterSocialStatusPrerequisiteAsDependency(
        method,
        character,
        p.social_status,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "State":
      return registerOrUnregisterStatePrerequisiteAsDependency(
        method,
        character,
        p.state,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Rule":
      return registerOrUnregisterRulePrerequisiteAsDependency(
        method,
        character,
        p.rule,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "PrimaryAttribute":
      return registerOrUnregisterPrimaryAttributePrerequisiteAsDependency(
        method,
        character,
        p.primary_attribute,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Activatable":
      return registerOrUnregisterActivatablePrerequisiteAsDependency(
        method,
        character,
        p.activatable,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "BlessedTradition":
      return registerOrUnregisterBlessedTraditionPrerequisiteAsDependency(
        method,
        character,
        p.blessed_tradition,
        sourceId,
        index,
        isPartOfDisjunction,
        capabilities,
      )
    case "MagicalTradition":
      return registerOrUnregisterMagicalTraditionPrerequisiteAsDependency(
        method,
        character,
        p.magical_tradition,
        sourceId,
        index,
        isPartOfDisjunction,
        capabilities,
      )
    case "Rated":
      return registerOrUnregisterRatedPrerequisiteAsDependency(
        method,
        character,
        p.rated,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "RatedMinimumNumber":
      return registerOrUnregisterRatedMinimumNumberPrerequisiteAsDependency(
        method,
        character,
        p.rated_minimum_number,
        sourceId,
        index,
        isPartOfDisjunction,
        capabilities,
      )
    case "RatedSum":
      return registerOrUnregisterRatedSumPrerequisiteAsDependency(
        method,
        character,
        p.rated_sum,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "ExternalEnhancement":
      return registerOrUnregisterExternalEnhancementPrerequisiteAsDependency(
        method,
        character,
        p.external_enhancement,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Text":
      return registerOrUnregisterTextPrerequisiteAsDependency(
        method,
        character,
        p.text,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "NoOtherAncestorBloodAdvantage":
      return registerOrUnregisterNoOtherAncestorBloodAdvantagePrerequisiteAsDependency(
        method,
        character,
        p.no_other_ancestor_blood_advantage,
        sourceId,
        index,
        isPartOfDisjunction,
        capabilities,
      )
    case "SexualCharacteristic":
      return registerOrUnregisterSexualCharacteristicPrerequisiteAsDependency(
        method,
        character,
        p.sexual_characteristic,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    default:
      return assertExhaustive(p)
  }
}

/**
 * Registers or unregisters a prerequisite of a spellwork as a dependency on the
 * character's draft.
 */
// export const registerOrUnregisterPrerequisiteOfArcaneTraditionAsDependency: RegistrationFunction<ArcaneTraditionPrerequisiteGroup, ArcaneTraditionIdentifier>  = (method, character, p, sourceId, index, isPartOfDisjunction, capabilities): void => {
//   switch (p.tag) {
//     default:
//       return assertExhaustive(p)
//   }
// }

/**
 * Registers or unregisters a prerequisite of a spellwork as a dependency on the
 * character's draft.
 */
// export const registerOrUnregisterPrerequisiteOfPersonalityTraitAsDependency: RegistrationFunction<PersonalityTraitPrerequisiteGroup, PersonalityTraitIdentifier>  = (method, character, p, sourceId, index, isPartOfDisjunction, capabilities): void => {
//   switch (p.tag) {
//     default:
//       return assertExhaustive(p)
//   }
// }

/**
 * Registers or unregisters a prerequisite of a spellwork as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterPrerequisiteOfSpellworkAsDependency: RegistrationFunction<
  SpellworkPrerequisiteGroup,
  SpellworkIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  switch (p.tag) {
    case "Rule":
      return registerOrUnregisterRulePrerequisiteAsDependency(
        method,
        character,
        p.rule,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    case "Rated":
      return registerOrUnregisterRatedPrerequisiteAsDependency(
        method,
        character,
        p.rated,
        sourceId,
        index,
        isPartOfDisjunction,
      )
    default:
      return assertExhaustive(p)
  }
}

/**
 * Registers or unregisters a prerequisite of a liturgy as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterPrerequisiteOfLiturgyAsDependency: RegistrationFunction<
  LiturgyPrerequisiteGroup,
  LiturgyIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void =>
  registerOrUnregisterRulePrerequisiteAsDependency(
    method,
    character,
    p.rule,
    sourceId,
    index,
    isPartOfDisjunction,
  )
