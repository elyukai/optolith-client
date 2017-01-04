import AppDispatcher from '../dispatcher/AppDispatcher';
import * as ActionTypes from '../constants/ActionTypes';
import createOverlay from '../utils/createOverlay';
import ELStore from '../stores/ELStore';
import HeroCreation from '../views/herolist/HeroCreation';
import React from 'react';
import alert from '../utils/alert';
import WebAPIUtils from '../utils/WebAPIUtils';

export const refresh = () => WebAPIUtils.getHeroes();

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
