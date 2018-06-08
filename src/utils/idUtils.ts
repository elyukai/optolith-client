import { Categories } from '../constants/Categories';
import { IdPrefixes } from '../constants/IdPrefixes';
import { match } from './match';
import { Maybe } from './maybe';

export const getNewId = (keys: string[]) => {
  return keys.reduce((n, id) => {
    return Math.max(Number.parseInt(id.split('_')[1]), n);
  }, 0) + 1;
};

export const getNewIdByDate = () => Date.now().valueOf();

export const getCategoryByIdPrefix = (id: IdPrefixes) => {
  return Maybe.of(match<IdPrefixes, Categories | undefined>(id)
    .on(IdPrefixes.ADVANTAGES, () => Categories.ADVANTAGES)
    .on(IdPrefixes.ATTRIBUTES, () => Categories.ATTRIBUTES)
    .on(IdPrefixes.BLESSINGS, () => Categories.BLESSINGS)
    .on(IdPrefixes.CANTRIPS, () => Categories.CANTRIPS)
    .on(IdPrefixes.COMBAT_TECHNIQUES, () => Categories.COMBAT_TECHNIQUES)
    .on(IdPrefixes.CULTURES, () => Categories.CULTURES)
    .on(IdPrefixes.DISADVANTAGES, () => Categories.DISADVANTAGES)
    .on(IdPrefixes.LITURGIES, () => Categories.LITURGIES)
    .on(IdPrefixes.PROFESSIONS, () => Categories.PROFESSIONS)
    .on(IdPrefixes.PROFESSION_VARIANTS, () => Categories.PROFESSION_VARIANTS)
    .on(IdPrefixes.RACES, () => Categories.RACES)
    .on(IdPrefixes.RACE_VARIANTS, () => Categories.RACE_VARIANTS)
    .on(IdPrefixes.SPECIAL_ABILITIES, () => Categories.SPECIAL_ABILITIES)
    .on(IdPrefixes.SPELLS, () => Categories.SPELLS)
    .on(IdPrefixes.TALENTS, () => Categories.TALENTS)
    .otherwise(() => undefined));
};

export const getCategoryById = (id: string) => {
  return getCategoryByIdPrefix(getIdPrefix(id));
};

export const getIdPrefix = (id: string) => id.split(/_/)[0] as IdPrefixes;

export const getNumericId = (id: string) => Number.parseInt(id.split(/_/)[1]);

export const getStringId = (id: number, prefix: string) => `${prefix}_${id}`;

export const magicalTraditionIdByNumericId = new Map([
  [1, 'SA_70'],
  [2, 'SA_255'],
  [3, 'SA_345'],
  [4, 'SA_346'],
  [5, 'SA_676'],
  [6, 'SA_677'],
  [7, 'SA_678'],
  [8, 'SA_679'],
  [9, 'SA_680'],
  [10, 'SA_681'],
]);

export const magicalNumericIdByTraditionId = new Map([
  ['SA_70', 1],
  ['SA_255', 2],
  ['SA_345', 3],
  ['SA_346', 4],
  ['SA_676', 5],
  ['SA_677', 6],
  ['SA_678', 7],
  ['SA_679', 8],
  ['SA_680', 9],
  ['SA_681', 10],
]);

export const isMagicalTraditionId = (id: string) => {
  return magicalNumericIdByTraditionId.has(id);
};

export const getMagicalTraditionInstanceIdByNumericId = (id: number) => {
  return Maybe.of(magicalTraditionIdByNumericId.get(id));
};

export const getNumericMagicalTraditionIdByInstanceId = (id: string) => {
  return Maybe.of(magicalNumericIdByTraditionId.get(id));
};

const blessedTraditionIdByNumericId = new Map([
  [1, 'SA_86'],
  [2, 'SA_682'],
  [3, 'SA_683'],
  [4, 'SA_684'],
  [5, 'SA_685'],
  [6, 'SA_686'],
  [7, 'SA_687'],
  [8, 'SA_688'],
  [9, 'SA_689'],
  [10, 'SA_690'],
  [11, 'SA_691'],
  [12, 'SA_692'],
  [13, 'SA_693'],
  [14, 'SA_694'],
  [15, 'SA_695'],
  [16, 'SA_696'],
  [17, 'SA_697'],
  [18, 'SA_698'],
]);

const blessedNumericIdByTraditionId = new Map([
  ['SA_86', 1],
  ['SA_682', 2],
  ['SA_683', 3],
  ['SA_684', 4],
  ['SA_685', 5],
  ['SA_686', 6],
  ['SA_687', 7],
  ['SA_688', 8],
  ['SA_689', 9],
  ['SA_690', 10],
  ['SA_691', 11],
  ['SA_692', 12],
  ['SA_693', 13],
  ['SA_694', 14],
  ['SA_695', 15],
  ['SA_696', 16],
  ['SA_697', 17],
  ['SA_698', 18],
]);

export const isBlessedTraditionId = (id: string) => {
  return blessedNumericIdByTraditionId.has(id);
};

export const getBlessedTraditionInstanceIdByNumericId = (id: number) => {
  return Maybe.of(blessedTraditionIdByNumericId.get(id));
};

export const getNumericBlessedTraditionIdByInstanceId = (id: string) => {
  return Maybe.of(blessedNumericIdByTraditionId.get(id));
};
