import { ASSIGN_RCP_OPTIONS, SELECT_PROFESSION, SET_PROFESSIONS_SORT_ORDER, SET_PROFESSIONS_VISIBILITY_FILTER } from '../constants/ActionTypes';

export interface SelectProfessionAction {
	type: SELECT_PROFESSION;
	payload: {
		id: string;
	};
}

export const selectProfession = (id: string): SelectProfessionAction => ({
	type: SELECT_PROFESSION,
	payload: {
		id
	}
});

interface Selections {
	attrSel: string;
	useCulturePackage: boolean;
	lang: number;
	buyLiteracy: boolean;
	litc: number;
	cantrips: Set<string>;
	combattech: Set<string>;
	curses: Map<string, number>;
	langLitc: Map<string, number>;
	spec: [number | null, string];
}

export interface SetSelectionsAction {
	type: ASSIGN_RCP_OPTIONS;
	payload: Selections;
}

export const setSelections = (selections: Selections): SetSelectionsAction => ({
	type: ASSIGN_RCP_OPTIONS,
	payload: selections
});

export interface SetProfessionsSortOrderAction {
	type: SET_PROFESSIONS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setProfessionsSortOrder = (sortOrder: string): SetProfessionsSortOrderAction => ({
	type: SET_PROFESSIONS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export interface SetProfessionsVisibilityFilterAction {
	type: SET_PROFESSIONS_VISIBILITY_FILTER;
	payload: {
		filter: string;
	};
}

export const setProfessionsVisibilityFilter = (filter: string): SetProfessionsVisibilityFilterAction => ({
	type: SET_PROFESSIONS_VISIBILITY_FILTER,
	payload: {
		filter
	}
});
