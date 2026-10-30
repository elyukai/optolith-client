import type { Character } from "../../character.ts"
import type { Case } from "../../databaseEnum.ts"
import type { RegistrationFunction, RegistrationMethod } from "../registrationHelpers.ts"
import { registerOrUnregisterActivatablePrerequisiteAsDependency } from "./activatable.ts"
import { registerOrUnregisterNoOtherAncestorBloodAdvantagePrerequisiteAsDependency } from "./ancestorBloodAdvantage.ts"
import { registerOrUnregisterAnimistPowerPrerequisiteAsDependency } from "./animistPower.ts"
import { registerOrUnregisterAnySpecialAbilityOfGroupPrerequisiteAsDependency } from "./anySpecialAbilityOfGroup.ts"
import { registerOrUnregisterBlessedTraditionPrerequisiteAsDependency } from "./blessedTradition.ts"
import { registerOrUnregisterCommonSuggestedByRCPPrerequisiteAsDependency } from "./commonSuggestedByRCP.ts"
import { registerOrUnregisterCulturePrerequisiteAsDependency } from "./culture.ts"
import { registerOrUnregisterEnhancementPrerequisiteAsDependency } from "./enhancement.ts"
import { registerOrUnregisterInfluencePrerequisiteAsDependency } from "./influence.ts"
import { registerOrUnregisterMagicalTraditionPrerequisiteAsDependency } from "./magicalTradition.ts"
import { registerOrUnregisterPactPrerequisiteAsDependency } from "./pact.ts"
import { registerOrUnregisterPersonalityTraitPrerequisiteAsDependency } from "./personalityTrait.ts"
import { registerOrUnregisterPrimaryAttributePrerequisiteAsDependency } from "./primaryAttribute.ts"
import { registerOrUnregisterPublicationPrerequisiteAsDependency } from "./publication.ts"
import { registerOrUnregisterRacePrerequisiteAsDependency } from "./race.ts"
import { registerOrUnregisterRatedPrerequisiteAsDependency } from "./rated.ts"
import { registerOrUnregisterRatedMinimumNumberPrerequisiteAsDependency } from "./ratedMinimumNumber.ts"
import { registerOrUnregisterRatedSumPrerequisiteAsDependency } from "./ratedSum.ts"
import { registerOrUnregisterRulePrerequisiteAsDependency } from "./rule.ts"
import { registerOrUnregisterSexPrerequisiteAsDependency } from "./sex.ts"
import { registerOrUnregisterSexualCharacteristicPrerequisiteAsDependency } from "./sexualCharacteristic.ts"
import { registerOrUnregisterSocialStatusPrerequisiteAsDependency } from "./socialStatus.ts"
import { registerOrUnregisterStatePrerequisiteAsDependency } from "./state.ts"
import { registerOrUnregisterTextPrerequisiteAsDependency } from "./text.ts"
import { registerOrUnregisterTinyActivatablePrerequisiteAsDependency } from "./tinyActivatable.ts"

const map = {
  Activatable: registerOrUnregisterActivatablePrerequisiteAsDependency,
  NoOtherAncestorBloodAdvantage:
    registerOrUnregisterNoOtherAncestorBloodAdvantagePrerequisiteAsDependency,
  AnimistPower: registerOrUnregisterAnimistPowerPrerequisiteAsDependency,
  CommonSuggestedByRCP: registerOrUnregisterCommonSuggestedByRCPPrerequisiteAsDependency,
  Culture: registerOrUnregisterCulturePrerequisiteAsDependency,
  Enhancement: registerOrUnregisterEnhancementPrerequisiteAsDependency,
  Influence: registerOrUnregisterInfluencePrerequisiteAsDependency,
  Pact: registerOrUnregisterPactPrerequisiteAsDependency,
  PrimaryAttribute: registerOrUnregisterPrimaryAttributePrerequisiteAsDependency,
  Publication: registerOrUnregisterPublicationPrerequisiteAsDependency,
  Race: registerOrUnregisterRacePrerequisiteAsDependency,
  RatedMinimumNumber: registerOrUnregisterRatedMinimumNumberPrerequisiteAsDependency,
  Rated: registerOrUnregisterRatedPrerequisiteAsDependency,
  RatedSum: registerOrUnregisterRatedSumPrerequisiteAsDependency,
  Rule: registerOrUnregisterRulePrerequisiteAsDependency,
  Sex: registerOrUnregisterSexPrerequisiteAsDependency,
  SexualCharacteristic: registerOrUnregisterSexualCharacteristicPrerequisiteAsDependency,
  SocialStatus: registerOrUnregisterSocialStatusPrerequisiteAsDependency,
  State: registerOrUnregisterStatePrerequisiteAsDependency,
  Text: registerOrUnregisterTextPrerequisiteAsDependency,
  MagicalTradition: registerOrUnregisterMagicalTraditionPrerequisiteAsDependency,
  BlessedTradition: registerOrUnregisterBlessedTraditionPrerequisiteAsDependency,
  TinyActivatable: registerOrUnregisterTinyActivatablePrerequisiteAsDependency,
  AnySpecialAbilityOfGroup: registerOrUnregisterAnySpecialAbilityOfGroupPrerequisiteAsDependency,
  PersonalityTrait: registerOrUnregisterPersonalityTraitPrerequisiteAsDependency,
}

type DependencyHandlerMap = typeof map

type SourceIdMap = {
  [K in keyof DependencyHandlerMap]: DependencyHandlerMap[K] extends RegistrationFunction<
    any,
    infer ID
  >
    ? ID
    : never
}

type SupportedPrerequisite = {
  [K in keyof DependencyHandlerMap]: Case<
    K,
    DependencyHandlerMap[K] extends RegistrationFunction<infer P, any> ? P : never
  >
}[keyof DependencyHandlerMap]

type DerivedSourceId<T extends SupportedPrerequisite> = SourceIdMap[T["kind"]]

export const registerOrUnregisterPrerequisiteAsDependencyForType = <
  T extends SupportedPrerequisite,
>(
  p: T,
  method: RegistrationMethod,
  character: Character,
  sourceId: DerivedSourceId<T>,
  index: number,
  isPartOfDisjunction: boolean,
): void =>
  (
    map[p.kind] as RegistrationFunction<
      T extends Case<string, object> ? T[T["kind"]] : undefined,
      typeof sourceId
    >
  )(
    p[p.kind as keyof T] as T extends Case<string, object> ? T[T["kind"]] : undefined,
    method,
    character,
    sourceId,
    index,
    isPartOfDisjunction,
  )
