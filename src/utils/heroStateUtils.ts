import R from 'ramda';
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

export const getHeroStateListKeyById = (
  id: string,
): Maybe<HeroStateListKey> => {
  return match<IdPrefixes, Maybe<HeroStateListKey>>(getIdPrefix(id))
    .on(IdPrefixes.ADVANTAGES, () =>
      Maybe.Just<HeroStateListKey>('advantages')
    )
    .on(IdPrefixes.ATTRIBUTES, () =>
      Maybe.Just<HeroStateListKey>('attributes')
    )
    .on(IdPrefixes.BLESSINGS, () =>
      Maybe.Just<HeroStateListKey>('blessings')
    )
    .on(IdPrefixes.CANTRIPS, () =>
      Maybe.Just<HeroStateListKey>('cantrips')
    )
    .on(IdPrefixes.COMBAT_TECHNIQUES, () =>
      Maybe.Just<HeroStateListKey>('combatTechniques')
    )
    .on(IdPrefixes.DISADVANTAGES, () =>
      Maybe.Just<HeroStateListKey>('disadvantages')
    )
    .on(IdPrefixes.LITURGIES, () =>
      Maybe.Just<HeroStateListKey>('liturgicalChants')
    )
    .on(IdPrefixes.SPECIAL_ABILITIES, () =>
      Maybe.Just<HeroStateListKey>('specialAbilities')
    )
    .on(IdPrefixes.SPELLS, () =>
      Maybe.Just<HeroStateListKey>('spells')
    )
    .on(IdPrefixes.TALENTS, () =>
      Maybe.Just<HeroStateListKey>('skills')
    )
    .otherwise(Maybe.Nothing);
};

export const getHeroStateMapKeyById = (
  id: string,
): Maybe<HeroStateMapKey> => {
  return match<IdPrefixes, Maybe<HeroStateMapKey>>(getIdPrefix(id))
    .on(IdPrefixes.ADVANTAGES, () =>
      Maybe.Just<HeroStateMapKey>('advantages')
    )
    .on(IdPrefixes.ATTRIBUTES, () =>
      Maybe.Just<HeroStateMapKey>('attributes')
    )
    .on(IdPrefixes.COMBAT_TECHNIQUES, () =>
      Maybe.Just<HeroStateMapKey>('combatTechniques')
    )
    .on(IdPrefixes.DISADVANTAGES, () =>
      Maybe.Just<HeroStateMapKey>('disadvantages')
    )
    .on(IdPrefixes.LITURGIES, () =>
      Maybe.Just<HeroStateMapKey>('liturgicalChants')
    )
    .on(IdPrefixes.SPECIAL_ABILITIES, () =>
      Maybe.Just<HeroStateMapKey>('specialAbilities')
    )
    .on(IdPrefixes.SPELLS, () =>
      Maybe.Just<HeroStateMapKey>('spells')
    )
    .on(IdPrefixes.TALENTS, () =>
      Maybe.Just<HeroStateMapKey>('skills')
    )
    .otherwise(Maybe.Nothing);
};

