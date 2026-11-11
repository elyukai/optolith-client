import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ActivatableIdentifier } from "@optolith/database-schema/gen"
import { type Case, fromUniformCase } from "tsondb/schema/gen"
import type { Global } from "../../../global.ts"
import type { BaseCharacter } from "../../character.ts"
import { checkActivatablePrerequisite } from "./activatablePrerequisiteValidation.ts"
import { checkAncestorBloodPrerequisite } from "./ancestorBloodPrerequisiteValidation.ts"
import { checkAnimistPowerPrerequisite } from "./animistPowerPrerequisiteValidation.ts"
import { checkAnySpecialAbilityOfGroupPrerequisite } from "./anySpecialAbilityOfGroupPrerequisiteValidation.ts"
import { checkCommonSuggestedByRCPPrerequisite } from "./commonSuggestedForRCPPrerequisiteValidation.ts"
import { checkCulturePrerequisite } from "./culturePrerequisiteValidation.ts"
import { checkEnhancementPrerequisite } from "./enhancementPrerequisiteValidation.ts"
import { checkInfluencePrerequisite } from "./influencePrerequisiteValidation.ts"
import { checkPactPrerequisite } from "./pactPrerequisiteValidation.ts"
import { checkPersonalityTraitPrerequisite } from "./personalityTraitPrerequisiteValidation.ts"
import { checkPrimaryAttributePrerequisite } from "./primaryAttributePrerequisiteValidation.ts"
import { checkProfessionPrerequisite } from "./professionPrerequisiteValidation.ts"
import { checkPublicationPrerequisite } from "./publicationPrerequisiteValidation.ts"
import { checkRacePrerequisite } from "./racePrerequisiteValidation.ts"
import { checkRatedMinimumNumberPrerequisite } from "./ratedMinimumNumberPrerequisiteValidation.ts"
import { checkRatedPrerequisite } from "./ratedPrerequisiteValidation.ts"
import { checkRatedSumPrerequisite } from "./ratedSumPrerequisiteValidation.ts"
import { checkRulePrerequisite } from "./rulePrerequisiteValidation.ts"
import { checkSexPrerequisite } from "./sexPrerequisiteValidation.ts"
import { checkSexualCharacteristicPrerequisite } from "./sexualCharacteristicPrerequisiteValidation.ts"
import { checkSocialStatusPrerequisite } from "./socialStatusPrerequisiteValidation.ts"
import { checkStatePrerequisite } from "./statePrerequisiteValidation.ts"
import { checkTextPrerequisite } from "./textPrerequisiteValidation.ts"
import { checkTinyActivatablePrerequisite } from "./tinyActivatablePrerequisiteValidation.ts"
import {
  checkBlessedTraditionPrerequisite,
  checkMagicalTraditionPrerequisite,
} from "./traditionPrerequisiteValidation.ts"

export const prerequisiteValidatorMap = {
  CommonSuggestedByRCP: checkCommonSuggestedByRCPPrerequisite,
  Sex: checkSexPrerequisite,
  Race: checkRacePrerequisite,
  Culture: checkCulturePrerequisite,
  Profession: checkProfessionPrerequisite,
  Pact: checkPactPrerequisite,
  SocialStatus: checkSocialStatusPrerequisite,
  State: checkStatePrerequisite,
  Rule: checkRulePrerequisite,
  PrimaryAttribute: checkPrimaryAttributePrerequisite,
  Activatable: checkActivatablePrerequisite,
  BlessedTradition: checkBlessedTraditionPrerequisite,
  MagicalTradition: checkMagicalTraditionPrerequisite,
  Rated: checkRatedPrerequisite,
  RatedMinimumNumber: checkRatedMinimumNumberPrerequisite,
  RatedSum: checkRatedSumPrerequisite,
  Enhancement: checkEnhancementPrerequisite,
  Text: checkTextPrerequisite,
  NoOtherAncestorBloodAdvantage: checkAncestorBloodPrerequisite,
  SexualCharacteristic: checkSexualCharacteristicPrerequisite,
  Publication: checkPublicationPrerequisite,
  PersonalityTrait: checkPersonalityTraitPrerequisite,
  Influence: checkInfluencePrerequisite,
  AnimistPower: checkAnimistPowerPrerequisite,
  TinyActivatable: checkTinyActivatablePrerequisite,
  AnySpecialAbilityOfGroup: checkAnySpecialAbilityOfGroupPrerequisite,
} satisfies Record<string, (caps: any, prerequisite: any) => boolean>

export type PrerequisiteByType = {
  [K in keyof typeof prerequisiteValidatorMap]: Parameters<(typeof prerequisiteValidatorMap)[K]>[1]
}

