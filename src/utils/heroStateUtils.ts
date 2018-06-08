import R from 'ramda';
import { IdPrefixes } from '../constants/IdPrefixes';
import { Dependent, HeroDependent } from '../types/data.d';
import { EntryWithGroup } from '../types/wiki';
import { adjustOrM, deleteMapItem, setMapItem } from './collectionUtils';
import { List, Maybe, ReadMap } from './dataUtils';
import { getIdPrefix } from './IDUtils';
import { match } from './match';

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
): Maybe<HeroStateListKey> => {
  return Maybe.of(
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
    (state: HeroDependent): Maybe<D> =>
      getHeroStateListKeyById(id)
        .map(key => state[key])
        .bind(slice => slice instanceof Map
          ? Maybe.of(slice.get(id) as D | undefined)
          : Maybe.Nothing()
        );

export const getHeroStateListItemOr =
  <D extends Dependent = Dependent>(id: string, create: (id: string) => D) =>
    (state: HeroDependent): D =>
      getHeroStateListItem<D>(id)(state).valueOr(create(id));

export const setHeroListStateItem =
  <D extends Dependent = Dependent>(id: string) => (item: D) =>
    (state: HeroDependent): HeroDependent =>
      getHeroStateListKeyById(id)
        .map(key => ({
          ...state,
          [key]: setMapItem(state[key] as Map<string, D>, id, item),
        }))
        .valueOr(state);

export const removeHeroListStateItem =
  <D extends Dependent = Dependent>(id: string) =>
    (state: HeroDependent): HeroDependent =>
      getHeroStateListKeyById(id)
        .map(key => ({
          ...state,
          [key]: deleteMapItem<string, D>(state[key] as Map<string, D>, id),
        }))
        .valueOr(state);

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
) => getHeroStateListKeyById(id)
  .map(key => ({
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
  .valueOr(state);

export const getAllEntriesByGroup =
  <I extends Dependent = Dependent, T extends EntryWithGroup = EntryWithGroup>(
    wiki: ReadMap<string, T>,
    list: ReadMap<string, I>,
    ...groups: number[]
  ): List<I> => list.elems().filter(R.pipe(
    e => e.id,
    wiki.lookup,
    e => Maybe.isJust(e) && groups.includes(e.valueOr().gr)
  ));