export const getEntryCreatorByHeroStateMapKey = (
  key: HeroStateMapKey,
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

export function getHeroStateListItem<D extends Dependent = Dependent>(
  id: string,
): (state: Record<HeroDependent>) => Maybe<D>;
export function getHeroStateListItem<D extends Dependent = Dependent>(
  id: string,
  state: Record<HeroDependent>
): Maybe<D>;
export function getHeroStateListItem<D extends Dependent = Dependent>(
  id: string,
  state?: Record<HeroDependent>
): Maybe<D> | ((state: Record<HeroDependent>) => Maybe<D>) {
  const resultFn = (x1: Record<HeroDependent>): Maybe<D> =>
    getHeroStateListKeyById(id)
      .bind(x1.lookup)
      .bind(slice => slice instanceof OrderedMap
        ? slice.lookup(id) as any
        : Maybe.Nothing()
      );

  if (arguments.length === 1) {
    return resultFn;
  }
  else {
    return resultFn(state!);
  }
}

export const getHeroStateListItemOr = <D extends Dependent = Dependent>(
  id: string,
  create: (id: string) => D
) =>
  (state: Record<HeroDependent>): D =>
    Maybe.fromMaybe(create(id), getHeroStateListItem<D>(id)(state));

type SetHeroListState = Maybe<Record<HeroDependent>>;
type SetHeroListStateFn1 = (state: Record<HeroDependent>) => SetHeroListState;
type SetHeroListStateFn2 = (item: Dependent) => SetHeroListStateFn1;

export function setHeroListStateItem(
  id: string
): SetHeroListStateFn2;
export function setHeroListStateItem(
  id: string,
  item: Dependent
): SetHeroListStateFn1;
export function setHeroListStateItem(
  id: string,
  item: Dependent,
  state: Record<HeroDependent>
): SetHeroListState;
export function setHeroListStateItem(
  id: string,
  item?: Dependent,
  state?: Record<HeroDependent>
): SetHeroListState | SetHeroListStateFn1 | SetHeroListStateFn2 {
  const resultFn = (x1: string, x2: Dependent, x3: Record<HeroDependent>) =>
    getHeroStateListKeyById(id)
      .map(
        x3.alter(slice => slice.map(justSlice =>
          (justSlice as OrderedMap<string, Dependent>)
            .insert(x1, x2)
        ) as RecordKey<HeroStateListKey, HeroDependent>)
      );

  if (arguments.length === 3) {
    return resultFn(id, item!, state!);
  }
  else if (arguments.length === 2) {
    return (x3: Record<HeroDependent>) => resultFn(id, item!, x3);
  }
  else {
    return (x2: Dependent) =>
      (x3: Record<HeroDependent>) =>
        resultFn(id, x2, x3);
  }
}

export const removeHeroListStateItem = (id: string) =>
  (state: Record<HeroDependent>): Maybe<Record<HeroDependent>> =>
    getHeroStateListKeyById(id)
      .map(state.alter(
        slice => slice.map(
          justSlice => justSlice.delete(id)
        ) as RecordKey<HeroStateListKey, HeroDependent>
      ));

export const adjustHeroSlice = <K extends HeroStateListKey>(
  adjustFn: (slice: RecordKey<K, HeroDependent>) => RecordKey<K, HeroDependent>,
  key: K,
) => (state: Record<HeroDependent>) => {
  return state.alter(adjustFn, key);
};

export const adjustHeroListStateItemOr =
  <D extends Dependent>(
    createFn: (id: string) => D,
    adjustFn: (value: D) => Maybe<D>,
    id: string,
  ) =>
    (state: Record<HeroDependent>) =>
      Maybe.fromMaybe<Record<HeroDependent>>(
        state,
        getHeroStateMapKeyById(id)
          .map(
            state.modify(
              slice =>
                (slice as any as OrderedMap<string, D>)
                  .alter(
                    R.pipe(
                      Maybe.fromMaybe(createFn(id)),
                      adjustFn
                    ),
                    id
                  ) as any as (typeof slice)
            )
          )
      );

export const adjustHeroListStateItemWithDefault =
  <D extends Dependent>(
    adjustFn: (value: D) => Maybe<D>,
    id: string,
  ) =>
    (state: Record<HeroDependent>) =>
      Maybe.fromMaybe<Record<HeroDependent>>(
        state,
        getHeroStateMapKeyById(id)
          .map(
            stateKey => state.modify(
              slice =>
                (slice as any as OrderedMap<string, D>)
                  .alter(
                    R.pipe(
                      Maybe.fromMaybe(
                        getEntryCreatorByHeroStateMapKey(stateKey)(id) as D
                      ),
                      adjustFn
                    ),
                    id
                  ) as any as (typeof slice),
              stateKey
            )
          )
      );

export const adjustHeroListStateItem =
  <D extends Dependent>(
    adjustFn: (value: D) => D,
    id: string,
    state: Record<HeroDependent>
  ) =>
    Maybe.fromMaybe<Record<HeroDependent>>(
      state,
      getHeroStateMapKeyById(id)
        .map(
          state.modify(
            slice =>
              (slice as any as OrderedMap<string, D>)
                .adjust(
                  adjustFn,
                  id
                ) as any as (typeof slice)
          )
        )
    );

export const updateHeroListStateItemOrRemove =
  <D extends Dependent>(
    unusedCheckFn: (value: D) => boolean,
    updateFn: (value: D) => D,
    id: string,
  ) =>
    (state: Record<HeroDependent>) =>
      Maybe.fromMaybe<Record<HeroDependent>>(
        state,
        getHeroStateMapKeyById(id)
          .map(
            state.modify(
              slice =>
                (slice as any as OrderedMap<string, D>)
                  .update(
                    value => {
                      const updatedValue = updateFn(value);

                      if (unusedCheckFn(updatedValue)) {
                        return Nothing();
                      }
                      else {
                        return Just(updatedValue);
                      }
                    },
                    id
                  ) as any as (typeof slice)
            )
          )
      );

export const getAllEntriesByGroup =
  <I extends Dependent = Dependent, T extends EntryWithGroup = EntryWithGroup>(
    wiki: OrderedMap<string, T>,
    list: OrderedMap<string, I>,
    ...groups: number[]
  ): List<I> => list.elems().filter(R.pipe(
    e => e.lookup('id').bind(wiki.lookup),
    e => Maybe.isJust(e) && groups.includes(
      Maybe.fromJust(e.bind(just => just.lookup('gr')))
    )
  ));
