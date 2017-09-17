import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../selectors/dependentInstancesSelectors';
import { getLocaleMessages } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { TalentInstance } from '../types/data.d';
import { alert } from '../utils/alert';
import { _translate } from '../utils/I18n';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';

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
