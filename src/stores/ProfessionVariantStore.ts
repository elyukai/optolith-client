import AppDispatcher from '../dispatcher/AppDispatcher';
import { get, getAllByCategory } from './ListStore';
import Store from './Store';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

const CATEGORY = Categories.PROFESSION_VARIANTS;

var _currentID = null;

function _updateCurrentID(id) {
	_currentID = id;
}

class _ProfessionVariantStore extends Store {

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
		return this.get(this.getCurrentID());
	}

	getCurrentName() {
		return this.getCurrent() !== undefined ? this.getCurrent().name : null;
	}

	getNameByID(id) {
		return this.get(id) !== undefined ? this.get(id).name : null;
	}

}

const ProfessionVariantStore = new _ProfessionVariantStore();

ProfessionVariantStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.type ) {

		case ActionTypes.RECEIVE_HERO:
			_updateCurrentID(payload.pv);
			break;

		case ActionTypes.SELECT_RACE:
		case ActionTypes.SELECT_CULTURE:
		case ActionTypes.SELECT_PROFESSION:
			_updateCurrentID(null);
			break;

		case ActionTypes.SELECT_PROFESSION_VARIANT:
			_updateCurrentID(payload.professionVariantID);
			break;

		default:
			return true;
	}

	ProfessionVariantStore.emitChange();

	return true;

});

export default ProfessionVariantStore;
