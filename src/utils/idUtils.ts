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

export function getCategoryByIdPrefix(id: IdPrefixes): Categories | undefined {
  return match<IdPrefixes, Categories | undefined>(id)
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
    .otherwise(() => undefined);
}

export function getCategoryById(id: string): Categories | undefined {
  return getCategoryByIdPrefix(getIdPrefix(id));
}

export function getIdPrefix(id: string): IdPrefixes {
  return id.split(/_/)[0] as IdPrefixes;
}

export function getNumericId(id: string): number {
  return Number.parseInt(id.split(/_/)[1]);
}

export function getStringId(id: number, prefix: string): string {
  return `${prefix}_${id}`;
}

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

export function isMagicalTraditionId(id: string): boolean {
	return magicalNumericIdByTraditionId.has(id);
}

export function getMagicalTraditionInstanceIdByNumericId(id: number): string {
	return magicalTraditionIdByNumericId.get(id)!;
}

export function getNumericMagicalTraditionIdByInstanceId(id: string): number {
	return magicalNumericIdByTraditionId.get(id)!;
}

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

export function isBlessedTraditionId(id: string): boolean {
	return blessedNumericIdByTraditionId.has(id);
}

export function getBlessedTraditionInstanceIdByNumericId(id: number): string {
	return blessedTraditionIdByNumericId.get(id)!;
}

export function getNumericBlessedTraditionIdByInstanceId(id: string): number {
	return blessedNumericIdByTraditionId.get(id)!;
}
