import { CloseCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Close"
import { RangedCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Ranged"
import { AttributeReference } from "optolith-database-schema/types/_SimpleReferences"
import { Activatable, PredefinedActivatableOption, countOptions } from "./activatableEntry.ts"
import { getAttributeValue } from "./attribute.ts"
import { AttributeIdentifier } from "./identifier.ts"
import { Rated } from "./ratedEntry.ts"

/**
 * Returns the value for a dynamic combat technique entry that might not exist
 * yet.
 */
export const getCombatTechniqueValue = (dynamic: Rated | undefined): number => dynamic?.value ?? 6

/**
 * A combination of the different types of combat techniques.
 */
export type CombinedCombatTechnique =
  | { tag: "CloseCombatTechnique"; closeCombatTechnique: CloseCombatTechnique }
  | { tag: "RangedCombatTechnique"; rangedCombatTechnique: RangedCombatTechnique }

/**
 * Returns the identifier of a combined combat technique.
 */
export const getCombinedId = (
  combatTechnique: CombinedCombatTechnique,
): PredefinedActivatableOption["id"] =>
  combatTechnique.tag === "CloseCombatTechnique"
    ? { type: "CloseCombatTechnique", value: combatTechnique.closeCombatTechnique.id }
    : { type: "RangedCombatTechnique", value: combatTechnique.rangedCombatTechnique.id }

/**
 * Returns the primary attribute of a combined combat technique.
 */
export const getCombinedPrimaryAttribute = (
  combatTechnique: CombinedCombatTechnique,
): AttributeReference[] =>
  combatTechnique.tag === "CloseCombatTechnique"
    ? combatTechnique.closeCombatTechnique.primary_attribute
    : combatTechnique.rangedCombatTechnique.primary_attribute

const getPrimaryAttributeModifier = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  ids: number[],
): number => {
  const primaryAttributeValues = ids.map(id => getAttributeValue(getDynamicAttribute(id)))
  // return +1 for every 3 points above 8
  return Math.max(Math.floor((Math.max(...primaryAttributeValues) - 8) / 3), 0)
}

const getAttackBase = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  primaryAttributeIds: number[],
  dynamicEntry: Rated | undefined,
): number =>
  getPrimaryAttributeModifier(getDynamicAttribute, primaryAttributeIds) +
  getCombatTechniqueValue(dynamicEntry)

/**
 * Returns the attack base for a close combat technique.
 */
export const getAttackBaseForClose = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  dynamicEntry: Rated | undefined,
): number => getAttackBase(getDynamicAttribute, [AttributeIdentifier.Courage], dynamicEntry)

/**
 * Returns the attack base for a ranged combat technique.
 */
export const getAttackBaseForRanged = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  staticEntry: RangedCombatTechnique,
  dynamicEntry: Rated | undefined,
): number =>
  getAttackBase(
    getDynamicAttribute,
    staticEntry.primary_attribute.map(ref => ref.id.attribute),
    dynamicEntry,
  )

/**
 * Returns the parry base for a close combat technique.
 */
export const getParryBaseForClose = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  staticEntry: CloseCombatTechnique,
  dynamicEntry: Rated | undefined,
): number | undefined => {
  if (staticEntry.special.can_parry) {
    const primaryAttributeModifier = getPrimaryAttributeModifier(
      getDynamicAttribute,
      staticEntry.primary_attribute.map(ref => ref.id.attribute),
    )
    const combatTechniqueRating = getCombatTechniqueValue(dynamicEntry)
    return primaryAttributeModifier + Math.round(combatTechniqueRating / 2)
  }

  return undefined
}

/**
 * Returns the highest required attribute and its value for a combat technique,
 * if any.
 */
export const getHighestRequiredAttributeForCombatTechnique = (
  getSingleHighestPrimaryAttributeId: (primaryAttributeIds: number[]) => number | undefined,
  staticCombatTechnique: CombinedCombatTechnique,
  dynamicCombatTechnique: Rated,
  exceptionalCombatTechnique: Activatable | undefined,
): { id: number; value: number } | undefined => {
  const idObject = getCombinedId(staticCombatTechnique)
  const primaryAttribute = getCombinedPrimaryAttribute(staticCombatTechnique)

  const singleHighestAttributeId = getSingleHighestPrimaryAttributeId(
    primaryAttribute.map(ref => ref.id.attribute),
  )

  if (singleHighestAttributeId === undefined) {
    return undefined
  }

  const exceptionalCombatTechniqueBonus = countOptions(exceptionalCombatTechnique, idObject)

  return {
    id: singleHighestAttributeId,
    value: dynamicCombatTechnique.value - 2 - exceptionalCombatTechniqueBonus,
  }
}
