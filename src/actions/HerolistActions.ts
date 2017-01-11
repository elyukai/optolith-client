import { RECEIVE_HEROLIST, SET_HEROLIST_SORT_ORDER, SET_HEROLIST_VISIBILITY_FILTER } from '../constants/ActionTypes';
import WebAPIUtils from '../utils/WebAPIUtils';

interface RawHero {
	readonly clientVersion: string;
	readonly dateCreated: Date;
	readonly dateModified: Date;
	readonly player?: {
		readonly id: string;
		readonly displayName: string;
	};
	readonly id: string;
	readonly phase: number;
	readonly name: string;
	readonly avatar: string;
	readonly ap: {
		readonly total: number;
		readonly spent: number;
		readonly adv: [number, number, number];
		readonly disadv: [number, number, number];
	};
	readonly el: string;
	readonly r: string;
	readonly c: string;
	readonly p: string;
	readonly pv: string | null;
	readonly sex: string;
}

export interface RawHerolist {
	[id: string]: RawHero;
}

export const request = () => WebAPIUtils.getHeroes();

export interface SetHerolistSortOrderAction {
	type: SET_HEROLIST_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setHerolistSortOrder = (sortOrder: string): SetHerolistSortOrderAction => ({
	type: SET_HEROLIST_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export interface SetHerolistVisibilityFilterAction {
	type: SET_HEROLIST_VISIBILITY_FILTER;
	payload: {
		filterOption: string;
	};
}

export const setHerolistVisibilityFilter = (filterOption: string): SetHerolistVisibilityFilterAction => ({
	type: SET_HEROLIST_VISIBILITY_FILTER,
	payload: {
		filterOption
	}
});

export interface ReceiveHerolistAction {
	type: RECEIVE_HEROLIST;
	payload: {
		heroes: RawHerolist;
	};
}

export const receiveHerolist = (heroes: RawHerolist): ReceiveHerolistAction => ({
	type: RECEIVE_HEROLIST,
	payload: {
		heroes
	}
});
