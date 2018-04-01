import { Categories } from '../constants/Categories';
import { IdPrefixes } from '../constants/IdPrefixes';
import { DependentInstancesStateKeysForMaps } from '../reducers/dependentInstances';
import { WikiState } from '../reducers/wikiReducer';

export function getNewId(keys: string[]) {
  return keys.reduce((n, id) => Math.max(Number.parseInt(id.split('_')[1]), n), 0) + 1;
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

export function getStateKeyById(id: string): DependentInstancesStateKeysForMaps | undefined {
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
    case IdPrefixes.CULTURES:
      return 'cultures';
    case IdPrefixes.DISADVANTAGES:
      return 'disadvantages';
    case IdPrefixes.LITURGIES:
      return 'liturgies';
    case IdPrefixes.PROFESSIONS:
      return 'professions';
    case IdPrefixes.PROFESSION_VARIANTS:
      return 'professionVariants';
    case IdPrefixes.RACES:
      return 'races';
    case IdPrefixes.RACE_VARIANTS:
      return 'raceVariants';
    case IdPrefixes.SPECIAL_ABILITIES:
      return 'specialAbilities';
    case IdPrefixes.SPELLS:
      return 'spells';
    case IdPrefixes.TALENTS:
      return 'talents';
    default:
      return;
  }
}

export function getWikiStateKeyById(id: string): keyof WikiState | undefined {
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
    case IdPrefixes.CULTURES:
      return 'cultures';
    case IdPrefixes.DISADVANTAGES:
      return 'disadvantages';
    case IdPrefixes.LITURGIES:
      return 'liturgicalChants';
    case IdPrefixes.PROFESSIONS:
      return 'professions';
    case IdPrefixes.PROFESSION_VARIANTS:
      return 'professionVariants';
    case IdPrefixes.RACES:
      return 'races';
    case IdPrefixes.RACE_VARIANTS:
      return 'raceVariants';
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

interface StateKeyByCategory {
  [Categories.ADVANTAGES]: 'advantages';
  [Categories.ATTRIBUTES]: 'attributes';
  [Categories.BLESSINGS]: 'blessings';
  [Categories.CANTRIPS]: 'cantrips';
  [Categories.COMBAT_TECHNIQUES]: 'combatTechniques';
  [Categories.CULTURES]: 'cultures';
  [Categories.DISADVANTAGES]: 'disadvantages';
  [Categories.LITURGIES]: 'liturgies';
  [Categories.PROFESSIONS]: 'professions';
  [Categories.PROFESSION_VARIANTS]: 'professionVariants';
  [Categories.RACES]: 'races';
  [Categories.RACE_VARIANTS]: 'raceVariants';
  [Categories.SPECIAL_ABILITIES]: 'specialAbilities';
  [Categories.SPELLS]: 'spells';
  [Categories.TALENTS]: 'talents';
}

const stateKeyByCategory: StateKeyByCategory = {
  [Categories.ADVANTAGES]: 'advantages',
  [Categories.ATTRIBUTES]: 'attributes',
  [Categories.BLESSINGS]: 'blessings',
  [Categories.CANTRIPS]: 'cantrips',
  [Categories.COMBAT_TECHNIQUES]: 'combatTechniques',
  [Categories.CULTURES]: 'cultures',
  [Categories.DISADVANTAGES]: 'disadvantages',
  [Categories.LITURGIES]: 'liturgies',
  [Categories.PROFESSIONS]: 'professions',
  [Categories.PROFESSION_VARIANTS]: 'professionVariants',
  [Categories.RACES]: 'races',
  [Categories.RACE_VARIANTS]: 'raceVariants',
  [Categories.SPECIAL_ABILITIES]: 'specialAbilities',
  [Categories.SPELLS]: 'spells',
  [Categories.TALENTS]: 'talents',
}

export function getStateKeyByCategory<T extends Categories>(category: T): StateKeyByCategory[T] {
  return stateKeyByCategory[category];
}

interface WikiKeyByCategory {
  [Categories.ADVANTAGES]: 'advantages';
  [Categories.ATTRIBUTES]: 'attributes';
  [Categories.BLESSINGS]: 'blessings';
  [Categories.CANTRIPS]: 'cantrips';
  [Categories.COMBAT_TECHNIQUES]: 'combatTechniques';
  [Categories.CULTURES]: 'cultures';
  [Categories.DISADVANTAGES]: 'disadvantages';
  [Categories.LITURGIES]: 'liturgicalChants';
  [Categories.PROFESSIONS]: 'professions';
  [Categories.PROFESSION_VARIANTS]: 'professionVariants';
  [Categories.RACES]: 'races';
  [Categories.RACE_VARIANTS]: 'raceVariants';
  [Categories.SPECIAL_ABILITIES]: 'specialAbilities';
  [Categories.SPELLS]: 'spells';
  [Categories.TALENTS]: 'skills';
}

const wikiKeyByCategory: WikiKeyByCategory = {
  [Categories.ADVANTAGES]: 'advantages',
  [Categories.ATTRIBUTES]: 'attributes',
  [Categories.BLESSINGS]: 'blessings',
  [Categories.CANTRIPS]: 'cantrips',
  [Categories.COMBAT_TECHNIQUES]: 'combatTechniques',
  [Categories.CULTURES]: 'cultures',
  [Categories.DISADVANTAGES]: 'disadvantages',
  [Categories.LITURGIES]: 'liturgicalChants',
  [Categories.PROFESSIONS]: 'professions',
  [Categories.PROFESSION_VARIANTS]: 'professionVariants',
  [Categories.RACES]: 'races',
  [Categories.RACE_VARIANTS]: 'raceVariants',
  [Categories.SPECIAL_ABILITIES]: 'specialAbilities',
  [Categories.SPELLS]: 'spells',
  [Categories.TALENTS]: 'skills',
}

export function getWikiStateKeyByCategory<T extends Categories>(category: T): WikiKeyByCategory[T] {
  return wikiKeyByCategory[category];
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
