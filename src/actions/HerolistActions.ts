import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import HerolistStore from '../stores/HerolistStore';
import * as FileAPIUtils from '../utils/FileAPIUtils';
import generateHeroSaveData from '../utils/generateHeroSaveData';
import * as WebAPIUtils from '../utils/WebAPIUtils';

export const requestList = () => {
	WebAPIUtils.getHeroes();
	AppDispatcher.dispatch<RequestHerolistAction>({
		type: ActionTypes.REQUEST_HEROLIST
	});
};

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetHerolistSortOrderAction>({
	type: ActionTypes.SET_HEROLIST_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const setVisibilityFilter = (filterOption: string) => AppDispatcher.dispatch<SetHerolistVisibilityFilterAction>({
	type: ActionTypes.SET_HEROLIST_VISIBILITY_FILTER,
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
		type: ActionTypes.REQUEST_HERO_DATA
	});
	WebAPIUtils.requestHero(id);
};

export const insertHero = (json: string) => {
	const parsed = JSON.parse(json) as HeroSave;
	const newParsed = {
		dateCreated: new Date(parsed.dateCreated),
		dateModified: new Date(parsed.dateModified)
	};
	const data = { ...parsed, ...newParsed } as Hero;
	AppDispatcher.dispatch<ReceiveHeroDataAction>({
		type: ActionTypes.RECEIVE_HERO_DATA,
		payload: {
			data
		}
	});
};

export const createHero = (name: string, sex: 'm' | 'f', el: string) => AppDispatcher.dispatch<CreateHeroAction>({
	type: ActionTypes.CREATE_HERO,
	payload: {
		name,
		sex,
		el
	}
});

export const loadHero = (indexId: string) => {
	AppDispatcher.dispatch<ReceiveHeroDataAction>({
		type: ActionTypes.RECEIVE_HERO_DATA,
		payload: {
			data: HerolistStore.get(indexId)
		}
	});
};

export const saveHero = (closeAfterSave?: boolean) => {
	const current = HerolistStore.getCurrent();
	const data = generateHeroSaveData();
	AppDispatcher.dispatch<SaveHeroAction>({
		type: ActionTypes.SAVE_HERO,
		payload: {
			current,
			data,
			closeAfterSave
		}
	});
};

export const deleteHero = (indexId: string) => {
	AppDispatcher.dispatch<DeleteHeroAction>({
		type: ActionTypes.DELETE_HERO,
		payload: {
			indexId
		}
	});
};

export const requestHeroSave = () => {
	AppDispatcher.dispatch<RequestHeroSaveAction>({
		type: ActionTypes.REQUEST_HERO_SAVE
	});
	WebAPIUtils.saveHero(generateHeroSaveData());
};
