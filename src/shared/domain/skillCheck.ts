import { Attribute } from "optolith-database-schema/types/Attribute"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { getAttributeValue } from "./attribute.ts"
import { RatedMap } from "./ratedEntry.ts"

type Triple<T> = [T, T, T]

const zipTriple = <T, U, V>(
  [a, b, c]: Triple<T>,
  [x, y, z]: Triple<U>,
  f: (x: T, y: U) => V,
): Triple<V> => [f(a, x), f(b, y), f(c, z)]

type SkillCheckAttributes = Triple<Attribute>
type SkillCheckValues = Triple<number>
type DisplayedSkillCheck = Triple<{ attribute: Attribute; value: number }>

/**
 * Returns the static attributes of a skill check.
 */
export const getSkillCheckAttributes = (
  attributes: Record<number, Attribute>,
  check: SkillCheck,
): SkillCheckAttributes => [
  attributes[check[0].id.attribute]!,
  attributes[check[1].id.attribute]!,
  attributes[check[2].id.attribute]!,
]

/**
 * Returns the attribute values of a skill check.
 */
export const getSkillCheckValues = (attributes: RatedMap, check: SkillCheck): SkillCheckValues => [
  getAttributeValue(attributes[check[0].id.attribute]),
  getAttributeValue(attributes[check[1].id.attribute]),
  getAttributeValue(attributes[check[2].id.attribute]),
]

/**
 * Returns the attributes of a skill check, paired with their values.
 */
export const getDisplayedSkillCheck = (
  staticAttributes: Record<number, Attribute>,
  dynamicAttributes: RatedMap,
  check: SkillCheck,
): DisplayedSkillCheck =>
  zipTriple(
    getSkillCheckAttributes(staticAttributes, check),
    getSkillCheckValues(dynamicAttributes, check),
    (attribute, value) => ({ attribute, value }),
  )
