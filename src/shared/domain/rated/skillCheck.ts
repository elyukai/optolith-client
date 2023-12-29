import { Attribute } from "optolith-database-schema/types/Attribute"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { IdValuePair, getSingleHighestPair } from "../idValue.ts"
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
  getStaticAttribute: (id: number) => Attribute | undefined,
  check: SkillCheck,
): SkillCheckAttributes => [
  getStaticAttribute(check[0].id.attribute)!,
  getStaticAttribute(check[1].id.attribute)!,
  getStaticAttribute(check[2].id.attribute)!,
]

/**
 * Returns the attribute values of a skill check.
 */
export const getSkillCheckValues = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  check: SkillCheck,
): SkillCheckValues => [
  getAttributeValue(getDynamicAttribute(check[0].id.attribute)),
  getAttributeValue(getDynamicAttribute(check[1].id.attribute)),
  getAttributeValue(getDynamicAttribute(check[2].id.attribute)),
]

/**
 * Returns the attributes of a skill check, paired with their attribute
 * identifiers.
 */
export const getSkillCheckWithId = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  check: SkillCheck,
): SkillCheckValuesWithId =>
  zipTriple(check, getSkillCheckValues(getDynamicAttribute, check), (ref, value) => ({
    id: ref.id.attribute,
    value,
  }))

/**
 * Returns the attributes of a skill check, paired with their values.
 */
export const getDisplayedSkillCheck = (
  getStaticAttribute: (id: number) => Attribute | undefined,
  getDynamicAttribute: (id: number) => Rated | undefined,
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
  getDynamicAttribute: (id: number) => Rated | undefined,
  check: SkillCheck,
): number | undefined => getSingleHighestPair(getSkillCheckWithId(getDynamicAttribute, check))?.id

/**
 * Returns the single highest attribute value from a skill check.
 */
export const getHighestCheckAttributeValue = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  check: SkillCheck,
): number => Math.max(8, ...getSkillCheckValues(getDynamicAttribute, check))
