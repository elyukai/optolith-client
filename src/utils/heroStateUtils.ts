import { IdPrefixes } from '../constants/IdPrefixes';
import { Dependent, HeroDependent } from '../types/data.d';
import { EntryWithGroup } from '../types/wiki';
import { getIdPrefix } from './IDUtils';
import { convertMapToValueArray, deleteMapItem, setMapItem } from './collectionUtils';
import { maybe } from './exists';
import { match } from './match';
import { pipe } from './pipe';

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

export function getHeroStateListKeyById(id: string): HeroStateListKey | undefined {
  return match<IdPrefixes, HeroStateListKey | undefined>(getIdPrefix(id))
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
    .otherwise(() => undefined);
}

export const getHeroStateListItem = <D extends Dependent = Dependent>(
  state: HeroDependent,
  id: string,
): D | undefined => pipe(
  getHeroStateListKeyById,
  key => key && state[key],
  slice => slice instanceof Map ? slice.get(id) as D | undefined : undefined
)(id);

export const setHeroListStateItem = <D extends Dependent = Dependent>(
  state: HeroDependent,
  id: string,
  item: D,
): HeroDependent => pipe(
  getHeroStateListKeyById,
  maybe(key => ({
    ...state,
    [key]: setMapItem(state[key] as Map<string, D>, id, item),
  }), state)
)(id);

export const removeHeroListStateItem = <D extends Dependent = Dependent>(
  state: HeroDependent,
  id: string,
): HeroDependent => pipe(
  getHeroStateListKeyById,
  maybe(key => ({
    ...state,
    [key]: deleteMapItem<string, D>(state[key] as Map<string, D>, id),
  }), state)
)(id);

export const getAllEntriesByGroup =
  <T extends EntryWithGroup = EntryWithGroup, I extends Dependent = Dependent>(
    wiki: Map<string, T>,
    list: Map<string, I>,
    ...groups: number[],
  ) => pipe<Map<string, I>, I[]>(
    convertMapToValueArray,
    list => list.filter(pipe<I, T | undefined, boolean>(
      e => wiki.get(e.id),
      e => typeof e === 'object' && groups.includes(e.gr),
    )),
  )(list);
