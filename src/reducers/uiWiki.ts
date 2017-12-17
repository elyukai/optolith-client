import { SetTabAction } from '../actions/LocationActions';
import { SetWikiCategory1Action, SetWikiCategory2Action, SetWikiFilterAction, SetWikiFilterAllAction} from '../actions/WikiActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = SetTabAction | SetWikiCategory1Action | SetWikiCategory2Action | SetWikiFilterAction | SetWikiFilterAllAction;

export interface UIWikiState {
	filter: string;
	filterAll: string;
	category1?: string;
	category2?: string;
}

const initialState: UIWikiState = {
	filter: '',
	filterAll: ''
};

export function uiWiki(state: UIWikiState = initialState, action: Action): UIWikiState {
	switch (action.type) {
		case ActionTypes.SET_WIKI_CATEGORY_1:
			return {
				...state,
				category1: action.payload.category,
				category2: undefined,
				filter: ''
			};

		case ActionTypes.SET_WIKI_CATEGORY_2:
			return {
				...state,
				category2: action.payload.category
			};

		case ActionTypes.SET_WIKI_FILTER:
			return {
				...state,
				filter: action.payload.filterText
			};

		case ActionTypes.SET_WIKI_FILTER_ALL:
			return {
				...state,
				filterAll: action.payload.filterText
			};

		default:
			return state;
	}
}
