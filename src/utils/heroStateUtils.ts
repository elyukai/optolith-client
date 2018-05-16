import R from 'ramda';
import { IdPrefixes } from '../constants/IdPrefixes';
import { Dependent, HeroDependent } from '../types/data.d';
import { EntryWithGroup } from '../types/wiki';
import { getIdPrefix } from './IDUtils';
import { adjustOrM, convertMapToValues, deleteMapItem, setMapItem } from './collectionUtils';
import { match } from './match';
import { Maybe, MaybeFunctor } from './maybe';

export type HeroStateListKey =
  'advantages' |
  'attributes' |
  'blessings' |
  'cantrips' |
  'combatTechniques' |
  'disadvantages' |
  'liturgicalChants' |
  'skills' |
  'specialAbilities' |
  'spells';

export type HeroStateMapKey =
  'advantages' |
  'attributes' |
  'combatTechniques' |
  'disadvantages' |
  'liturgicalChants' |
  'skills' |
  'specialAbilities' |
  'spells';

export const getHeroStateListKeyById = (
  id: string,
): MaybeFunctor<HeroStateListKey | undefined> => {
  return Maybe(
    match<IdPrefixes, HeroStateListKey | undefined>(getIdPrefix(id))
      .on(IdPrefixes.ADVANTAGES, () => 'advantages')
      .on(IdPrefixes.ATTRIBUTES, () => 'attributes')
      .on(IdPrefixes.BLESSINGS, () => 'blessings')
      .on(IdPrefixes.CANTRIPS, () => 'cantrips')
      .on(IdPrefixes.COMBAT_TECHNIQUES, () => 'combatTechniques')
      .on(IdPrefixes.DISADVANTAGES, () => 'disadvantages')
      .on(IdPrefixes.LITURGIES, () => 'liturgicalChants')
      .on(IdPrefixes.SPECIAL_ABILITIES, () => 'specialAbilities')
      .on(IdPrefixes.SPELLS, () => 'spells')
      .on(IdPrefixes.TALENTS, () => 'skills')
      .otherwise(() => undefined)
  );
}

export const getHeroStateListItem =
  <D extends Dependent = Dependent>(id: string) =>
    (state: HeroDependent): MaybeFunctor<D | undefined> =>
      getHeroStateListKeyById(id)
        .fmap(key => state[key])
        .fmap(slice => slice instanceof Map
          ? slice.get(id) as D | undefined
          : undefined
        );

export const getHeroStateListItemOr =
  <D extends Dependent = Dependent>(id: string, create: (id: string) => D) =>
    (state: HeroDependent): D =>
      R.defaultTo(create(id), getHeroStateListItem<D>(id)(state).value);

export const setHeroListStateItem =
  <D extends Dependent = Dependent>(id: string) => (item: D) =>
    (state: HeroDependent): HeroDependent =>
      R.defaultTo(state, getHeroStateListKeyById(id)
        .fmap(key => ({
          ...state,
          [key]: setMapItem(state[key] as Map<string, D>, id, item),
        }))
        .value
      );

export const removeHeroListStateItem =
  <D extends Dependent = Dependent>(id: string) =>
    (state: HeroDependent): HeroDependent =>
      R.defaultTo(state, getHeroStateListKeyById(id)
        .fmap(key => ({
          ...state,
          [key]: deleteMapItem<string, D>(state[key] as Map<string, D>, id),
        }))
        .value
      );

export const adjustHeroSlice = <K extends HeroStateListKey>(
  adjustFn: (slice: HeroDependent[K]) => HeroDependent[K],
  key: K,
) => (state: HeroDependent) => {
  return {
    ...state,
    [key]: adjustFn(state[key])
  };
};

export const adjustHeroListStateItemOr = <D extends Dependent>(
  createFn: (id: string) => D,
  adjustFn: (value: D) => D | undefined,
  id: string,
) => (
  state: HeroDependent,
) => R.defaultTo(state, getHeroStateListKeyById(id)
  .fmap(key => ({
    ...state,
    [key]: adjustOrM<string, D>(
      R.pipe(
        createFn,
        adjustFn as (x: D) => D,
      ),
      adjustFn,
      id
    )(state[key] as any),
  }))
  .value
);

export const getAllEntriesByGroup =
  <I extends Dependent = Dependent, T extends EntryWithGroup = EntryWithGroup>(
    wiki: ReadonlyMap<string, T>,
    list: ReadonlyMap<string, I>,
    ...groups: number[],
  ): I[] => R.pipe<ReadonlyMap<string, I>, ReadonlyArray<I>, I[]>(
    convertMapToValues,
    list => list.filter(R.pipe(
      (e: I) => wiki.get(e.id),
      e => typeof e === 'object' && groups.includes(e.gr),
    )),
  )(list);
