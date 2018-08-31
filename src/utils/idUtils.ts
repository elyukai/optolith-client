import R from 'ramda';
import { Categories } from '../constants/Categories';
import { IdPrefixes } from '../constants/IdPrefixes';
import { List, Maybe, OrderedMap } from './dataUtils';
import { match } from './match';

export const getIdPrefix = (id: string) => id.split (/_/)[0] as IdPrefixes;

export const getNumericId = (id: string) => Number.parseInt (id.split (/_/)[1]);

export const getStringId = (prefix: IdPrefixes) => (id: number) => `${prefix}_${id}`;

export const getRawStringId = (prefix: IdPrefixes) => (id: string) => `${prefix}_${id}`;

/**
 * Gets a list of ids and returns an unused numeric id.
 */
export const getNewId = (keys: List<string>): number =>
  keys.foldl<number> (n => R.pipe (getNumericId, R.max (n))) (0) + 1;

/**
 * Returns the current date in milliseconds.
 */
export const getNewIdByDate = (): number => Date.now ().valueOf ();

export const getCategoryByIdPrefix = (id: IdPrefixes): Maybe<Categories> => {
  return match<IdPrefixes, Maybe<Categories>> (id)
    .on (IdPrefixes.ADVANTAGES, () => Maybe.pure (Categories.ADVANTAGES))
    .on (IdPrefixes.ATTRIBUTES, () => Maybe.pure (Categories.ATTRIBUTES))
    .on (IdPrefixes.BLESSINGS, () => Maybe.pure (Categories.BLESSINGS))
    .on (IdPrefixes.CANTRIPS, () => Maybe.pure (Categories.CANTRIPS))
    .on (IdPrefixes.COMBAT_TECHNIQUES, () => Maybe.pure (Categories.COMBAT_TECHNIQUES))
    .on (IdPrefixes.CULTURES, () => Maybe.pure (Categories.CULTURES))
    .on (IdPrefixes.DISADVANTAGES, () => Maybe.pure (Categories.DISADVANTAGES))
    .on (IdPrefixes.LITURGIES, () => Maybe.pure (Categories.LITURGIES))
    .on (IdPrefixes.PROFESSIONS, () => Maybe.pure (Categories.PROFESSIONS))
    .on (IdPrefixes.PROFESSION_VARIANTS, () => Maybe.pure (Categories.PROFESSION_VARIANTS))
    .on (IdPrefixes.RACES, () => Maybe.pure (Categories.RACES))
    .on (IdPrefixes.RACE_VARIANTS, () => Maybe.pure (Categories.RACE_VARIANTS))
    .on (IdPrefixes.SPECIAL_ABILITIES, () => Maybe.pure (Categories.SPECIAL_ABILITIES))
    .on (IdPrefixes.SPELLS, () => Maybe.pure (Categories.SPELLS))
    .on (IdPrefixes.TALENTS, () => Maybe.pure (Categories.TALENTS))
    .otherwise (() => Maybe.empty ());
};

export const getCategoryById = (id: string): Maybe<Categories> =>
  getCategoryByIdPrefix (getIdPrefix (id));

export const magicalTraditionIdByNumericId = OrderedMap.of ([
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

export const magicalNumericIdByTraditionId = OrderedMap.of ([
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

export const isMagicalTraditionId = (id: string) =>
  magicalNumericIdByTraditionId.member (id);

export const getMagicalTraditionInstanceIdByNumericId = (id: number) =>
  magicalTraditionIdByNumericId.lookup (id);

export const getNumericMagicalTraditionIdByInstanceId = (id: string) =>
  magicalNumericIdByTraditionId.lookup (id);

const blessedTraditionIdByNumericId = OrderedMap.of ([
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

const blessedNumericIdByTraditionId = OrderedMap.of ([
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

export const isBlessedTraditionId = (id: string) =>
  blessedNumericIdByTraditionId.member (id);

export const getBlessedTraditionInstanceIdByNumericId = (id: number) =>
  blessedTraditionIdByNumericId.lookup (id);

export const getNumericBlessedTraditionIdByInstanceId = (id: string) =>
  blessedNumericIdByTraditionId.lookup (id);
