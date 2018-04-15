import { Categories } from '../constants/Categories';
import { IdPrefixes } from '../constants/IdPrefixes';

export function getNewId(keys: string[]) {
  return keys.reduce((n, id) => {
    return Math.max(Number.parseInt(id.split('_')[1]), n);
  }, 0) + 1;
}

export function getNewIdByDate() {
  return Date.now().valueOf();
}

export function getCategoryById(id: string): Categories | undefined {
  switch (getIdPrefix(id)) {
    case IdPrefixes.ADVANTAGES:
      return Categories.ADVANTAGES;
    case IdPrefixes.ATTRIBUTES:
      return Categories.ATTRIBUTES;
    case IdPrefixes.BLESSINGS:
      return Categories.BLESSINGS;
    case IdPrefixes.CANTRIPS:
      return Categories.CANTRIPS;
    case IdPrefixes.COMBAT_TECHNIQUES:
      return Categories.COMBAT_TECHNIQUES;
    case IdPrefixes.CULTURES:
      return Categories.CULTURES;
    case IdPrefixes.DISADVANTAGES:
      return Categories.DISADVANTAGES;
    case IdPrefixes.LITURGIES:
      return Categories.LITURGIES;
    case IdPrefixes.PROFESSIONS:
      return Categories.PROFESSIONS;
    case IdPrefixes.PROFESSION_VARIANTS:
      return Categories.PROFESSION_VARIANTS;
    case IdPrefixes.RACES:
      return Categories.RACES;
    case IdPrefixes.RACE_VARIANTS:
      return Categories.RACE_VARIANTS;
    case IdPrefixes.SPECIAL_ABILITIES:
      return Categories.SPECIAL_ABILITIES;
    case IdPrefixes.SPELLS:
      return Categories.SPELLS;
    case IdPrefixes.TALENTS:
      return Categories.TALENTS;
    default:
      return undefined;
  }
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
