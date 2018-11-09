import * as R from 'ramda';
import { IdPrefixes } from '../constants/IdPrefixes';
import { Dependent, HeroDependent } from '../types/data';
import { EntryWithGroup } from '../types/wiki';
import { createActivatableDependent, createActivatableDependentSkill, createAttributeDependent, createDependentSkill } from './createEntryUtils';
import { Just, List, Maybe, Nothing, OrderedMap, Record, RecordKey } from './dataUtils';
import { getIdPrefix } from './IDUtils';
import { match } from './match';

export type HeroStateMapKey =
  'advantages' |
  'attributes' |
  'combatTechniques' |
  'disadvantages' |
  'liturgicalChants' |
  'skills' |
  'specialAbilities' |
  'spells';

export type HeroStateListKey =
  HeroStateMapKey |
  'blessings' |
  'cantrips';

export const getHeroStateListKeyById = (id: string): Maybe<HeroStateListKey> =>
  match<IdPrefixes, Maybe<HeroStateListKey>> (getIdPrefix (id))
    .on (IdPrefixes.ADVANTAGES, () =>
      Maybe.pure<HeroStateListKey> ('advantages')
    )
    .on (IdPrefixes.ATTRIBUTES, () =>
      Maybe.pure<HeroStateListKey> ('attributes')
    )
    .on (IdPrefixes.BLESSINGS, () =>
      Maybe.pure<HeroStateListKey> ('blessings')
    )
    .on (IdPrefixes.CANTRIPS, () =>
      Maybe.pure<HeroStateListKey> ('cantrips')
    )
    .on (IdPrefixes.COMBAT_TECHNIQUES, () =>
      Maybe.pure<HeroStateListKey> ('combatTechniques')
    )
    .on (IdPrefixes.DISADVANTAGES, () =>
      Maybe.pure<HeroStateListKey> ('disadvantages')
    )
    .on (IdPrefixes.LITURGIES, () =>
      Maybe.pure<HeroStateListKey> ('liturgicalChants')
    )
    .on (IdPrefixes.SPECIAL_ABILITIES, () =>
      Maybe.pure<HeroStateListKey> ('specialAbilities')
    )
    .on (IdPrefixes.SPELLS, () =>
      Maybe.pure<HeroStateListKey> ('spells')
    )
    .on (IdPrefixes.TALENTS, () =>
      Maybe.pure<HeroStateListKey> ('skills')
    )
    .otherwise (Maybe.empty);

export const getHeroStateMapKeyById = (id: string): Maybe<HeroStateMapKey> =>
  match<IdPrefixes, Maybe<HeroStateMapKey>> (getIdPrefix (id))
    .on (IdPrefixes.ADVANTAGES, () =>
      Maybe.pure<HeroStateMapKey> ('advantages')
    )
    .on (IdPrefixes.ATTRIBUTES, () =>
      Maybe.pure<HeroStateMapKey> ('attributes')
    )
    .on (IdPrefixes.COMBAT_TECHNIQUES, () =>
      Maybe.pure<HeroStateMapKey> ('combatTechniques')
    )
    .on (IdPrefixes.DISADVANTAGES, () =>
      Maybe.pure<HeroStateMapKey> ('disadvantages')
    )
    .on (IdPrefixes.LITURGIES, () =>
      Maybe.pure<HeroStateMapKey> ('liturgicalChants')
    )
    .on (IdPrefixes.SPECIAL_ABILITIES, () =>
      Maybe.pure<HeroStateMapKey> ('specialAbilities')
    )
    .on (IdPrefixes.SPELLS, () =>
      Maybe.pure<HeroStateMapKey> ('spells')
    )
    .on (IdPrefixes.TALENTS, () =>
      Maybe.pure<HeroStateMapKey> ('skills')
    )
    .otherwise (Maybe.empty);

export const getEntryCreatorByHeroStateMapKey = (
  key: HeroStateMapKey
): (id: string) => Dependent => {
  switch (key) {
    case 'advantages':
    case 'disadvantages':
    case 'specialAbilities':
      return createActivatableDependent;

    case 'attributes':
      return createAttributeDependent;

    case 'combatTechniques':
    case 'skills':
      return createDependentSkill;

    case 'liturgicalChants':
    case 'spells':
      return createActivatableDependentSkill;
  }
};

