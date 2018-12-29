import { pipe } from 'ramda';
import { IdPrefixes } from '../constants/IdPrefixes';
import { Dependent } from '../types/data';
import { EntryWithGroup } from '../types/wiki';
import { createPlainActivatableDependent } from './activeEntries/ActivatableDependent';
import { createInactiveActivatableSkillDependent } from './activeEntries/ActivatableSkillDependent';
import { AttributeDependentG, createPlainAttributeDependent } from './activeEntries/AttributeDependent';
import { createPlainSkillDependent, createSkillDependentWithValue6 } from './activeEntries/SkillDependent';
import { HeroModel, HeroModelG, HeroModelL, HeroModelRecord } from './heroData/HeroModel';
import { getIdPrefix } from './IDUtils';
import { not } from './not';
import { cnst } from './structures/Function';
import { Lens, over, view } from './structures/Lens';
import { elem_, filter, fromArray, List } from './structures/List';
import { bind_, ensure, fmap, fromMaybe, Just, liftM2, Maybe, Nothing, or } from './structures/Maybe';
import { alter, elems, insert, lookup, lookup_, OrderedMap, sdelete, update } from './structures/OrderedMap';
import { SkillG } from './wikiData/Skill';

export type HeroStateMapKey = 'advantages'
                            | 'attributes'
                            | 'combatTechniques'
                            | 'disadvantages'
                            | 'liturgicalChants'
                            | 'skills'
                            | 'specialAbilities'
                            | 'spells'

export type HeroStateListKey = HeroStateMapKey
                             | 'blessings'
                             | 'cantrips'

export type HeroStateListGetter<K extends HeroStateListKey = HeroStateListKey> =
  (hero: HeroModelRecord) => HeroModel[K]

export type HeroStateListLens<K extends HeroStateListKey = HeroStateListKey> =
  Lens<HeroModelRecord, HeroModel[K]>

export type HeroStateMapLens<K extends HeroStateMapKey = HeroStateMapKey> =
  Lens<HeroModelRecord, HeroModel[K]>

/**
 * Returns a getter function for a `Hero` object based on the prefix of the
 * passed id. Returns lenses for `OrderedMap`s and `OrderedSet`s, else
 * `Nothing`.
 */
