import { Attribute } from "optolith-database-schema/types/Attribute"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { CombinedActiveBlessedTradition } from "../activatable/blessedTradition.ts"
import { CombinedActiveMagicalTradition } from "../activatable/magicalTradition.ts"
import { createEmptyDynamicAttribute } from "./attribute.ts"
import { RatedDependency, ValueRestriction } from "./ratedDependency.ts"
import { Rated } from "./ratedEntry.ts"

/**
 * A combination of a static and corresponding dynamic attribute entry.
 */
export type DisplayedPrimaryAttribute = {
  static: Attribute
  dynamic: Rated
}

/**
 * A list of the highest primary attributes of all active magical traditions,
 * and if they are halfed for calculating arcane energy.
 */
export type DisplayedMagicalPrimaryAttributes = {
  list: DisplayedPrimaryAttribute[]
  halfed: boolean
}

/**
 * A capability type for getting the blessed primary attribute, if any is
 * defined.
 */
export type GetHighestMagicalPrimaryAttributesCapability = () => DisplayedPrimaryAttribute[]

/**
 * Returns the highest primary attributes of all active magical traditions, and
 * if they are halfed for calculating arcane energy.
 */
export const getHighestMagicalPrimaryAttributes = (
  activeMagicalTraditions: CombinedActiveMagicalTradition[],
  getStaticAttribute: (id: number) => Attribute | undefined,
  getDynamicAttribute: (id: number) => Rated | undefined,
): DisplayedMagicalPrimaryAttributes => {
  const { map, halfed } = activeMagicalTraditions.reduce<{
    map: Map<number, DisplayedPrimaryAttribute>
    halfed: boolean
  }>(
    (currentlyHighest, magicalTradition) => {
      const staticPrimaryAttribute = magicalTradition.static.primary

      if (staticPrimaryAttribute === undefined) {
        return currentlyHighest
      } else {
        const {
          id: { attribute: id },
          use_half_for_arcane_energy,
        } = staticPrimaryAttribute
        const staticAttribute = getStaticAttribute(id)
        const dynamicAttribute = getDynamicAttribute(id) ?? createEmptyDynamicAttribute(id)

        if (staticAttribute === undefined) {
          return currentlyHighest
        } else if (
          currentlyHighest.map.size === 0 ||
          [...currentlyHighest.map.values()][0]!.dynamic.value < dynamicAttribute.value
        ) {
          return {
            map: new Map([[id, { static: staticAttribute, dynamic: dynamicAttribute }]]),
            halfed: currentlyHighest.halfed || use_half_for_arcane_energy,
          }
        } else if (
          [...currentlyHighest.map.values()][0]!.dynamic.value === dynamicAttribute.value
        ) {
          return {
            map: currentlyHighest.map.set(id, {
              static: staticAttribute,
              dynamic: dynamicAttribute,
            }),
            halfed: currentlyHighest.halfed || use_half_for_arcane_energy,
          }
        } else {
          return currentlyHighest
        }
      }
    },
    { map: new Map(), halfed: false },
  )

  return {
    list: [...map.values()],
    halfed,
  }
}

/**
 * A capability type for getting the blessed primary attribute, if any is
 * defined.
 */
export type GetBlessedPrimaryAttributeCapability = () => DisplayedPrimaryAttribute | undefined

/**
 * Returns the primary attribute of the active blessed tradition, if it has one.
 */
export const getBlessedPrimaryAttribute = (
  activeBlessedTradition: CombinedActiveBlessedTradition,
  getStaticAttribute: (id: number) => Attribute | undefined,
  getDynamicAttribute: (id: number) => Rated | undefined,
): DisplayedPrimaryAttribute | undefined => {
  const id = activeBlessedTradition.static.primary?.id.attribute

  if (id === undefined) {
    return undefined
  } else {
    const staticAttribute = getStaticAttribute(id)
    const dynamicAttribute = getDynamicAttribute(id) ?? createEmptyDynamicAttribute(id)

    if (staticAttribute === undefined) {
      return undefined
    } else {
      return { static: staticAttribute, dynamic: dynamicAttribute }
    }
  }
}

/**
 * Describes a dependency on a certain rated entry.
 */
export type PrimaryAttributeDependency = Readonly<{
  /**
   * The source of the dependency.
   */
  sourceId: ActivatableIdentifier

  /**
   * The top-level index of the prerequisite. If the prerequisite is part of a
   * group or disjunction, this is the index of the group or disjunction.
   */
  index: number

  /**
   * Is the source prerequisite is part of a prerequisite disjunction?
   */
  isPartOfDisjunction: boolean

  /**
   * The required value.
   */
  value: ValueRestriction
}>

/**
 * Converts a primary attribute dependency to a rated dependency.
 */
export const primaryAttributeDependencyToRatedDependency = (
  dep: PrimaryAttributeDependency,
): RatedDependency => ({
  source: dep.sourceId,
  index: dep.index,
  isPartOfDisjunction: dep.isPartOfDisjunction,
  value: { tag: "Fixed", value: dep.value },
})
