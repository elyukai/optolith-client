import AppDispatcher from '../dispatcher/AppDispatcher';
import * as ActionTypes from '../constants/ActionTypes';
import createOverlay from '../utils/createOverlay';
import ELStore from '../stores/ELStore';
import HeroCreation from '../views/herolist/HeroCreation';
import React from 'react';
import alert from '../utils/alert';
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

export interface SortHerolistAction {
	type: ActionTypes.SORT_HEROLIST;
	payload: {
		sortOrder: string;
	};
}

export const sort = (sortOrder: string): SortHerolistAction => ({
	type: ActionTypes.SORT_HEROLIST,
	payload: {
		sortOrder
	}
});

export interface FilterHerolistAction {
	type: ActionTypes.FILTER_HEROLIST;
	payload: {
		filterOption: string;
	};
}

export const filter = (filterOption: string): FilterHerolistAction => ({
	type: ActionTypes.FILTER_HEROLIST,
	payload: {
		filterOption
	}
});

export interface ReceiveHerolistAction {
	type: ActionTypes.RECEIVE_HEROLIST;
	payload: {
		heroes: RawHerolist;
	};
}

export const receive = (heroes: RawHerolist): ReceiveHerolistAction => ({
	type: ActionTypes.RECEIVE_HEROLIST,
	payload: {
		heroes
	}
});

export default {
	refresh(): void {
		WebAPIUtils.getHeroes();
	},
	filter(text: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_HEROLIST,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.SORT_HEROLIST,
			option
		});
	},
	changeView(view: string): void {
		AppDispatcher.dispatch({
			type: 'CHANGE_HEROLIST_VIEW',
			view
		});
	},
	load(id: string): void {
		if (ELStore.getStartID() !== 'EL_0') {
			alert(
				'Nicht gespeicherter Held',
				'Du hast offenbar bereits einen Helden geöffnet, der noch nicht vollständig gespeichert wurde. Möchtest du trotzdem fortfahren oder vorher den anderen Helden speichern, damit keine Änderungen verloren gehen?',
				[
					{
						label: 'Laden',
						onClick: this.loadFx.bind(null, id)
					},
					{
						label: 'Abbrechen'
					}
				]
			);
		} else {
			this.loadFx(id);
		}
	},
	loadFx(id: string): void {
		AppDispatcher.dispatch({
			type: 'CLEAR_HERO'
		});
		WebAPIUtils.loadHero(id);
	},
	createNewHero(options: Object): void {
		AppDispatcher.dispatch({
			type: 'CREATE_NEW_HERO',
			...options
		});
	},
	save(): void {

	}
};
