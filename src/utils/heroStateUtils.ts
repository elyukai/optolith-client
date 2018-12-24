import { pipe } from 'ramda';
import { IdPrefixes } from '../constants/IdPrefixes';
import { Dependent, Hero, HeroDependent } from '../types/data';
import { EntryWithGroup } from '../types/wiki';
import { createPlainActivatableDependent as createBaseActivatableDependent } from './activeEntries/activatableDependent';
import { createInactiveActivatableSkillDependent } from './activeEntries/activatableSkillDependent';
import { AttributeDependentG, createPlainAttributeDependent } from './activeEntries/attributeDependent';
import { createPlainSkillDependent, createSkillDependentWithValue6 } from './activeEntries/skillDependent';
import { HeroG, HeroL } from './heroData/HeroCreator';
import { getIdPrefix } from './IDUtils';
import { not } from './not';
import { cnst } from './structures/Function';
import { Lens, over, view } from './structures/Lens';
import { elem_, filter, fromArray, List } from './structures/List';
import { bind_, ensure, fmap, fromMaybe, Just, Maybe, maybe, Nothing, or } from './structures/Maybe';
import { adjust, alter, elems, insert, lookup, lookup_, OrderedMap, sdelete, update } from './structures/OrderedMap';
import { SkillG } from './wikiData/SkillCreator';

export type HeroStateMapKey =
  'advantages' |
  'attributes' |
  'combatTechniques' |
  'disadvantages' |
  'liturgicalChants' |
  'skills' |
  'specialAbilities' |
  'spells'

export type HeroStateListKey =
  HeroStateMapKey |
  'blessings' |
  'cantrips'

export type HeroStateListGetter<K extends HeroStateListKey = HeroStateListKey> =
  (hero: Hero) => HeroDependent[K]

export type HeroStateListLens<K extends HeroStateListKey = HeroStateListKey> =
  Lens<Hero, HeroDependent[K]>

export type HeroStateMapLens<K extends HeroStateMapKey = HeroStateMapKey> =
  Lens<Hero, HeroDependent[K]>

/**
 * Returns a getter function for a `Hero` object based on the prefix of the
 * passed id. Returns lenses for `OrderedMap`s and `OrderedSet`s, else
 * `Nothing`.
 */
export const getHeroStateListLensById =
  (id: string): Maybe<HeroStateListLens> => {
    switch (getIdPrefix (id)) {
      case IdPrefixes.ADVANTAGES:
        return Just<HeroStateListLens> (HeroL.advantages as HeroStateListLens)

      case IdPrefixes.ATTRIBUTES:
        return Just<HeroStateListLens> (HeroL.attributes as HeroStateListLens)

      case IdPrefixes.BLESSINGS:
        return Just<HeroStateListLens> (HeroL.blessings as HeroStateListLens)

      case IdPrefixes.CANTRIPS:
        return Just<HeroStateListLens> (HeroL.cantrips as HeroStateListLens)

      case IdPrefixes.COMBAT_TECHNIQUES:
        return Just<HeroStateListLens> (HeroL.combatTechniques as HeroStateListLens)

      case IdPrefixes.DISADVANTAGES:
        return Just<HeroStateListLens> (HeroL.disadvantages as HeroStateListLens)

      case IdPrefixes.LITURGICAL_CHANTS:
        return Just<HeroStateListLens> (HeroL.liturgicalChants as HeroStateListLens)

      case IdPrefixes.SPECIAL_ABILITIES:
        return Just<HeroStateListLens> (HeroL.specialAbilities as HeroStateListLens)

      case IdPrefixes.SPELLS:
        return Just<HeroStateListLens> (HeroL.spells as HeroStateListLens)

      case IdPrefixes.SKILLS:
        return Just<HeroStateListLens> (HeroL.skills as HeroStateListLens)

      default:
        return Nothing
    }
  }

/**
 * Returns a getter function for a `Hero` object based on the prefix of the
 * passed id. Only returns lenses for `OrderedMaps`, else `Nothing`.
 */
export const getHeroStateMapLensById =
  (id: string): Maybe<HeroStateMapLens> => {
    switch (getIdPrefix (id)) {
      case IdPrefixes.ADVANTAGES:
        return Just<HeroStateMapLens> (HeroL.advantages as HeroStateMapLens)

      case IdPrefixes.ATTRIBUTES:
        return Just<HeroStateMapLens> (HeroL.attributes as HeroStateMapLens)

      case IdPrefixes.COMBAT_TECHNIQUES:
        return Just<HeroStateMapLens> (HeroL.combatTechniques as HeroStateMapLens)

      case IdPrefixes.DISADVANTAGES:
        return Just<HeroStateMapLens> (HeroL.disadvantages as HeroStateMapLens)

      case IdPrefixes.LITURGICAL_CHANTS:
        return Just<HeroStateMapLens> (HeroL.liturgicalChants as HeroStateMapLens)

      case IdPrefixes.SPECIAL_ABILITIES:
        return Just<HeroStateMapLens> (HeroL.specialAbilities as HeroStateMapLens)

      case IdPrefixes.SPELLS:
        return Just<HeroStateMapLens> (HeroL.spells as HeroStateMapLens)

      case IdPrefixes.SKILLS:
        return Just<HeroStateMapLens> (HeroL.skills as HeroStateMapLens)

      default:
        return Nothing
    }
  }

