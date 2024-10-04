import { CloseCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Close"
import { RangedCombatTechnique } from "optolith-database-schema/types/CombatTechnique_Ranged"
import { CombatTechniqueIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { AttributeReference } from "optolith-database-schema/types/_SimpleReferences"
import { mapNullable } from "../../utils/nullable.ts"
import { Activatable, countOptions } from "../activatable/activatableEntry.ts"
import { createImprovementCost } from "../adventurePoints/improvementCost.ts"
import { GetById } from "../getTypes.ts"
import { AttributeIdentifier } from "../identifier.ts"
import { createLibraryEntryCreator } from "../libraryEntry.ts"
import { getAttributeValue } from "./attribute.ts"
import { Rated } from "./ratedEntry.ts"

/**
 * The minimum value of a combat technique.
 */
export const minimumCombatTechniqueValue = 6

/**
 * Returns the value for a dynamic combat technique entry that might not exist
 * yet.
 */
export const getCombatTechniqueValue = (dynamic: Rated | undefined): number =>
  dynamic?.value ?? minimumCombatTechniqueValue

/**
 * Creates an initial dynamic skill entry.
 */
export const createEmptyDynamicCombatTechnique = (id: number): Rated => ({
  id,
  value: minimumCombatTechniqueValue,
  cachedAdventurePoints: {
    general: 0,
    bound: 0,
  },
  dependencies: [],
  boundAdventurePoints: [],
})

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
): CombatTechniqueIdentifier =>
  combatTechnique.tag === "CloseCombatTechnique"
    ? {
        tag: "CloseCombatTechnique",
        close_combat_technique: combatTechnique.closeCombatTechnique.id,
      }
    : {
        tag: "RangedCombatTechnique",
        ranged_combat_technique: combatTechnique.rangedCombatTechnique.id,
      }

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

/**
 * Get a JSON representation of the rules text for a close combat technique.
 */
export const getCloseCombatTechniqueLibraryEntry = createLibraryEntryCreator<
  CloseCombatTechnique,
  {
    getAttributeById: GetById.Static.Attribute
  }
>((entry, { getAttributeById }) => ({ translate, translateMap }) => {
  const translation = translateMap(entry.translations)

  if (translation === undefined) {
    return undefined
  }

  return {
    title: translation.name,
    className: "combat-technique close-combat-technique",
    content: [
      mapNullable(translation.special, value => ({
        label: translate("Special"),
        value,
      })),
      {
        label: translate("Primary Attribute"),
        value: entry.primary_attribute
          .map(attr => translateMap(getAttributeById(attr.id.attribute)?.translations)?.name)
          .join("/"),
      },
      createImprovementCost(translate, entry.improvement_cost),
    ],
    src: entry.src,
  }
})

/**
 * Get a JSON representation of the rules text for a ranged combat technique.
 */
export const getRangedCombatTechniqueLibraryEntry = createLibraryEntryCreator<
  RangedCombatTechnique,
  {
    getAttributeById: GetById.Static.Attribute
  }
>((entry, { getAttributeById }) => ({ translate, translateMap }) => {
  const translation = translateMap(entry.translations)

  if (translation === undefined) {
    return undefined
  }

  return {
    title: translation.name,
    className: "combat-technique ranged-combat-technique",
    content: [
      mapNullable(translation.special, value => ({
        label: translate("Special"),
        value,
      })),
      {
        label: translate("Primary Attribute"),
        value: entry.primary_attribute
          .map(attr => translateMap(getAttributeById(attr.id.attribute)?.translations)?.name)
          .join("/"),
      },
      createImprovementCost(translate, entry.improvement_cost),
    ],
    src: entry.src,
  }
})
