import { REQUEST_HEROLIST, CREATE_HERO, SET_HEROLIST_SORT_ORDER, SET_HEROLIST_VISIBILITY_FILTER, REQUEST_HERO_DATA, REQUEST_HERO_SAVE, RECEIVE_HERO_DATA } from '../constants/ActionTypes';
import * as WebAPIUtils from '../utils/WebAPIUtils';
import AppDispatcher from '../dispatcher/AppDispatcher';
import saveHero from '../utils/saveHero';

export const requestList = () => {
	WebAPIUtils.getHeroes();
	AppDispatcher.dispatch<RequestHerolistAction>({
		type: REQUEST_HEROLIST
	});
};

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetHerolistSortOrderAction>({
	type: SET_HEROLIST_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const setVisibilityFilter = (filterOption: string) => AppDispatcher.dispatch<SetHerolistVisibilityFilterAction>({
	type: SET_HEROLIST_VISIBILITY_FILTER,
	payload: {
		filterOption
	}
});

export const requestHero = (id: string) => {
	// if (ELStore.getStartID() !== 'EL_0') {
	// 	alert(
	// 		'Nicht gespeicherter Held',
	// 		'Du hast offenbar bereits einen Helden geöffnet, der noch nicht vollständig gespeichert wurde. Möchtest du trotzdem fortfahren oder vorher den anderen Helden speichern, damit keine Änderungen verloren gehen?',
	// 		[
	// 			{
	// 				label: 'Laden',
	// 				onClick: this.loadFx.bind(null, id)
	// 			},
	// 			{
	// 				label: 'Abbrechen'
	// 			}
	// 		]
	// 	);
	// } else {
	// 	this.loadFx(id);
	// }
	AppDispatcher.dispatch<RequestHeroDataAction>({
		type: REQUEST_HERO_DATA
	});
	WebAPIUtils.requestHero(id);
};

export const insertHero = (json: string) => {
	const parsed = JSON.parse(json) as SaveData;
	const overview = parsed.overview;
	const newOverview = {
		dateCreated: new Date(overview.dateCreated),
		dateModified: new Date(overview.dateModified)
	};
	const data = { ...parsed.details, ...{ ...parsed.overview, ...newOverview } } as Hero & HeroRest;
	AppDispatcher.dispatch<ReceiveHeroDataAction>({
		type: RECEIVE_HERO_DATA,
		payload: {
			data
		}
	});
};

export const createHero = (name: string, sex: 'm' | 'f', el: string) => AppDispatcher.dispatch<CreateHeroAction>({
	type: CREATE_HERO,
	payload: {
		name,
		sex,
		el
	}
});

export const requestHeroSave = () => {
	AppDispatcher.dispatch<RequestHeroSaveAction>({
		type: REQUEST_HERO_SAVE
	});
	saveHero();
};
