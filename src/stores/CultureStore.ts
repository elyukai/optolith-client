import AppDispatcher from '../dispatcher/AppDispatcher';
import { get, getAllByCategory } from './ListStore';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

const CATEGORY = Categories.CULTURES;

var _currentID = null;
var _filterText = '';
var _sortOrder = 'name';
var _showDetails = true;
var _showAll = false;

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

function _updateView(view) {
	_showAll = view;
}

class _CultureStore extends Store {

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

	areAllVisible() {
		return _showAll;
	}

}

const CultureStore = new _CultureStore();

CultureStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.type ) {

		case ActionTypes.RECEIVE_HERO:
			_updateCurrentID(payload.c);
			break;

		case ActionTypes.SELECT_RACE:
			_updateCurrentID(null);
			break;

		case ActionTypes.SELECT_CULTURE:
			_updateCurrentID(payload.cultureID);
			break;

		case ActionTypes.FILTER_CULTURES:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_CULTURES:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.CHANGE_CULTURE_VALUE_VISIBILITY:
			_updateDetails();
			break;

		case ActionTypes.CHANGE_CULTURE_VIEW:
			_updateView(payload.view);
			break;

		default:
			return true;
	}

	CultureStore.emitChange();

	return true;

});

export default CultureStore;