/**
 * Returns a getter function for a `Hero` object based on the prefix of the
 * passed id.
 */
export const getHeroStateListGetterById =
  (id: string): Maybe<HeroStateListGetter> => {
    switch (getIdPrefix (id)) {
      case IdPrefixes.ADVANTAGES:
        return Just<HeroStateListGetter> (HeroG.advantages)

      case IdPrefixes.ATTRIBUTES:
        return Just<HeroStateListGetter> (HeroG.attributes)

      case IdPrefixes.BLESSINGS:
        return Just<HeroStateListGetter> (HeroG.blessings)

      case IdPrefixes.CANTRIPS:
        return Just<HeroStateListGetter> (HeroG.cantrips)

      case IdPrefixes.COMBAT_TECHNIQUES:
        return Just<HeroStateListGetter> (HeroG.combatTechniques)

      case IdPrefixes.DISADVANTAGES:
        return Just<HeroStateListGetter> (HeroG.disadvantages)

      case IdPrefixes.LITURGICAL_CHANTS:
        return Just<HeroStateListGetter> (HeroG.liturgicalChants)

      case IdPrefixes.SPECIAL_ABILITIES:
        return Just<HeroStateListGetter> (HeroG.specialAbilities)

      case IdPrefixes.SPELLS:
        return Just<HeroStateListGetter> (HeroG.spells)

      case IdPrefixes.SKILLS:
        return Just<HeroStateListGetter> (HeroG.skills)

      default:
        return Nothing
    }
  }

/**
 * Returns a matching creator for elements in the `OrderedMap` specified by the
 * passed key in a `Hero` object.
 */
export const getEntryCreatorById =
  (id: string): Maybe<(id: string) => Dependent> => {
    switch (getIdPrefix (id)) {
      case IdPrefixes.ADVANTAGES:
      case IdPrefixes.DISADVANTAGES:
      case IdPrefixes.SPECIAL_ABILITIES:
        return Just (createBaseActivatableDependent)

      case IdPrefixes.ATTRIBUTES:
        return Just (createPlainAttributeDependent)

      case IdPrefixes.COMBAT_TECHNIQUES:
        return Just (createSkillDependentWithValue6)

      case IdPrefixes.SKILLS:
        return Just (createPlainSkillDependent)

      case IdPrefixes.LITURGICAL_CHANTS:
      case IdPrefixes.SPELLS:
        return Just (createInactiveActivatableSkillDependent)

      default:
        return Nothing
    }
  }

export const getHeroStateItem =
  (id: string) =>
  (state: Hero) =>
    pipe (
           fmap ((lens: HeroStateMapLens) => view (lens) (state)),
           bind_ (lookup (id) as (m: OrderedMap<string, Dependent>) => Maybe<Dependent>)
         )
         (getHeroStateMapLensById (id))

export const setHeroStateItem =
  (id: string) =>
  (item: Dependent) =>
  (state: Hero) =>
    fmap ((lens: HeroStateMapLens) =>
           over (lens)
                (insert<string, Dependent> (id) (item) as
                  (m: HeroDependent[HeroStateMapKey]) => HeroDependent[HeroStateMapKey])
                (state))
         (getHeroStateMapLensById (id))

export const removeHeroStateItem =
  (id: string) =>
  (state: Hero) =>
    fmap ((lens: HeroStateMapLens) =>
           over (lens)
                (sdelete<string, Dependent> (id) as
                  (m: HeroDependent[HeroStateMapKey]) => HeroDependent[HeroStateMapKey])
                (state))
         (getHeroStateMapLensById (id))


/**
 * ```haskell
 * updateEntryDef :: Dependent a => (a -> Maybe a) -> String -> OrderedMap String a
 * ```
 *
 * `updateEntryDef f id map` adjusts a entry from a state slice (`map`). If the
 * entry is not present, a plain entry of the needed type will be created with
 * the given `id`, e.g. `SkillDependent` when `id` is like `SKILL_X`. `f` will
 * then be called either on the already present or created object. If `f`
 * returns a `Nothing`, the entry will be removed from the state slice.
 */
