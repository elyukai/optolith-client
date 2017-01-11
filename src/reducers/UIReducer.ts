import * as ActionTypes from '../constants/ActionTypes';

export interface UIState {
	herolistVisibilityFilter: string ;
	herolistSortOrder: string;
	racesSortOrder: string;
	raceValueVisibility: boolean;
	culturesSortOrder: string;
	culturesVisibilityFilter: string;
	cultureValueVisibility: boolean;
	professionsSortOrder: string;
	professionsVisibilityFilter: string;
	disadvRatingVisibility: boolean;
	talentsSortOrder: string;
	talentRatingVisibility: boolean;
	combattechniquesSortOrder: string;
	spellsSortOrder: string;
	liturgiesSortOrder: string;
	specialAbilitiesSortOrder: string;
	itemsSortOrder: string;
}

const initialState: UIState = {
	herolistVisibilityFilter: 'all',
	herolistSortOrder: 'name',
	racesSortOrder: 'name',
	raceValueVisibility: true,
	culturesSortOrder: 'name',
	culturesVisibilityFilter: 'all',
	cultureValueVisibility: true,
	professionsSortOrder: 'name',
	professionsVisibilityFilter: 'all',
	disadvRatingVisibility: true,
	talentsSortOrder: 'group',
	talentRatingVisibility: true,
	combattechniquesSortOrder: 'name',
	spellsSortOrder: 'name',
	liturgiesSortOrder: 'name',
	specialAbilitiesSortOrder: 'name',
	itemsSortOrder: 'name'
}

export default (state: UIState = initialState, action: any): UIState => {
	switch (action.type) {
		case ActionTypes.SET_HEROLIST_VISIBILITY_FILTER:
			return { ...state, herolistVisibilityFilter: action.payload.filter };

		case ActionTypes.SET_HEROLIST_SORT_ORDER:
			return { ...state, herolistSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_RACES_SORT_ORDER:
			return { ...state, racesSortOrder: action.payload.sortOrder };

		case ActionTypes.SWITCH_RACE_VALUE_VISIBILITY:
			return { ...state, raceValueVisibility: !state.raceValueVisibility };

		case ActionTypes.SET_CULTURES_SORT_ORDER:
			return { ...state, culturesSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_CULTURES_VISIBILITY_FILTER:
			return { ...state, culturesVisibilityFilter: action.payload.filter };

		case ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY:
			return { ...state, cultureValueVisibility: !state.cultureValueVisibility };

		case ActionTypes.SET_PROFESSIONS_SORT_ORDER:
			return { ...state, professionsSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER:
			return { ...state, professionsVisibilityFilter: action.payload.filter };

		case ActionTypes.SWITCH_DISADV_RATING_VISIBILITY:
			return { ...state, disadvRatingVisibility: !state.disadvRatingVisibility };

		case ActionTypes.SET_TALENTS_SORT_ORDER:
			return { ...state, talentsSortOrder: action.payload.sortOrder };

		case ActionTypes.SWITCH_TALENT_RATING_VISIBILITY:
			return { ...state, talentRatingVisibility: !state.talentRatingVisibility };

		case ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER:
			return { ...state, combattechniquesSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_SPELLS_SORT_ORDER:
			return { ...state, spellsSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_LITURGIES_SORT_ORDER:
			return { ...state, liturgiesSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_SPECIALABILITIES_SORT_ORDER:
			return { ...state, specialAbilitiesSortOrder: action.payload.sortOrder };

		case ActionTypes.SET_ITEMS_SORT_ORDER:
			return { ...state, itemsSortOrder: action.payload.sortOrder };

		default:
			return state;
	}
};
