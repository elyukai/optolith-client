import AppDispatcher from '../dispatcher/AppDispatcher';
import { get, getAllByCategory } from './ListStore';
import APStore from '../stores/APStore';
import Store from './Store';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

type Action = SelectRaceAction | ReceiveHeroDataAction | SetRacesSortOrderAction | SwitchRaceValueVisibilityAction;

const CATEGORY = Categories.RACES;

let _currentId: string | null = null;
let _filterText = '';
let _sortOrder = 'name';
let _showDetails = true;

function _updateCurrentID(id) {
	_currentId = id;
}

function _updateFilterText(text) {
	_filterText = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

function _updateDetails() {
	_showDetails = !_showDetails;
}

class RaceStoreStatic extends Store {

	getAll() {
		return getAllByCategory(CATEGORY);
	}

	getCurrentID() {
		return _currentId;
	}

	getCurrent() {
		return _currentId !== null ? get(_currentId) as Race : {} as Race;
	}

	getCurrentName() {
		return this.getCurrent() ? this.getCurrent().name : null;
	}

	getNameByID(id) {
		return get(id) ? get(id).name : null;
	}

	getFilter() {
		return _filterText;
	}

	getSortOrder() {
		return _sortOrder;
	}

	areValuesVisible() {
		return _showDetails;
	}

}

const RaceStore = new RaceStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.RECEIVE_HERO_DATA:
			_updateCurrentID(action.payload.data.r);
			break;

		case ActionTypes.SELECT_RACE:
			AppDispatcher.waitFor([APStore.dispatchToken]);
			_updateCurrentID(action.payload.id);
			break;

		case ActionTypes.SET_RACES_SORT_ORDER:
			_updateSortOrder(action.payload.sortOrder);
			break;

		case ActionTypes.SWITCH_RACE_VALUE_VISIBILITY:
			_updateDetails();
			break;

		default:
			return true;
	}

	RaceStore.emitChange();
	return true;
});

export default RaceStore;
