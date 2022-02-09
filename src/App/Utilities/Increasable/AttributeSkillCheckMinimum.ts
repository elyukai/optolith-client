/**
 * This module includes function for working with attribute minima based on
 * the skill check attributes of active skills, spells, magical actions and
 * chants.
 *
 * To take care of the minimum, at hero initialization a cache must be build and
 * it must changed if spells, magical actions or chants are added or removed to
 * keep track of all skill check attributes.
 *
 * To actually check for a minimum, you need the cache and multiple parts of the
 * hero and from those then derive the minimum for a specific attribute based on
 * the skill checks and skill ratings of all active skills.
 */

import { flip } from "../../../Data/Function"
import { cons, foldr, lengthAtLeast, List, nub, toArray } from "../../../Data/List"
import { fromJust, isJust, listToMaybe, mapMaybe, maybe, Maybe, Nothing } from "../../../Data/Maybe"
import { lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd } from "../../../Data/Tuple"
import { curryN5, curryN6 } from "../../../Data/Tuple/All"
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent"
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent"
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent"
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../Models/Wiki/Skill"
import { Spell } from "../../Models/Wiki/Spell"
import { ensure } from "../Maybe"
import { pipe, pipe_ } from "../pipe"
import { MakeTagged, Tagged } from "../Tagged"

const ADA = AttributeDependent.A
const ASDA = ActivatableSkillDependent.A
const SkA = Skill.A
const CTA = CombatTechnique.A
const SpA = Spell.A
const LCA = LiturgicalChant.A

type CacheSkillIdTypes = {
  Skill: { value: string }
  CombatTechnique: { value: string }
  Spell: { value: string }
  LiturgicalChant: { value: string }
}

export type CacheSkillId = Tagged<CacheSkillIdTypes>

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CacheSkillId = MakeTagged<CacheSkillIdTypes> ({
  Skill: "Skill",
  CombatTechnique: "CombatTechnique",
  Spell: "Spell",
  LiturgicalChant: "LiturgicalChant",
})

/**
 * A map from attribute ids to skill (skill, spell, magical action, liturgical
 * chant) ids.
 */
export type AttributeSkillCheckMinimumCache = ReadonlyMap<string, readonly CacheSkillId[]>

/**
 * `addEntryToCache` takes the check attribute of the `entry` and for each
 * attribute the `entry`'s id will be prepended to the list in the `cache`.
 */
export const addEntryToCache = <A> (
  getId: (x: A) => string,
  getCheckAttributes: (x: A) => readonly string[],
  type: keyof CacheSkillIdTypes,
  entry: A,
  cache: AttributeSkillCheckMinimumCache
) =>
  getCheckAttributes (entry)
    .nub ()
    .reduce (
      (newCache, attrId) =>
        newCache.insertWith (
          attrId,
          [ CacheSkillId[type] ({ value: getId (entry) }) ],
          (oldArr, newArr) => oldArr.concat (newArr)
        ),
      cache
    )

/**
 * `removeEntryFromCache` takes the check attribute of the `entry` and for each
 * attribute the `entry`'s id will be removed from the list in the `cache`.
 */
export const removeEntryFromCache = <A> (
  getId: (x: A) => string,
  getCheckAttributes: (x: A) => readonly string[],
  type: keyof CacheSkillIdTypes,
  entry: A,
  cache: AttributeSkillCheckMinimumCache
) =>
  getCheckAttributes (entry)
    .nub ()
    .reduce (
      (newCache, attrId) =>
        newCache.adjust (
          attrId,
          oldArr => oldArr.deleteAt (
            oldArr.findIndex (({ tag, value }) => tag === type && value === getId (entry))
          )
        ),
      cache
    )

/**
 * `insertAttributeIdsFromActivatableSkill` maps the `heroEntry` to a static
 * entry if it is active, then takes the check attribute of the `entry` and for
 * each attribute the `entry`'s id will be prepended to the list in the `cache`.
 */