export const getHeroStateListItem = <D extends Dependent = Dependent> (id: string) =>
  (state: Record<HeroDependent>): Maybe<D> =>
    getHeroStateListKeyById (id)
      .bind (key => Record.lookup<HeroDependent, keyof HeroDependent> (key) (state))
      .bind (slice => slice instanceof OrderedMap
        ? slice.lookup (id) as any
        : Maybe.empty ()
      );

export const getHeroStateListItemOr = <D extends Dependent = Dependent>(
  id: string,
  create: (id: string) => D
) =>
  (state: Record<HeroDependent>): D =>
    Maybe.fromMaybe (create (id)) (getHeroStateListItem<D> (id) (state));

type SetHeroListState = Maybe<Record<HeroDependent>>;
type SetHeroListStateFn1 = (state: Record<HeroDependent>) => SetHeroListState;
type SetHeroListStateFn2 = (item: Dependent) => SetHeroListStateFn1;

export function setHeroListStateItem (
  id: string
): SetHeroListStateFn2;
export function setHeroListStateItem (
  id: string,
  item: Dependent
): SetHeroListStateFn1;
export function setHeroListStateItem (
  id: string,
  item: Dependent,
  state: Record<HeroDependent>
): SetHeroListState;
export function setHeroListStateItem (
  id: string,
  item?: Dependent,
  state?: Record<HeroDependent>
): SetHeroListState | SetHeroListStateFn1 | SetHeroListStateFn2 {
  const resultFn = (x1: string, x2: Dependent, x3: Record<HeroDependent>) =>
    getHeroStateListKeyById (id)
      .fmap (
        x3.alter (
          slice => slice.fmap (
            justSlice => (justSlice as OrderedMap<string, Dependent>)
              .insert (x1) (x2)
          ) as RecordKey<HeroStateListKey, HeroDependent>
        )
      );

  if (arguments.length === 3) {
    return resultFn (id, item!, state!);
  }
  else if (arguments.length === 2) {
    return (x3: Record<HeroDependent>) => resultFn (id, item!, x3);
  }
  else {
    return (x2: Dependent) =>
      (x3: Record<HeroDependent>) =>
        resultFn (id, x2, x3);
  }
}

export const removeHeroListStateItem = (id: string) =>
  (state: Record<HeroDependent>): Maybe<Record<HeroDependent>> =>
    getHeroStateListKeyById (id)
      .fmap (state.alter (
        slice => slice.fmap (
          justSlice => justSlice.delete (id)
        ) as RecordKey<HeroStateListKey, HeroDependent>
      ));

export const adjustHeroSlice = <K extends HeroStateListKey>(
  adjustFn: (slice: RecordKey<K, HeroDependent>) => RecordKey<K, HeroDependent>,
  key: K
) => (state: Record<HeroDependent>) => {
  return state.alter (adjustFn) (key);
};

/**
 * `alterStateEntry :: Dependent a => (String -> a) -> (a -> Maybe a) ->
(a -> Bool) -> String -> OrderedMap String a`
 *
 * `alterStateEntry altFn adjustFn checkUnusedFn id map` adjusts a entry from a
 * state slice (`map`). If the entry is not present, `altFn` will be called with
 * the given `id`. `adjustFn` will then be called either on the already present
 * or created object. If `checkUnusedFn` returns the adjusted entry is unused,
 * this function will remove the entry from the state slice.
 */
export const alterStateEntry =
  <D extends Dependent>(altFn: (id: string) => D) =>
  (adjustFn: (value: D) => D) =>
  (checkUnusedFn: (value: D) => boolean) =>
  (id: string) =>
  (map: OrderedMap<string, D>): OrderedMap<string, D> =>
    map .alter
      (
        R.pipe (
          Maybe.fromMaybe (altFn (id)),
          adjustFn,
          Maybe.ensure<D> (R.pipe (checkUnusedFn, R.not))
        )
      )
      (id);

