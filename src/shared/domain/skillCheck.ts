import { Attribute } from "optolith-database-schema/types/Attribute"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { attributeValue } from "../../main_window/slices/attributesSlice.ts"
import { RatedMap } from "../../main_window/slices/characterSlice.ts"

type Triple<T> = [T, T, T]

const zipTriple = <T, U, V>(
  [ a, b, c ]: Triple<T>,
  [ x, y, z ]: Triple<U>,
  f: (x: T, y: U) => V,
): Triple<V> => [ f(a, x), f(b, y), f(c, z) ]

type SkillCheckAttributes = Triple<Attribute>
type SkillCheckValues = Triple<number>
type DisplayedSkillCheck = Triple<{ attribute: Attribute; value: number}>

export const getSkillCheckAttributes = (
  attributes: Record<number, Attribute>,
  check: SkillCheck,
): SkillCheckAttributes =>
  [
    attributes[check[0].id.attribute]!,
    attributes[check[1].id.attribute]!,
    attributes[check[2].id.attribute]!,
  ]

export const getSkillCheckValues = (
  attributes: RatedMap,
  check: SkillCheck,
): SkillCheckValues =>
  [
    attributeValue(attributes[check[0].id.attribute]),
    attributeValue(attributes[check[1].id.attribute]),
    attributeValue(attributes[check[2].id.attribute]),
  ]

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
