import { get, getAllByCategory } from './ListStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import Store from './Store';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

type Action = ReceiveHeroDataAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SetProfessionsSortOrderAction | SetProfessionsVisibilityFilterAction;

const CATEGORY = Categories.PROFESSIONS;

let _currentId: string | null = null;
let _sortOrder = 'name';
let _showAll = 'common';

function _updateCurrentID(id: string | null) {
	_currentId = id;
}

function _updateSortOrder(option: string) {
	_sortOrder = option;
}

function _updateView(view: string) {
	_showAll = view;
}

class ProfessionStoreStatic extends Store {

	getAll() {
		return getAllByCategory(CATEGORY) as ProfessionInstance[];
	}

	getCurrentId() {
		return _currentId;
	}

	getCurrent() {
		return _currentId !== null ? get(_currentId) as ProfessionInstance : {} as ProfessionInstance;
	}

	getCurrentName() {
		return this.getCurrent() ? this.getCurrent().name : null;
	}

	getSortOrder() {
		return _sortOrder;
	}

	areAllVisible() {
		return _showAll;
	}

}

const ProfessionStore = new ProfessionStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.RECEIVE_HERO_DATA:
			_updateCurrentID(action.payload.data.p);
			break;

		case ActionTypes.SELECT_RACE:
		case ActionTypes.SELECT_CULTURE:
			_updateCurrentID(null);
			break;

		case ActionTypes.SELECT_PROFESSION:
			AppDispatcher.waitFor([APStore.dispatchToken]);
			_updateCurrentID(action.payload.id);
			break;

		case ActionTypes.SET_PROFESSIONS_SORT_ORDER:
			_updateSortOrder(action.payload.sortOrder);
			break;

		case ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER:
			_updateView(action.payload.filter);
			break;

		default:
			return true;
	}

	ProfessionStore.emitChange();

	return true;

});

export default ProfessionStore;