/**
 * `adjustMaybeStateEntry :: Dependent a => (String -> a) -> (a -> Maybe a) ->
String -> OrderedMap String a`
 *
 * `alterStateEntry altFn adjustFn id map` adjusts a entry from a
 * state slice (`map`). If the entry is not present, `altFn` will be called with
 * the given `id`. `adjustFn` will then be called either on the already present
 * or created object.
 */
export const adjustMaybeStateEntry =
  <D extends Dependent>(altFn: (id: string) => D) =>
  (adjustFn: (value: D) => D) =>
    alterStateEntry (altFn) (adjustFn) (() => false);

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
  <D extends Dependent>(adjustFn: (value: D) => D) =>
  (checkUnusedFn: (value: D) => boolean) =>
  (id: string) =>
  (map: OrderedMap<string, D>): OrderedMap<string, D> =>
    map .update
      (
        R.pipe (
          adjustFn,
          Maybe.ensure<D> (R.pipe (checkUnusedFn, R.not))
        )
      )
      (id);

export const adjustHeroListStateItemOr =
  <D extends Dependent>(
    createFn: (id: string) => D,
    adjustFn: (value: D) => Maybe<D>,
    id: string
  ) =>
    (state: Record<HeroDependent>) =>
      Maybe.fromMaybe<Record<HeroDependent>> (state) (
        getHeroStateMapKeyById (id)
          .fmap (
            state.modify (
              slice =>
                (slice as any as OrderedMap<string, D>)
                  .alter (
                    R.pipe (
                      Maybe.fromMaybe (createFn (id)),
                      adjustFn
                    )
                  ) (id) as any as (typeof slice)
            )
          )
      );

export const adjustHeroListStateItemWithDefault =
  <D extends Dependent>(
    adjustFn: (value: D) => Maybe<D>,
    id: string
  ) =>
    (state: Record<HeroDependent>) =>
      Maybe.fromMaybe<Record<HeroDependent>> (state) (
        getHeroStateMapKeyById (id)
          .fmap (
            stateKey => state.modify (
              slice =>
                (slice as any as OrderedMap<string, D>)
                  .alter (
                    R.pipe (
                      Maybe.fromMaybe (
                        getEntryCreatorByHeroStateMapKey (stateKey) (id) as D
                      ),
                      adjustFn
                    )
                  ) (id) as any as (typeof slice)
            ) (stateKey)
          )
      );

export const adjustHeroListStateItem =
  <D extends Dependent>(
    adjustFn: (value: D) => D,
    id: string,
    state: Record<HeroDependent>
  ) =>
    Maybe.fromMaybe<Record<HeroDependent>> (state) (
      getHeroStateMapKeyById (id)
        .fmap (
          state.modify (
            slice => (slice as any as OrderedMap<string, D>)
              .adjust (adjustFn) (id) as any as (typeof slice)
          )
        )
    );

export const updateHeroListStateItemOrRemove =
  <D extends Dependent>(
    unusedCheckFn: (value: D) => boolean,
    updateFn: (value: D) => D,
    id: string
  ) =>
    (state: Record<HeroDependent>) =>
      Maybe.fromMaybe<Record<HeroDependent>> (state) (
        getHeroStateMapKeyById (id)
          .fmap (
            state.modify (
              slice => (slice as any as OrderedMap<string, D>)
                .update (
                  value => {
                    const updatedValue = updateFn (value);

                    if (unusedCheckFn (updatedValue)) {
                      return Nothing ();
                    }
                    else {
                      return Just (updatedValue);
                    }
                  }
                ) (id) as any as (typeof slice)
            )
          )
      );

export const getAllEntriesByGroup =
  <I extends Dependent = Dependent, T extends EntryWithGroup = EntryWithGroup>(
    wiki: OrderedMap<string, T>,
    list: OrderedMap<string, I>,
    ...groups: number[]
  ): List<I> => list.elems ().filter (R.pipe (
    e => e.lookup ('id').bind (id => OrderedMap.lookup<string, T> (id) (wiki)),
    e => Maybe.isJust (e) && groups.includes (
      Maybe.fromJust (e.bind (just => just.lookup ('gr')))
    )
  ));