type CapabilitiesByType = {
  [K in keyof typeof prerequisiteValidatorMap]: Parameters<(typeof prerequisiteValidatorMap)[K]>[0]
}

export type PrerequisiteOfType<K extends keyof PrerequisiteByType> = {
  [K_ in K]: Case<K_, PrerequisiteByType[K_]>
}[K]

export type AnyPrerequisite = PrerequisiteOfType<keyof PrerequisiteByType>

// Source - https://stackoverflow.com/a/50375286
// Posted by jcalz, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-26, License - CC BY-SA 4.0
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void
  ? I
  : never

export type AllCapabilities = UnionToIntersection<CapabilitiesByType[keyof CapabilitiesByType]>

export type CapabilitiesForType<P extends { kind: keyof CapabilitiesByType }> = UnionToIntersection<
  CapabilitiesByType[P["kind"]]
>

export const validatePrerequisite = <P extends AnyPrerequisite>(
  prerequisite: P,
  caps: CapabilitiesForType<P>,
): boolean =>
  prerequisiteValidatorMap[prerequisite.kind](
    caps as any,
    prerequisite[prerequisite.kind as keyof typeof prerequisite] as any,
  )

export const createCapabilitiesFromCharacter = (
  global: Global,
  character: BaseCharacter,
): AllCapabilities => {
  const caps: AllCapabilities = {
    get activeAdvantages() {
      return character.advantages.active
    },
    get activeBlessedTraditions() {
      return character.specialAbilities.getSpecialAbilitiesCollection("BlessedTradition").active
    },
    get activeMagicalTraditions() {
      return character.specialAbilities.getSpecialAbilitiesCollection("MagicalTradition").active
    },
    get ancestorBloodAdvantagesCache() {
      return global.cache.ancestorBloodAdvantages
    },
    checkPrecondition(p) {
      return validatePrerequisite(p, caps)
    },
    get closeCombatTechniques() {
      return character.closeCombatTechniques.values
    },
    get culture() {
      return character.culture?.base
    },
    get cultureId() {
      return character.culture?.id
    },
    getActivatableById<E extends ActivatableIdentifier["kind"]>(id: Case<E, string>) {
      return character.getActivatableById(id)
    },
    getEnhancementById(id) {
      return global.db.getInstanceOfEntityById("Enhancement", id)
    },
    getInstanceById(...args) {
      return global.db.getInstanceOfEntityById(...args)
    },
    getRatedById(id) {
      return character.getRatedCollection(id.kind).getById(fromUniformCase(id))
    },
    getSkillById(id) {
      return character.skills.getById(id)
    },
    getSkillWithEnhancementsById(id) {
      return character.getRatedCollection(id.kind).getById(fromUniformCase(id))
    },
    getSocialStatusById(id) {
      return global.db.getInstanceOfEntityById("SocialStatus", id)
    },
    getLiturgicalChantsByAspect(id) {
      return [
        ...character.liturgicalChants.getActiveByAspect(id),
        ...character.ceremonies.getActiveByAspect(id),
      ]
    },
    getSpellworksByProperty(id) {
      return [
        ...character.spells.getActiveByProperty(id),
        ...character.rituals.getActiveByProperty(id),
      ]
    },
    get highestPrimaryMagicalAttribute() {
      return character.attributes.highestPrimaryMagicalAttributes?.value
    },
    isAnyActivatableActive(entity) {
      return character.getActivatableCollection(entity).hasActive
    },
    isFocusRuleActive(id) {
      return character.rules.isFocusRuleActive(id)
    },
    isOptionalRuleActive(id) {
      return character.rules.isOptionalRuleActive(id)
    },
    isPersonalityTraitActive(id) {
      return character.personalityTraits.isActive(id)
    },
    isStateActive(id) {
      return character.states.isActive(id)
    },
    isTinyActivatableActive(id) {
      switch (id.kind) {
        case "Cantrip":
          return character.cantrips.isActive(id.Cantrip) ?? false
        case "Blessing":
          return character.blessings.isActive(id.Blessing) ?? false
        default:
          return assertExhaustive(id)
      }
    },
    get pact() {
      return character.pact
    },
    get primaryBlessedAttribute() {
      return character.attributes.primaryBlessedAttribute?.value
    },
    get professionId() {
      return character.profession?.baseId
    },
    get professionVersion() {
      return character.profession?.version
    },
    get publicationOptions() {
      return character.rules.publicationOptions
    },
    get raceId() {
      return character.race?.id
    },
    get raceVariant() {
      return character.race?.variant
    },
    get rangedCombatTechniques() {
      return character.rangedCombatTechniques.values
    },
    get sex() {
      return character.personalData.sex
    },
    get socialStatus() {
      return character.personalData.socialStatus
    },
    get translateMap() {
      return global.locale.translateMap
    },
  }
  return caps
}
