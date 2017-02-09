import AppDispatcher from '../dispatcher/AppDispatcher';
import { get, getAllByCategory } from './ListStore';
import APStore from '../stores/APStore';
import Store from './Store';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

type Action = ReceiveHeroDataAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction;

const CATEGORY = Categories.PROFESSION_VARIANTS;

let _currentId: string | null = null;

function _updateCurrentID(id: string | null) {
	_currentId = id;
}

class ProfessionVariantStoreStatic extends Store {

	getAll() {
		return getAllByCategory(CATEGORY) as ProfessionVariantInstance[];
	}

	getCurrentID() {
		return _currentId;
	}

	getCurrent() {
		return _currentId !== null ? get(_currentId) as ProfessionVariantInstance : {} as ProfessionVariantInstance;
	}

	getCurrentName() {
		return this.getCurrent() !== undefined ? this.getCurrent().name : null;
	}

	getNameByID(id: string) {
		return get(id) !== undefined ? get(id).name : null;
	}

}

const ProfessionVariantStore = new ProfessionVariantStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.RECEIVE_HERO_DATA:
			_updateCurrentID(action.payload.data.pv);
			break;

		case ActionTypes.SELECT_RACE:
		case ActionTypes.SELECT_CULTURE:
		case ActionTypes.SELECT_PROFESSION:
			_updateCurrentID(null);
			break;

		case ActionTypes.SELECT_PROFESSION_VARIANT:
			AppDispatcher.waitFor([APStore.dispatchToken]);
			_updateCurrentID(action.payload.id);
			break;

		default:
			return true;
	}

	ProfessionVariantStore.emitChange();
	return true;
});

export default ProfessionVariantStore;
