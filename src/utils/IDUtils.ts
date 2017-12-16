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

export function getStateKeyByCategory(category: Categories.Category): DependentInstancesStateKeysForMaps {
	switch (category) {
		case Categories.ADVANTAGES:
			return 'advantages';
		case Categories.ATTRIBUTES:
			return 'attributes';
		case Categories.BLESSINGS:
			return 'blessings';
		case Categories.CANTRIPS:
			return 'cantrips';
		case Categories.COMBAT_TECHNIQUES:
			return 'combatTechniques';
		case Categories.CULTURES:
			return 'cultures';
		case Categories.DISADVANTAGES:
			return 'disadvantages';
		case Categories.LITURGIES:
			return 'liturgies';
		case Categories.PROFESSIONS:
			return 'professions';
		case Categories.PROFESSION_VARIANTS:
			return 'professionVariants';
		case Categories.RACES:
			return 'races';
		case Categories.RACE_VARIANTS:
			return 'raceVariants';
		case Categories.SPECIAL_ABILITIES:
			return 'specialAbilities';
		case Categories.SPELLS:
			return 'spells';
		case Categories.TALENTS:
			return 'talents';
	}
}

export function getWikiStateKeyByCategory(category: Categories.Category): keyof WikiState {
	switch (category) {
		case Categories.ADVANTAGES:
			return 'advantages';
		case Categories.ATTRIBUTES:
			return 'attributes';
		case Categories.BLESSINGS:
			return 'blessings';
		case Categories.CANTRIPS:
			return 'cantrips';
		case Categories.COMBAT_TECHNIQUES:
			return 'combatTechniques';
		case Categories.CULTURES:
			return 'cultures';
		case Categories.DISADVANTAGES:
			return 'disadvantages';
		case Categories.LITURGIES:
			return 'liturgicalChants';
		case Categories.PROFESSIONS:
			return 'professions';
		case Categories.PROFESSION_VARIANTS:
			return 'professionVariants';
		case Categories.RACES:
			return 'races';
		case Categories.RACE_VARIANTS:
			return 'raceVariants';
		case Categories.SPECIAL_ABILITIES:
			return 'specialAbilities';
		case Categories.SPELLS:
			return 'spells';
		case Categories.TALENTS:
			return 'skills';
	}
}
