import { CloseCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Close"
import { RangedCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Ranged"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { filterNonNullable } from "../utils/array.ts"
import {
  Activatable,
  PredefinedActivatableOption,
  countOptions,
  isActive,
} from "./activatableEntry.ts"
import { getAttributeValue } from "./attribute.ts"
import { AttributeIdentifier } from "./identifier.ts"
import { Dependency, Rated, RatedMap, flattenMinimumRestrictions } from "./ratedEntry.ts"

export const getCombatTechniqueValue = (dynamic: Rated | undefined): number => dynamic?.value ?? 6

export type CombatTechnique =
  | { tag: "CloseCombatTechnique"; closeCombatTechnique: CloseCombatTechnique }
  | { tag: "RangedCombatTechnique"; rangedCombatTechnique: RangedCombatTechnique }

const getPrimaryAttributeModifier = (dynamicAttributes: RatedMap, ids: number[]): number => {
  const primaryAttributeValues = ids.map(id => getAttributeValue(dynamicAttributes[id]))
  // return +1 for every 3 points above 8
  return Math.max(Math.floor((Math.max(...primaryAttributeValues) - 8) / 3), 0)
}

const getAttackBase = (
  dynamicAttributes: RatedMap,
  primaryAttributeIds: number[],
  dynamicEntry: Rated | undefined,
): number =>
  getPrimaryAttributeModifier(dynamicAttributes, primaryAttributeIds) +
  getCombatTechniqueValue(dynamicEntry)

/**
 * Returns the attack base for a close combat technique.
 */
export const getAttackBaseForClose = (
  dynamicAttributes: RatedMap,
  dynamicEntry: Rated | undefined,
): number => getAttackBase(dynamicAttributes, [AttributeIdentifier.Courage], dynamicEntry)

/**
 * Returns the attack base for a ranged combat technique.
 */
export const getAttackBaseForRanged = (
  dynamicAttributes: RatedMap,
  staticEntry: RangedCombatTechnique,
  dynamicEntry: Rated | undefined,
): number =>
  getAttackBase(
    dynamicAttributes,
    staticEntry.primary_attribute.map(ref => ref.id.attribute),
    dynamicEntry,
  )

/**
 * Returns the parry base for a close combat technique.
 */
export const getParryBaseForClose = (
  dynamicAttributes: RatedMap,
  staticEntry: CloseCombatTechnique,
  dynamicEntry: Rated | undefined,
): number | undefined => {
  if (staticEntry.special.can_parry) {
    const primaryAttributeModifier = getPrimaryAttributeModifier(
      dynamicAttributes,
      staticEntry.primary_attribute.map(ref => ref.id.attribute),
    )
    const combatTechniqueRating = getCombatTechniqueValue(dynamicEntry)
    return primaryAttributeModifier + Math.round(combatTechniqueRating / 2)
  }

  return undefined
}

export const getCombatTechniqueMinimum = (
  rangedCombatTechniques: RatedMap,
  staticCombatTechnique: CombatTechnique,
  dynamicCombatTechnique: Rated,
  hunter: Activatable | undefined,
  filterApplyingDependencies: (dependencies: Dependency[]) => Dependency[],
): number => {
  const minimumValues: number[][] = [
    [6],
    flattenMinimumRestrictions(filterApplyingDependencies(dynamicCombatTechnique.dependencies)),
    isActive(hunter) &&
    staticCombatTechnique.tag === "RangedCombatTechnique" &&
    dynamicCombatTechnique.value >= 10 &&
    Object.values(rangedCombatTechniques)
      .map(getCombatTechniqueValue)
      .filter(value => value >= 10).length === 1
      ? [10]
      : [],
  ]

  return Math.max(...minimumValues.flat())
}

export const getCombatTechniqueMaximum = (
  attributes: RatedMap,
  combatTechnique: CombatTechnique,
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel | undefined,
  exceptionalSkill: Activatable | undefined,
): number => {
  const idObject: PredefinedActivatableOption["id"] =
    combatTechnique.tag === "CloseCombatTechnique"
      ? { type: "CloseCombatTechnique", value: combatTechnique.closeCombatTechnique.id }
      : { type: "RangedCombatTechnique", value: combatTechnique.rangedCombatTechnique.id }

  const primaryAttribute =
    combatTechnique.tag === "CloseCombatTechnique"
      ? combatTechnique.closeCombatTechnique.primary_attribute
      : combatTechnique.rangedCombatTechnique.primary_attribute

  const maximumValues = filterNonNullable([
    Math.max(...primaryAttribute.map(ref => getAttributeValue(attributes[ref.id.attribute]))) + 2,
    isInCharacterCreation && startExperienceLevel !== undefined
      ? startExperienceLevel.max_combat_technique_rating
      : undefined,
  ])

  const exceptionalSkillBonus = countOptions(exceptionalSkill, idObject)

  return Math.min(...maximumValues) + exceptionalSkillBonus
}

export const isCombatTechniqueDecreasable = (dynamic: Rated, min: number, canRemove: boolean) =>
  min < dynamic.value && canRemove

export const isCombatTechniqueIncreasable = (dynamic: Rated, max: number) => dynamic.value < max
