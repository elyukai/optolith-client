import { getAllByCategory } from './ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import Store from './Store';

type Action = AddTalentPointAction | RemoveTalentPointAction | SetTalentsSortOrderAction | SwitchTalentRatingVisibilityAction;

const CATEGORY = Categories.TALENTS;

let _sortOrder = 'group';
let _ratingVisible = true;

function _updateSortOrder(option: string) {
	_sortOrder = option;
}

function _updateRatingVisibility() {
	_ratingVisible = !_ratingVisible;
}

class TalentsStoreStatic extends Store {

	getAll() {
		return getAllByCategory(CATEGORY) as TalentInstance[];
	}

	getForSave() {
		const active: { [id: string]: number } = {};
		this.getAll().forEach(e => {
			const { id, value } = e;
			if (value > 0) {
				active[id] = value;
			}
		});
		return { active, ratingVisible: _ratingVisible };
	}

	getSortOrder() {
		return _sortOrder;
	}

	isRatingVisible() {
		return _ratingVisible;
	}

}

const TalentsStore = new TalentsStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.REMOVE_TALENT_POINT:
			break;

		case ActionTypes.SET_TALENTS_SORT_ORDER:
			_updateSortOrder(action.payload.sortOrder);
			break;

		case ActionTypes.SWITCH_TALENT_RATING_VISIBILITY:
			_updateRatingVisibility();
			break;

		default:
			return true;
	}

	TalentsStore.emitChange();
	return true;
});

export default TalentsStore;
