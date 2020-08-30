import { flip } from "../../../Data/Function"
import { cons, consF, foldr, lengthAtLeast, List, nub, sdelete } from "../../../Data/List"
import { listToMaybe, mapMaybe, maybe, Nothing } from "../../../Data/Maybe"
import { lookupF, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd } from "../../../Data/Tuple"
import { curryN5, curryN6 } from "../../../Data/Tuple/All"
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent"
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../Models/Wiki/Skill"
import { Spell } from "../../Models/Wiki/Spell"
import { pipe, pipe_ } from "../pipe"
import { V } from "../Variant"

const ADA = AttributeDependent.A
const ASDA = ActivatableSkillDependent.A
const SkA = Skill.A
const SpA = Spell.A
const LCA = LiturgicalChant.A

type Type = "Skill" | "Spell" | "LiturgicalChant"

export type CacheSkillId = V<Type, string>

/**
 * A map from attribute ids to skill (skill, spell, magical action, liturgical
 * chant) ids.
 */
export type AttributeSkillCheckMinimumCache = OrderedMap<string, List<CacheSkillId>>

/**
 * `addEntryToCache` takes the check attribute of the `entry` and for each
 * attribute the `entry`'s id will be prepended to the list in the `cache`.
 */
export const addEntryToCache = <A> (
  getId: (x: A) => string,
  getCheckAttributes: (x: A) => List<string>,
  type: Type,
  entry: A,
  cache: AttributeSkillCheckMinimumCache
) =>
  List.foldr ((attrId: string) => OrderedMap.adjustDef (List<CacheSkillId> ())
                                                       (consF ({ tag: type, value: getId (entry) }))
                                                       (attrId))
             (cache)
             (nub (getCheckAttributes (entry)))

/**
 * `removeEntryFromCache` takes the check attribute of the `entry` and for each
 * attribute the `entry`'s id will be removed from the list in the `cache`.
 */
export const removeEntryFromCache = <A> (
  getId: (x: A) => string,
  getCheckAttributes: (x: A) => List<string>,
  type: Type,
  entry: A,
  cache: AttributeSkillCheckMinimumCache
) =>
  List.foldr ((attrId: string) => OrderedMap.adjust (sdelete ({ tag: type, value: getId (entry) }))
                                                    (attrId))
             (cache)
             (nub (getCheckAttributes (entry)))

/**
 * `insertAttributeIdsFromActivatableSkill` maps the `heroEntry` to a static
 * entry if it is active, then takes the check attribute of the `entry` and for
 * each attribute the `entry`'s id will be prepended to the list in the `cache`.
 */
const addOptionalEntryToCache = <A> (
  getId: (x: A) => string,
  getCheckAttributes: (x: A) => List<string>,
  type: Type,
  staticEntryMap: OrderedMap<string, A>,
  heroEntry: Record<ActivatableSkillDependent>,
  cache: AttributeSkillCheckMinimumCache
) =>
  ASDA.active (heroEntry)
  ? pipe_ (
      heroEntry,
      ASDA.id,
      lookupF (staticEntryMap),
      maybe (cache)
            (entry => addEntryToCache (getId, getCheckAttributes, type, entry, cache))
    )
  : cache

/**
 * Generates the initial cache for a hero.
 */
export const initializeCache = (
  staticSkills: OrderedMap<string, Record<Skill>>,
  staticSpells: OrderedMap<string, Record<Spell>>,
  staticLiturgicalChants: OrderedMap<string, Record<LiturgicalChant>>,
  heroSpells: OrderedMap<string, Record<ActivatableSkillDependent>>,
  heroLiturgicalChants: OrderedMap<string, Record<ActivatableSkillDependent>>,
) =>
  pipe_ (
    OrderedMap.empty,
    flip (OrderedMap.foldr (curryN5 (addEntryToCache) (SkA.id) (SkA.check) ("Skill")))
         (staticSkills),
    flip (OrderedMap.foldr (curryN6 (addOptionalEntryToCache)
                                    (SpA.id)
                                    (SpA.check)
                                    ("Spell")
                                    (staticSpells)))
         (heroSpells),
    flip (OrderedMap.foldr (curryN6 (addOptionalEntryToCache)
                                    (LCA.id)
                                    (LCA.check)
                                    ("LiturgicalChant")
                                    (staticLiturgicalChants)))
         (heroLiturgicalChants)
  )

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

// export const getSkillCheckAttributeMinimum = (
//   staticSkills: OrderedMap<string, Record<Skill>>,
//   staticSpells: OrderedMap<string, Record<Spell>>,
//   staticLiturgicalChants: OrderedMap<string, Record<LiturgicalChant>>,
//   heroAttributes: OrderedMap<string, Record<AttributeDependent>>,
//   heroSpells: OrderedMap<string, Record<ActivatableSkillDependent>>,
//   heroLiturgicalChants: OrderedMap<string, Record<ActivatableSkillDependent>>,
//   cache: AttributeSkillCheckMinimumCache,
//   attributeId: string,
// ) =>
//   pipe_ (
//     attributeId,
//     lookupF (cache),
//     fmap (skillIds => List.foldr (x => x, 0, skillIds))
//   )
