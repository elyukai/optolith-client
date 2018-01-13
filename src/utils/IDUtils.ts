import * as Categories from '../constants/Categories';
import { DependentInstancesStateKeysForMaps } from '../reducers/dependentInstances';
import { WikiState } from '../reducers/wikiReducer';

export function getNewId(keys: string[]) {
	return keys.reduce((n, id) => Math.max(Number.parseInt(id.split('_')[1]), n), 0) + 1;
}

export function getNewIdByDate() {
	return Date.now().valueOf();
}

export function getCategoryById(id: string): Categories.Category | undefined {
	const categoryTag = id.split(/_/)[0];
	switch (categoryTag) {
		case 'ADV':
			return Categories.ADVANTAGES;
		case 'ATTR':
			return Categories.ATTRIBUTES;
		case 'BLESSING':
			return Categories.BLESSINGS;
		case 'CANTRIP':
			return Categories.CANTRIPS;
		case 'CT':
			return Categories.COMBAT_TECHNIQUES;
		case 'C':
			return Categories.CULTURES;
		case 'DISADV':
			return Categories.DISADVANTAGES;
		case 'LITURGY':
			return Categories.LITURGIES;
		case 'P':
			return Categories.PROFESSIONS;
		case 'PV':
			return Categories.PROFESSION_VARIANTS;
		case 'R':
			return Categories.RACES;
		case 'SA':
			return Categories.SPECIAL_ABILITIES;
		case 'SPELL':
			return Categories.SPELLS;
		case 'TAL':
			return Categories.TALENTS;
		default:
			return undefined;
	}
}

export function getStateKeyById(id: string): DependentInstancesStateKeysForMaps | undefined {
	const categoryTag = id.split(/_/)[0];
	switch (categoryTag) {
		case 'ADV':
			return 'advantages';
		case 'ATTR':
			return 'attributes';
		case 'BLESSING':
			return 'blessings';
		case 'CANTRIP':
			return 'cantrips';
		case 'CT':
			return 'combatTechniques';
		case 'C':
			return 'cultures';
		case 'DISADV':
			return 'disadvantages';
		case 'LITURGY':
			return 'liturgies';
		case 'P':
			return 'professions';
		case 'PV':
			return 'professionVariants';
		case 'R':
			return 'races';
		case 'SA':
			return 'specialAbilities';
		case 'SPELL':
			return 'spells';
		case 'TAL':
			return 'talents';
		default:
			return;
	}
}

export function getWikiStateKeyById(id: string): keyof WikiState | undefined {
	const categoryTag = id.split(/_/)[0];
	switch (categoryTag) {
		case 'ADV':
			return 'advantages';
		case 'ATTR':
			return 'attributes';
		case 'BLESSING':
			return 'blessings';
		case 'CANTRIP':
			return 'cantrips';
		case 'CT':
			return 'combatTechniques';
		case 'C':
			return 'cultures';
		case 'DISADV':
			return 'disadvantages';
		case 'LITURGY':
			return 'liturgicalChants';
		case 'P':
			return 'professions';
		case 'PV':
			return 'professionVariants';
		case 'R':
			return 'races';
		case 'SA':
			return 'specialAbilities';
		case 'SPELL':
			return 'spells';
		case 'TAL':
			return 'skills';
		default:
			return;
	}
}

interface StateKeyByCategory {
	'ADVANTAGES': 'advantages';
	'ATTRIBUTES': 'attributes';
	'BLESSINGS': 'blessings';
	'CANTRIPS': 'cantrips';
	'COMBAT_TECHNIQUES': 'combatTechniques';
	'CULTURES': 'cultures';
	'DISADVANTAGES': 'disadvantages';
	'LITURGIES': 'liturgies';
	'PROFESSIONS': 'professions';
	'PROFESSION_VARIANTS': 'professionVariants';
	'RACES': 'races';
	'RACE_VARIANTS': 'raceVariants';
	'SPECIAL_ABILITIES': 'specialAbilities';
	'SPELLS': 'spells';
	'TALENTS': 'talents';
}

const stateKeyByCategory: StateKeyByCategory = {
	'ADVANTAGES': 'advantages',
	'ATTRIBUTES': 'attributes',
	'BLESSINGS': 'blessings',
	'CANTRIPS': 'cantrips',
	'COMBAT_TECHNIQUES': 'combatTechniques',
	'CULTURES': 'cultures',
	'DISADVANTAGES': 'disadvantages',
	'LITURGIES': 'liturgies',
	'PROFESSIONS': 'professions',
	'PROFESSION_VARIANTS': 'professionVariants',
	'RACES': 'races',
	'RACE_VARIANTS': 'raceVariants',
	'SPECIAL_ABILITIES': 'specialAbilities',
	'SPELLS': 'spells',
	'TALENTS': 'talents',
}

export function getStateKeyByCategory<T extends Categories.Category>(category: T): StateKeyByCategory[T] {
	return stateKeyByCategory[category];
}

interface WikiKeyByCategory {
	'ADVANTAGES': 'advantages';
	'ATTRIBUTES': 'attributes';
	'BLESSINGS': 'blessings';
	'CANTRIPS': 'cantrips';
	'COMBAT_TECHNIQUES': 'combatTechniques';
	'CULTURES': 'cultures';
	'DISADVANTAGES': 'disadvantages';
	'LITURGIES': 'liturgicalChants';
	'PROFESSIONS': 'professions';
	'PROFESSION_VARIANTS': 'professionVariants';
	'RACES': 'races';
	'RACE_VARIANTS': 'raceVariants';
	'SPECIAL_ABILITIES': 'specialAbilities';
	'SPELLS': 'spells';
	'TALENTS': 'skills';
}

const wikiKeyByCategory: WikiKeyByCategory = {
	'ADVANTAGES': 'advantages',
	'ATTRIBUTES': 'attributes',
	'BLESSINGS': 'blessings',
	'CANTRIPS': 'cantrips',
	'COMBAT_TECHNIQUES': 'combatTechniques',
	'CULTURES': 'cultures',
	'DISADVANTAGES': 'disadvantages',
	'LITURGIES': 'liturgicalChants',
	'PROFESSIONS': 'professions',
	'PROFESSION_VARIANTS': 'professionVariants',
	'RACES': 'races',
	'RACE_VARIANTS': 'raceVariants',
	'SPECIAL_ABILITIES': 'specialAbilities',
	'SPELLS': 'spells',
	'TALENTS': 'skills',
}

export function getWikiStateKeyByCategory<T extends Categories.Category>(category: T): WikiKeyByCategory[T] {
	return wikiKeyByCategory[category];
}
