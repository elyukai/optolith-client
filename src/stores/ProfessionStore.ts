import AppDispatcher from '../dispatcher/AppDispatcher';
import { get, getAllByCategory } from './ListStore';
import Store from './Store';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

const CATEGORY = Categories.PROFESSIONS;

var _currentID = null;
var _filterText = '';
var _sortOrder = 'name';
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

function _updateView(view) {
	_showAll = view;
}

class _ProfessionStore extends Store {

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

	areAllVisible() {
		return _showAll;
	}

}

const ProfessionStore = new _ProfessionStore();

ProfessionStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.type ) {

		case ActionTypes.RECEIVE_HERO:
			_updateCurrentID(payload.p);
			break;

		case ActionTypes.SELECT_RACE:
		case ActionTypes.SELECT_CULTURE:
			_updateCurrentID(null);
			break;

		case ActionTypes.SELECT_PROFESSION:
			_updateCurrentID(payload.professionID);
			break;

		case ActionTypes.FILTER_PROFESSIONS:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_PROFESSIONS:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.CHANGE_PROFESSION_VIEW:
			_updateView(payload.view);
			break;

		default:
			return true;
	}

	ProfessionStore.emitChange();

	return true;

});

export default ProfessionStore;
