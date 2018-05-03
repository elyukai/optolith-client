import { Categories } from '../constants/Categories';
import { IdPrefixes } from '../constants/IdPrefixes';
import { match } from './match';

export function getNewId(keys: string[]) {
  return keys.reduce((n, id) => {
    return Math.max(Number.parseInt(id.split('_')[1]), n);
  }, 0) + 1;
}

export function getNewIdByDate() {
  return Date.now().valueOf();
}

export function getCategoryById(id: string): Categories | undefined {
  return match<IdPrefixes, Categories | undefined>(getIdPrefix(id))
    .on(pre => pre === IdPrefixes.ADVANTAGES, () => Categories.ADVANTAGES)
    .on(pre => pre === IdPrefixes.ATTRIBUTES, () => Categories.ATTRIBUTES)
    .on(pre => pre === IdPrefixes.BLESSINGS, () => Categories.BLESSINGS)
    .on(pre => pre === IdPrefixes.CANTRIPS, () => Categories.CANTRIPS)
    .on(pre => pre === IdPrefixes.COMBAT_TECHNIQUES, () => Categories.COMBAT_TECHNIQUES)
    .on(pre => pre === IdPrefixes.CULTURES, () => Categories.CULTURES)
    .on(pre => pre === IdPrefixes.DISADVANTAGES, () => Categories.DISADVANTAGES)
    .on(pre => pre === IdPrefixes.LITURGIES, () => Categories.LITURGIES)
    .on(pre => pre === IdPrefixes.PROFESSIONS, () => Categories.PROFESSIONS)
    .on(pre => pre === IdPrefixes.PROFESSION_VARIANTS, () => Categories.PROFESSION_VARIANTS)
    .on(pre => pre === IdPrefixes.RACES, () => Categories.RACES)
    .on(pre => pre === IdPrefixes.RACE_VARIANTS, () => Categories.RACE_VARIANTS)
    .on(pre => pre === IdPrefixes.SPECIAL_ABILITIES, () => Categories.SPECIAL_ABILITIES)
    .on(pre => pre === IdPrefixes.SPELLS, () => Categories.SPELLS)
    .on(pre => pre === IdPrefixes.TALENTS, () => Categories.TALENTS)
    .otherwise(() => undefined);
}

export function getNumericId(id: string): number {
  return Number.parseInt(id.split(/_/)[1]);
}

export function getIdPrefix(id: string): IdPrefixes {
  return id.split(/_/)[0] as IdPrefixes;
}

export function getStringId(id: number, prefix: string): string {
  return `${prefix}_${id}`;
}
