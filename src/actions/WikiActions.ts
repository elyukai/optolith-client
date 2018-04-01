import { ActionTypes } from '../constants/ActionTypes';

export interface SetWikiFilterAction {
	type: ActionTypes.SET_WIKI_FILTER;
	payload: {
		filterText: string;
	};
}

export function setWikiFilter(filterText: string): SetWikiFilterAction {
	return {
		type: ActionTypes.SET_WIKI_FILTER,
		payload: {
			filterText
		}
	};
}

export interface SetWikiFilterAllAction {
	type: ActionTypes.SET_WIKI_FILTER_ALL;
	payload: {
		filterText: string;
	};
}

export function setWikiFilterAll(filterText: string): SetWikiFilterAllAction {
	return {
		type: ActionTypes.SET_WIKI_FILTER_ALL,
		payload: {
			filterText
		}
	};
}

export interface SetWikiCategory1Action {
	type: ActionTypes.SET_WIKI_CATEGORY_1;
	payload: {
		category: string;
	};
}

export function setWikiCategory1(category: string): SetWikiCategory1Action {
	return {
		type: ActionTypes.SET_WIKI_CATEGORY_1,
		payload: {
			category
		}
	};
}

export interface SetWikiCategory2Action {
	type: ActionTypes.SET_WIKI_CATEGORY_2;
	payload: {
		category: string;
	};
}

export function setWikiCategory2(category: string): SetWikiCategory2Action {
	return {
		type: ActionTypes.SET_WIKI_CATEGORY_2,
		payload: {
			category
		}
	};
}

export interface SetWikiProfessionsGroupAction {
	type: ActionTypes.SET_WIKI_PROFESSIONS_GROUP;
	payload: {
		group: number | undefined;
	};
}

export function setWikiProfessionsGroup(group: number | undefined): SetWikiProfessionsGroupAction {
	return {
		type: ActionTypes.SET_WIKI_PROFESSIONS_GROUP,
		payload: {
			group
		}
	};
}

export interface SetWikiSkillsGroupAction {
	type: ActionTypes.SET_WIKI_SKILLS_GROUP;
	payload: {
		group: number | undefined;
	};
}

export function setWikiSkillsGroup(group: number | undefined): SetWikiSkillsGroupAction {
	return {
		type: ActionTypes.SET_WIKI_SKILLS_GROUP,
		payload: {
			group
		}
	};
}

export interface SetWikiCombatTechniquesGroupAction {
	type: ActionTypes.SET_WIKI_COMBAT_TECHNIQUES_GROUP;
	payload: {
		group: number | undefined;
	};
}

export function setWikiCombatTechniquesGroup(group: number | undefined): SetWikiCombatTechniquesGroupAction {
	return {
		type: ActionTypes.SET_WIKI_COMBAT_TECHNIQUES_GROUP,
		payload: {
			group
		}
	};
}

export interface SetWikiSpecialAbilitiesGroupAction {
	type: ActionTypes.SET_WIKI_SPECIAL_ABILITIES_GROUP;
	payload: {
		group: number | undefined;
	};
}

export function setWikiSpecialAbilitiesGroup(group: number | undefined): SetWikiSpecialAbilitiesGroupAction {
	return {
		type: ActionTypes.SET_WIKI_SPECIAL_ABILITIES_GROUP,
		payload: {
			group
		}
	};
}

export interface SetWikiSpellsGroupAction {
	type: ActionTypes.SET_WIKI_SPELLS_GROUP;
	payload: {
		group: number | undefined;
	};
}

export function setWikiSpellsGroup(group: number | undefined): SetWikiSpellsGroupAction {
	return {
		type: ActionTypes.SET_WIKI_SPELLS_GROUP,
		payload: {
			group
		}
	};
}

export interface SetWikiLiturgicalChantsGroupAction {
	type: ActionTypes.SET_WIKI_LITURGICAL_CHANTS_GROUP;
	payload: {
		group: number | undefined;
	};
}

export function setWikiLiturgicalChantsGroup(group: number | undefined): SetWikiLiturgicalChantsGroupAction {
	return {
		type: ActionTypes.SET_WIKI_LITURGICAL_CHANTS_GROUP,
		payload: {
			group
		}
	};
}

export interface SetWikiItemTemplatesGroupAction {
	type: ActionTypes.SET_WIKI_ITEM_TEMPLATES_GROUP;
	payload: {
		group: number | undefined;
	};
}

export function setWikiItemTemplatesGroup(group: number | undefined): SetWikiItemTemplatesGroupAction {
	return {
		type: ActionTypes.SET_WIKI_ITEM_TEMPLATES_GROUP,
		payload: {
			group
		}
	};
}
