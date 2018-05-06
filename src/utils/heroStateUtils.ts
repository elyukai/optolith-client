import { IdPrefixes } from '../constants/IdPrefixes';
import { Dependent, HeroDependent } from '../types/data.d';
import { getIdPrefix } from './IDUtils';
import { deleteMapItem, setMapItem } from './collectionUtils';
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

export function getHeroStateListItem<D extends Dependent = Dependent>(
  state: HeroDependent,
  id: string,
): D | undefined {
  const key = getHeroStateListKeyById(id);
  const slice = key && state[key];

  if (slice instanceof Map) {
    return slice.get(id) as D | undefined;
  }

  return undefined;
}

export function setHeroListStateItem<D extends Dependent = Dependent>(
  state: HeroDependent,
  id: string,
  item: D,
): HeroDependent {
  const key = getHeroStateListKeyById(id);

  if (key) {
    return {
      ...state,
      [key]: setMapItem(state[key] as Map<string, D>, id, item),
    };
  }

  return state;
}

export function removeHeroListStateItem<D extends Dependent = Dependent>(
  state: HeroDependent,
  id: string,
): HeroDependent {
  const key = getHeroStateListKeyById(id);

  if (key) {
    return {
      ...state,
      [key]: deleteMapItem<string, D>(state[key] as Map<string, D>, id),
    };
  }

  return state;
}
