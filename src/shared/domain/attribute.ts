import { AttributeReference } from "optolith-database-schema/types/_SimpleReferences"
import { Rated } from "./ratedEntry.ts"

/**
 * The minimum value of an attribute.
 */
export const minimumAttributeValue = 8

/**
 * Creates an initial dynamic attribute entry.
 */
export const createEmptyDynamicAttribute = (id: number): Rated => ({
  id,
  value: minimumAttributeValue,
  cachedAdventurePoints: {
    general: 0,
    bound: 0,
  },
  dependencies: [],
  boundAdventurePoints: [],
})

/**
 * Returns the value for a dynamic attribute entry that might not exist yet.
 */
export const getAttributeValue = (dynamicEntry: Rated | undefined): number =>
  dynamicEntry?.value ?? minimumAttributeValue

/**
 * Returns the highest attribute value of a list of attribute references.
 */
export const getHighestAttributeValue = (
  getDynamicEntryById: (id: number) => Rated | undefined,
  refs: AttributeReference[],
): number =>
  Math.max(
    minimumAttributeValue,
    ...refs.map(ref => getAttributeValue(getDynamicEntryById(ref.id.attribute))),
  )
