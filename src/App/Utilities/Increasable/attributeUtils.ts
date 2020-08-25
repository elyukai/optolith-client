import { fmap } from "../../../Data/Functor"
import { cons, foldr, lengthAtLeast, List, nub } from "../../../Data/List"
import { listToMaybe, mapMaybe, maybe, Nothing } from "../../../Data/Maybe"
import { lookupF, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd } from "../../../Data/Tuple"
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent"
import { pipe, pipe_ } from "../pipe"

const ADA = AttributeDependent.A

export const getSkillCheckValues =
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
    mapMaybe (pipe (lookupF (attributes), fmap (ADA.value)))

export const getAttributeValueWithDefault = maybe (8) (ADA.value)

/**
 * `getSkillCheckAttributes attributes check` traverses the `check` list of
 * attribute ids and returns a list of found attribute instances.
 */
export const getSkillCheckAttributes =
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
    mapMaybe ((attrId: string) => pipe_ (attrId, lookupF (attributes)))

/**
 * `getSingleMaximumAttribute attributes check` takes the current attribute
 * instances and the list of check ids and returns the maximum attribute in the
 * check. If there are multiple different attributes on the same value,
 * `Nothing` is returned, otherwise a `Just` of the attribute's id.
 */
export const getSingleMaximumAttribute =
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
    pipe (
      getSkillCheckAttributes (attributes),
      foldr ((checkAttribute: Record<AttributeDependent>) => (max: Pair<number, List<string>>) =>
              ADA.value (checkAttribute) < fst (max)
              ? max
              : ADA.value (checkAttribute) === fst (max)
              ? Pair (fst (max), cons (snd (max)) (ADA.id (checkAttribute)))
              : Pair (ADA.value (checkAttribute), List (ADA.id (checkAttribute))))
            (Pair (8, List ())),
      snd,
      nub,
      maxAttrIds => lengthAtLeast (2) (maxAttrIds) ? Nothing : listToMaybe (maxAttrIds)
    )
