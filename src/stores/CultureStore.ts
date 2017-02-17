import { get, getAllByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import Store from './Store';

type Action = ReceiveHeroDataAction | SelectRaceAction | SelectCultureAction | SetCulturesSortOrderAction | SetCulturesVisibilityFilterAction | SwitchCultureValueVisibilityAction;

const CATEGORY = Categories.CULTURES;

let _currentId: string | null = null;
let _sortOrder = 'name';
let _areValuesVisible = true;
let _visibilityFilter = 'common';

function _updateCurrentID(id: string | null = null) {
	_currentId = id;
}

function _updateSortOrder(sortOrder: string) {
	_sortOrder = sortOrder;
}

function _updateValuevisibility() {
	_areValuesVisible = !_areValuesVisible;
}

function _updateVisibilityFilter(filter: string) {
	_visibilityFilter = filter;
}

class CultureStoreStatic extends Store {

	getAll() {
		return getAllByCategory(CATEGORY) as CultureInstance[];
	}

	getCurrentID() {
		return _currentId;
	}

	getCurrent() {
		return _currentId !== null ? get(_currentId) as CultureInstance : {} as CultureInstance;
	}

	getCurrentName() {
		return this.getCurrent() ? this.getCurrent().name : null;
	}

	getSortOrder() {
		return _sortOrder;
	}

	areValuesVisible() {
		return _areValuesVisible;
	}

	areAllVisible() {
		return _visibilityFilter;
	}

}

const CultureStore = new CultureStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.RECEIVE_HERO_DATA:
			_updateCurrentID(action.payload.data.c);
			break;

		case ActionTypes.SELECT_RACE:
			_updateCurrentID(null);
			break;

		case ActionTypes.SELECT_CULTURE:
			AppDispatcher.waitFor([APStore.dispatchToken]);
			_updateCurrentID(action.payload.id);
			break;

		case ActionTypes.SET_CULTURES_SORT_ORDER:
			_updateSortOrder(action.payload.sortOrder);
			break;

		case ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY:
			_updateValuevisibility();
			break;

		case ActionTypes.SET_CULTURES_VISIBILITY_FILTER:
			_updateVisibilityFilter(action.payload.filter);
			break;

		default:
			return true;
	}

	CultureStore.emitChange();
	return true;
});

export default CultureStore;
