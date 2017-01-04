import AppDispatcher from '../dispatcher/AppDispatcher';
import { get, getAllByCategory } from './ListStore';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

const CATEGORY = Categories.RACES;

var _currentID = null;
var _filterText = '';
var _sortOrder = 'name';
var _showDetails = true;

function _updateCurrentID(id) {
	_currentID = id;
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

class _RaceStore extends Store {

	get(id) {
		return get(id);
	}

	getAll() {
		return getAllByCategory(CATEGORY);
	}

	getCurrentID() {
		return _currentID;
	}

	getCurrent() {
		return get(this.getCurrentID());
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

const RaceStore = new _RaceStore();

RaceStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.type ) {

		case ActionTypes.RECEIVE_HERO:
			_updateCurrentID(payload.r);
			break;

		case ActionTypes.SELECT_RACE:
			_updateCurrentID(payload.raceID);
			break;

		case ActionTypes.FILTER_RACES:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_RACES:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.CHANGE_RACE_VALUE_VISIBILITY:
			_updateDetails();
			break;

		default:
			return true;
	}

	RaceStore.emitChange();

	return true;

});

export default RaceStore;
