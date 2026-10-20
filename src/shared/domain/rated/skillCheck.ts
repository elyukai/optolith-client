import { Attribute, type Attribute_ID, SkillCheck } from "@optolith/database-schema/gen"
import { getSingleHighestPair, IdValuePair } from "../idValue.ts"
import { getAttributeValue } from "./attribute.ts"
import { Rated } from "./ratedEntry.ts"

type Triple<T> = [T, T, T]

const zipTriple = <T, U, V>(
  [a, b, c]: Triple<T>,
  [x, y, z]: Triple<U>,
  f: (x: T, y: U) => V,
): Triple<V> => [f(a, x), f(b, y), f(c, z)]

type SkillCheckAttributes = Triple<Attribute>
type SkillCheckValues = Triple<number>
type SkillCheckValuesWithId = Triple<IdValuePair>
type DisplayedSkillCheck = Triple<{ attribute: Attribute; value: number }>

/**
 * Returns the static attributes of a skill check.
 */
export const getSkillCheckAttributes = (
  getStaticAttribute: (id: Attribute_ID) => Attribute | undefined,
  check: SkillCheck,
): SkillCheckAttributes => [
  getStaticAttribute(check[0])!,
  getStaticAttribute(check[1])!,
  getStaticAttribute(check[2])!,
]

/**
 * Returns the attribute values of a skill check.
 */
export const getSkillCheckValues = (
  getDynamicAttribute: (id: Attribute_ID) => Rated | undefined,
  check: SkillCheck,
): SkillCheckValues => [
  getAttributeValue(getDynamicAttribute(check[0])),
  getAttributeValue(getDynamicAttribute(check[1])),
  getAttributeValue(getDynamicAttribute(check[2])),
]

/**
 * Returns the attributes of a skill check, paired with their attribute
 * identifiers.
 */
export const getSkillCheckWithId = (
  getDynamicAttribute: (id: Attribute_ID) => Rated | undefined,
  check: SkillCheck,
): SkillCheckValuesWithId =>
  zipTriple(check, getSkillCheckValues(getDynamicAttribute, check), (ref, value) => ({
    id: ref,
    value,
  }))

/**
 * Returns the attributes of a skill check, paired with their values.
 */
export const getDisplayedSkillCheck = (
  getStaticAttribute: (id: Attribute_ID) => Attribute | undefined,
  getDynamicAttribute: (id: Attribute_ID) => Rated | undefined,
  check: SkillCheck,
): DisplayedSkillCheck =>
  zipTriple(
    getSkillCheckAttributes(getStaticAttribute, check),
    getSkillCheckValues(getDynamicAttribute, check),
    (attribute, value) => ({ attribute, value }),
  )

/**
 * Returns the single highest attribute identifier from a skill check.
 */
export const getSingleHighestCheckAttributeId = (
  getDynamicAttribute: (id: Attribute_ID) => Rated | undefined,
  check: SkillCheck,
): Attribute_ID | undefined =>
  getSingleHighestPair(getSkillCheckWithId(getDynamicAttribute, check))?.id

/**
 * Returns the single highest attribute value from a skill check.
 */
export const getHighestCheckAttributeValue = (
  getDynamicAttribute: (id: Attribute_ID) => Rated | undefined,
  check: SkillCheck,
): number => Math.max(8, ...getSkillCheckValues(getDynamicAttribute, check))