export const getHeroStateListLensById =
  (id: string): Maybe<HeroStateListLens> => {
    switch (getIdPrefix (id)) {
      case IdPrefixes.ADVANTAGES:
        return Just<HeroStateListLens> (HeroModelL.advantages as HeroStateListLens)

      case IdPrefixes.ATTRIBUTES:
        return Just<HeroStateListLens> (HeroModelL.attributes as HeroStateListLens)

      case IdPrefixes.BLESSINGS:
        return Just<HeroStateListLens> (HeroModelL.blessings as HeroStateListLens)

      case IdPrefixes.CANTRIPS:
        return Just<HeroStateListLens> (HeroModelL.cantrips as HeroStateListLens)

      case IdPrefixes.COMBAT_TECHNIQUES:
        return Just<HeroStateListLens> (HeroModelL.combatTechniques as HeroStateListLens)

      case IdPrefixes.DISADVANTAGES:
        return Just<HeroStateListLens> (HeroModelL.disadvantages as HeroStateListLens)

      case IdPrefixes.LITURGICAL_CHANTS:
        return Just<HeroStateListLens> (HeroModelL.liturgicalChants as HeroStateListLens)

      case IdPrefixes.SPECIAL_ABILITIES:
        return Just<HeroStateListLens> (HeroModelL.specialAbilities as HeroStateListLens)

      case IdPrefixes.SPELLS:
        return Just<HeroStateListLens> (HeroModelL.spells as HeroStateListLens)

      case IdPrefixes.SKILLS:
        return Just<HeroStateListLens> (HeroModelL.skills as HeroStateListLens)

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
        return Just<HeroStateMapLens> (HeroModelL.advantages as HeroStateMapLens)

      case IdPrefixes.ATTRIBUTES:
        return Just<HeroStateMapLens> (HeroModelL.attributes as HeroStateMapLens)

      case IdPrefixes.COMBAT_TECHNIQUES:
        return Just<HeroStateMapLens> (HeroModelL.combatTechniques as HeroStateMapLens)

      case IdPrefixes.DISADVANTAGES:
        return Just<HeroStateMapLens> (HeroModelL.disadvantages as HeroStateMapLens)

      case IdPrefixes.LITURGICAL_CHANTS:
        return Just<HeroStateMapLens> (HeroModelL.liturgicalChants as HeroStateMapLens)

      case IdPrefixes.SPECIAL_ABILITIES:
        return Just<HeroStateMapLens> (HeroModelL.specialAbilities as HeroStateMapLens)

      case IdPrefixes.SPELLS:
        return Just<HeroStateMapLens> (HeroModelL.spells as HeroStateMapLens)

      case IdPrefixes.SKILLS:
        return Just<HeroStateMapLens> (HeroModelL.skills as HeroStateMapLens)

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
        return Just<HeroStateListGetter> (HeroModelG.advantages)

      case IdPrefixes.ATTRIBUTES:
        return Just<HeroStateListGetter> (HeroModelG.attributes)

      case IdPrefixes.BLESSINGS:
        return Just<HeroStateListGetter> (HeroModelG.blessings)

      case IdPrefixes.CANTRIPS:
        return Just<HeroStateListGetter> (HeroModelG.cantrips)

      case IdPrefixes.COMBAT_TECHNIQUES:
        return Just<HeroStateListGetter> (HeroModelG.combatTechniques)

      case IdPrefixes.DISADVANTAGES:
        return Just<HeroStateListGetter> (HeroModelG.disadvantages)

      case IdPrefixes.LITURGICAL_CHANTS:
        return Just<HeroStateListGetter> (HeroModelG.liturgicalChants)

      case IdPrefixes.SPECIAL_ABILITIES:
        return Just<HeroStateListGetter> (HeroModelG.specialAbilities)

      case IdPrefixes.SPELLS:
        return Just<HeroStateListGetter> (HeroModelG.spells)

      case IdPrefixes.SKILLS:
        return Just<HeroStateListGetter> (HeroModelG.skills)

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
        return Just (createPlainActivatableDependent)

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
  (state: HeroModelRecord) =>
    pipe (
           fmap ((lens: HeroStateMapLens) => view (lens) (state)),
           bind_ (lookup (id) as (m: OrderedMap<string, Dependent>) => Maybe<Dependent>)
         )
         (getHeroStateMapLensById (id))

export const setHeroStateItem =
  (id: string) =>
  (item: Dependent) =>
  (state: HeroModelRecord) =>
    fmap ((lens: HeroStateMapLens) =>
           over (lens)
                (insert<string, Dependent> (id) (item) as
                  (m: HeroModel[HeroStateMapKey]) => HeroModel[HeroStateMapKey])
                (state))
         (getHeroStateMapLensById (id))

export const removeHeroStateItem =
  (id: string) =>
  (state: HeroModelRecord) =>
    fmap ((lens: HeroStateMapLens) =>
           over (lens)
                (sdelete<string, Dependent> (id) as
                  (m: HeroModel[HeroStateMapKey]) => HeroModel[HeroStateMapKey])
                (state))
         (getHeroStateMapLensById (id))


/**
 * ```haskell
 * updateEntryDef :: Dependent a => (a -> Maybe a) -> String -> Hero -> Hero
 * ```
 *
 * `updateEntryDef f id hero` adjusts a entry, specified by `id`, from a state
 * slice. If the entry is not present, a plain entry of the needed type will be
 * created with the given `id`, e.g. `SkillDependent` when `id` is like
 * `SKILL_X`. `f` will then be called either on the already present or created
 * object. If `f` returns a `Nothing`, the entry will be removed from the state
 * slice.
 */
export const updateEntryDef =
  <D extends Dependent>
  (f: (value: D) => Maybe<D>) =>
  (id: string) =>
  (state: HeroModelRecord) =>
    fromMaybe<HeroModelRecord>
      (state)
      (liftM2 ((creator: (id: string) => D) => (lens: HeroStateMapLens) =>
                over (lens)
                  (alter<string, D> (pipe (fromMaybe (creator (id)), f))
                                    (id) as unknown as
                    (m: HeroModel[HeroStateMapKey]) => HeroModel[HeroStateMapKey])
                  (state))
              (getEntryCreatorById (id) as Maybe<(id: string) => D>)
              (getHeroStateMapLensById (id)))

/**
 * ```haskell
 * adjustEntryDef :: Dependent a
 *                => (a -> a) -> (a -> Bool) -> String -> Hero -> Hero
 * ```
 *
 * `adjustEntryDef f unused id hero` adjusts a entry, specified by `id`, from a
 * state slice. If the entry is not present, a plain entry of the needed type
 * will be created with the given `id`. `f` will then be called either on the
 * already present or created object. If `unused` returns the adjusted entry is
 * unused, this function will remove the entry from the state slice.
 */
export const adjustRemoveEntryDef =
  <D extends Dependent>
  (f: (value: D) => D) =>
  (unused: (value: D) => boolean) =>
    updateEntryDef (pipe (f, ensure<D> (pipe (unused, not))))

/**
 * ```haskell
 * modifyEntryDef :: Dependent a => (a -> a) -> String -> Hero -> Hero
 * ```
 *
 * `modifyEntryDef f id hero` adjusts a entry, specified by `id`, from a state
 * slice. If the entry is not present, a plain entry of the needed type will be
 * created with the given `id`. `f` will then be called either on the already
 * present or created object.
 */
export const adjustEntryDef =
  <D extends Dependent> (f: (value: D) => D) =>
    adjustRemoveEntryDef (f) (cnst (false))

/**
 * ```haskell
 * updateStateEntry :: (Dependent a, (OrderedMap String) m)
 *                  => (a -> Maybe a) -> (a -> Bool) -> String -> m a -> m a
 * ```
 *
 * `updateStateEntry f unused id map` adjusts a entry, specified by `id`, from a
 * state slice (`map`). If the entry is not present, this function will return
 * the original map. `f` will then be called on the already present object. If
 * `unused` returns the adjusted entry is unused, this function will remove the
 * entry from the state slice.
 */
export const updateSliceEntry =
  <D extends Dependent>
  (f: (value: D) => D) =>
  (unused: (value: D) => boolean) =>
    update<string, D> (pipe (
                        f,
                        ensure<D> (pipe (unused, not))
                      ))

/**
 * Filters the passed `list` by the specified groups.
 */
export const getAllEntriesByGroup =
  <I extends Dependent = Dependent, T extends EntryWithGroup = EntryWithGroup>
  (wiki: OrderedMap<string, T>) =>
  (list: OrderedMap<string, I>) =>
  (...groups: number[]): List<I> =>
    filter<I> (pipe (
                AttributeDependentG.id,
                lookup_ (wiki),
                fmap (SkillG.gr),
                fmap (elem_ (fromArray (groups))),
                or
              ))
              (elems (list))