const addOptionalEntryToCache = <A> (
  getId: (x: A) => string,
  getCheckAttributes: (x: A) => readonly string[],
  type: keyof CacheSkillIdTypes,
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
  staticCombatTechniques: OrderedMap<string, Record<CombatTechnique>>,
  staticSpells: OrderedMap<string, Record<Spell>>,
  staticLiturgicalChants: OrderedMap<string, Record<LiturgicalChant>>,
  characterSpells: OrderedMap<string, Record<ActivatableSkillDependent>>,
  characterLiturgicalChants: OrderedMap<string, Record<ActivatableSkillDependent>>,
) =>
  pipe_ (
    new Map (),
    flip (OrderedMap.foldr (curryN5 (addEntryToCache)
                                    (SkA.id)
                                    (pipe (SkA.check, toArray))
                                    ("Skill")))
         (staticSkills),
    flip (OrderedMap.foldr (curryN5 (addEntryToCache)
                                    (CTA.id)
                                    (pipe (CTA.primary, toArray))
                                    ("CombatTechnique")))
         (staticCombatTechniques),
    flip (OrderedMap.foldr (curryN6 (addOptionalEntryToCache)
                                    (SpA.id)
                                    (pipe (SpA.check, toArray))
                                    ("Spell")
                                    (staticSpells)))
         (characterSpells),
    flip (OrderedMap.foldr (curryN6 (addOptionalEntryToCache)
                                    (LCA.id)
                                    (pipe (LCA.check, toArray))
                                    ("LiturgicalChant")
                                    (staticLiturgicalChants)))
         (characterLiturgicalChants)
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

const getGenericNewMinimumSr = <A, B> (
  getCheck: (x: A) => List<string>,
  getSkillRating: (x: B) => number,
  staticEntries: OrderedMap<string, A>,
  heroAttributes: OrderedMap<string, Record<AttributeDependent>>,
  heroEntries: OrderedMap<string, B>,
  attributeId: string,
  currentMinimumSr: number,
  entryId: string,
): number => {
  const maybeStaticEntry = lookup (entryId) (staticEntries)
  const maybeHeroEntry = lookup (entryId) (heroEntries)

  // A static entry must be present and a hero entry as well, since it has to
  // have an SR higher than 0 to be relevant
  if (isJust (maybeStaticEntry)
      && isJust (maybeHeroEntry)) {
    const check = pipe_ (maybeStaticEntry, fromJust, getCheck)

    const skillRating = pipe_ (maybeHeroEntry, fromJust, getSkillRating)

    // It's SR not only needs to be higher than 0, but that the current maximum
    // SR relevant detected to save some calculation work
    if (skillRating > currentMinimumSr) {
      const maybeSingleMaximumAttribute =
        getSingleMaximumAttribute (heroAttributes) (check)

      // There must be only one maximum attribute...
      if (isJust (maybeSingleMaximumAttribute)) {
        const singleMaximumAttribute =
          fromJust (maybeSingleMaximumAttribute)

        // ...and this attribute must be the attribute that is currently checked
        // for a minimum value.
        if (singleMaximumAttribute === attributeId) {
          return skillRating
        }
      }
    }
  }

  return currentMinimumSr
}

const getNewMinimumSR = (
  staticSkills: OrderedMap<string, Record<Skill>>,
  staticCombatTechniques: OrderedMap<string, Record<CombatTechnique>>,
  staticSpells: OrderedMap<string, Record<Spell>>,
  staticLiturgicalChants: OrderedMap<string, Record<LiturgicalChant>>,
  characterAttributes: OrderedMap<string, Record<AttributeDependent>>,
  characterSkills: OrderedMap<string, Record<SkillDependent>>,
  characterCombatTechniques: OrderedMap<string, Record<SkillDependent>>,
  characterSpells: OrderedMap<string, Record<ActivatableSkillDependent>>,
  characterLiturgicalChants: OrderedMap<string, Record<ActivatableSkillDependent>>,
  attributeId: string,
  skillId: CacheSkillId,
  accMinimumSR: number
) => {
  switch (skillId.tag) {
    case "Skill": {
      return getGenericNewMinimumSr (
        Skill.A.check,
        SkillDependent.A.value,
        staticSkills,
        characterAttributes,
        characterSkills,
        attributeId,
        accMinimumSR,
        skillId.value
      )
    }

    case "CombatTechnique": {
      return getGenericNewMinimumSr (
        CombatTechnique.A.primary,
        SkillDependent.A.value,
        staticCombatTechniques,
        characterAttributes,
        characterCombatTechniques,
        attributeId,
        accMinimumSR,
        skillId.value
      )
    }

    case "Spell": {
      return getGenericNewMinimumSr (
        Spell.A.check,
        ActivatableSkillDependent.A.value,
        staticSpells,
        characterAttributes,
        characterSpells,
        attributeId,
        accMinimumSR,
        skillId.value
      )
    }

    case "LiturgicalChant": {
      return getGenericNewMinimumSr (
        LiturgicalChant.A.check,
        ActivatableSkillDependent.A.value,
        staticLiturgicalChants,
        characterAttributes,
        characterLiturgicalChants,
        attributeId,
        accMinimumSR,
        skillId.value
      )
    }

    default:
      return accMinimumSR
  }
}

/**
 * Returns the attribute minimum based on the created skill check attribute
 * cache `cache` for the attribute with id `attributeId`.
 *
 * Since skills (skills, spells and chants) have a maximum possible skill rating
 * of "Highest skill check attribute + 2", in turn, the attributes must ensure
 * they keep themselves on a "Highest skill with this attribute as the highest
 * skill check attribute - 2".
 *
 * This minimum should be added to the list of minima to calculate a total
 * minimum for the respective attribute.
 */
export const getSkillCheckAttributeMinimum = (
  staticSkills: OrderedMap<string, Record<Skill>>,
  staticCombatTechniques: OrderedMap<string, Record<CombatTechnique>>,
  staticSpells: OrderedMap<string, Record<Spell>>,
  staticLiturgicalChants: OrderedMap<string, Record<LiturgicalChant>>,
  characterAttributes: OrderedMap<string, Record<AttributeDependent>>,
  characterSkills: OrderedMap<string, Record<SkillDependent>>,
  characterCombatTechniques: OrderedMap<string, Record<SkillDependent>>,
  // TODO: Once this is converted to Reason, dont forget to add all relevant
  // magical actions here!
  characterSpells: OrderedMap<string, Record<ActivatableSkillDependent>>,
  characterLiturgicalChants: OrderedMap<string, Record<ActivatableSkillDependent>>,
  cache: AttributeSkillCheckMinimumCache,
  attributeId: string,
): Maybe<number> => {
  // Highest attribute + 2 is SR maximum, so the attribute minimum is
  // highest SR - 2
  const calculatedMinimum = cache
    .lookup (attributeId)
    .maybe (
      0,
      ids => ids.reduce (
        (min, taggedId) => getNewMinimumSR (
          staticSkills,
          staticCombatTechniques,
          staticSpells,
          staticLiturgicalChants,
          characterAttributes,
          characterSkills,
          characterCombatTechniques,
          characterSpells,
          characterLiturgicalChants,
          attributeId,
          taggedId,
          min
        ),
        0
      )
    ) - 2

  // clean up the result to only return a number if it's higher than the
  // default minimum of 8
  return ensure (calculatedMinimum, x => x > 8).toOldMaybe ()
}
