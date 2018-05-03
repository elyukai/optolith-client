import { getIdPrefix } from './IDUtils';
import { IdPrefixes } from '../constants/IdPrefixes';
import { HeroDependent, Dependent } from '../types/data.d';
import { setListItem, removeListItem } from './collectionUtils';

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
  switch (getIdPrefix(id)) {
    case IdPrefixes.ADVANTAGES:
      return 'advantages';
    case IdPrefixes.ATTRIBUTES:
      return 'attributes';
    case IdPrefixes.BLESSINGS:
      return 'blessings';
    case IdPrefixes.CANTRIPS:
      return 'cantrips';
    case IdPrefixes.COMBAT_TECHNIQUES:
      return 'combatTechniques';
    case IdPrefixes.DISADVANTAGES:
      return 'disadvantages';
    case IdPrefixes.LITURGIES:
      return 'liturgicalChants';
    case IdPrefixes.SPECIAL_ABILITIES:
      return 'specialAbilities';
    case IdPrefixes.SPELLS:
      return 'spells';
    case IdPrefixes.TALENTS:
      return 'skills';
    default:
      return;
  }
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
      [key]: setListItem(state[key] as Map<string, D>, id, item),
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
      [key]: removeListItem(state[key] as Map<string, D>, id),
    };
  }

  return state;
}
