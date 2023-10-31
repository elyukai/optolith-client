import { Attribute } from "optolith-database-schema/types/Attribute"
import { createEmptyDynamicAttribute } from "./attribute.ts"
import { CombinedActiveBlessedTradition } from "./blessedTradition.ts"
import { CombinedActiveMagicalTradition } from "./magicalTradition.ts"
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