export const updateEntryDef =
  <D extends Dependent>
  (f: (value: D) => Maybe<D>) =>
  (id: string) =>
  (state: Hero) =>
    maybe<(id: string) => Dependent, Hero>
      (state)
      (creator => updateHeroListStateItemOr (creator)
                                            (f as (value: Dependent) => Maybe<Dependent>)
                                            (id)
                                            (state))
      (getEntryCreatorById (id))

/**
 * ```haskell
 * adjustEntryDef :: Dependent a => (a -> a) -> (a -> Bool) -> String -> OrderedMap String a
 * ```
 *
 * `adjustEntryDef adjustFn checkUnusedFn id map` adjusts a entry from a state
 * slice (`map`). If the entry is not present, a plain entry of the needed type
 * will be created with the given `id`. `adjustFn` will then be called either on
 * the already present or created object. If `checkUnusedFn` returns the
 * adjusted entry is unused, this function will remove the entry from the state
 * slice.
 */
export const adjustEntryDef =
  <D extends Dependent>
  (adjustFn: (value: D) => D) =>
  (checkUnusedFn: (value: D) => boolean) =>
  (id: string) =>
    updateEntryDef (pipe (
                           adjustFn,
                           ensure<D> (pipe (checkUnusedFn, not))
                         ))
                   (id)

/**
 * ```haskell
 * modifyEntryDef :: Dependent a => (a -> a) -> String -> OrderedMap String a
 * ```
 *
 * `modifyEntryDef f id map` adjusts a entry from a
 * state slice (`map`). If the entry is not present, `altFn` will be called with
 * the given `id`. `f` will then be called either on the already present
 * or created object.
 */
export const modifyEntryDef =
  <D extends Dependent>
  (f: (value: D) => D) =>
    adjustEntryDef (f) (cnst (false))

/**
 * `updateStateEntry :: Dependent a => (a -> Maybe a) ->
(a -> Bool) -> String -> OrderedMap String a`
 *
 * `updateStateEntry adjustFn checkUnusedFn id map` adjusts a entry from a
 * state slice (`map`). If the entry is not present, this function will return
 * the original map. `adjustFn` will then be called on the already present
 * object. If `checkUnusedFn` returns the adjusted entry is unused, this
 * function will remove the entry from the state slice.
 */
export const updateStateEntry =
  <D extends Dependent>
  (f: (value: D) => D) =>
  (checkUnused: (value: D) => boolean) =>
    update<string, D> (pipe (
                        f,
                        ensure<D> (pipe (checkUnused, not))
                      ))

export const updateHeroListStateItemOr =
  <D extends Dependent>
  (creator: (id: string) => D) =>
  (f: (value: D) => Maybe<D>) =>
  (id: string) =>
  (state: Hero) =>
    fromMaybe<Hero>
      (state)
      (fmap ((lens: HeroStateMapLens) =>
              over (lens)
                   (alter<string, D> (pipe (fromMaybe (creator (id)), f))
                                     (id) as unknown as
                     (m: HeroDependent[HeroStateMapKey]) => HeroDependent[HeroStateMapKey])
                   (state))
            (getHeroStateMapLensById (id)))

export const modifyHeroListStateItem =
  <D extends Dependent>
  (adjustFn: (value: D) => D) =>
  (id: string) =>
  (state: Hero) =>
    fromMaybe (state)
              (fmap ((lens: HeroStateMapLens) =>
                      over (lens)
                           (adjust<string, D> (adjustFn) (id) as unknown as
                             (m: HeroDependent[HeroStateMapKey]) => HeroDependent[HeroStateMapKey])
                           (state))
                    (getHeroStateMapLensById (id)))

export const modifyHeroListStateItemOrRemove =
  <D extends Dependent>
  (unusedCheck: (value: D) => boolean) =>
  (f: (value: D) => D) =>
  (id: string) =>
  (state: Hero) =>
    fromMaybe (state)
              (fmap ((lens: HeroStateMapLens) =>
                      over (lens)
                           (update<string, D> (value => {
                                                const updatedValue = f (value)

                                                if (unusedCheck (updatedValue)) {
                                                  return Nothing
                                                }
                                                else {
                                                  return Just (updatedValue)
                                                }
                                              })
                                              (id) as unknown as
                             (m: HeroDependent[HeroStateMapKey]) => HeroDependent[HeroStateMapKey])
                           (state))
                    (getHeroStateMapLensById (id)))

export const getAllEntriesByGroup =
  <I extends Dependent = Dependent, T extends EntryWithGroup = EntryWithGroup>
  (
    wiki: OrderedMap<string, T>,
    list: OrderedMap<string, I>,
    ...groups: number[]
  ): List<I> =>
    filter<I> (pipe (
                AttributeDependentG.id,
                lookup_ (wiki),
                fmap (SkillG.gr),
                fmap (elem_ (fromArray (groups))),
                or
              ))
              (elems (list))
