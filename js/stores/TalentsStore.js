import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ELStore from './ELStore';
import { get, getAllByCategory, getObjByCategory } from './ListStore';
import PhaseStore from './PhaseStore';
import ActionTypes from '../constants/ActionTypes';
import Categories from '../constants/Categories';

const CATEGORY = Categories.TALENTS;

var _filter = '';
var _sortOrder = 'group';
var _talentRating = true;

function _updateFilterText(text) {
	_filter = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

function _updateTalentRating() {
	_talentRating = !_talentRating;
}
	
class _TalentsStore extends Store {

	getForSave() {
		var all = getAllByCategory(CATEGORY);
		var result = new Map();
		all.forEach(e => {
			let { id, fw } = e;
			if (fw > 0) {
				result.set(id, fw);
			}
		});
		return {
			active: Array.from(result),
			_talentRating
		};
	}

	get(id) {
		return get(id);
	}

	getNameByID(id) {
		return get(id).name;
	}

	getAll() {
		return getAllByCategory(CATEGORY);
	}

	getAllForView() {
		var phase = PhaseStore.get();

		var talentsObj = getObjByCategory(CATEGORY);
		var talents = [];

		var SA_18 = this.get('SA_18').active;
		var SA_18_REQ = SA_18 && (talentsObj['TAL_51'].value + talentsObj['TAL_55'].value) < 12;

		for (let id in talentsObj) {
			let talent = talentsObj[id];
			let { fw, check, dependencies } = talent;

			var _max = 25;
			let _max_bonus = get('ADV_16').active.filter(e => e === id).length;
			if (phase < 3)
				_max = ELStore.getStart().max_skill + _max_bonus;
			else {
				let checkValues = check.map(attr => get(attr).value);
				_max = Math.max(...checkValues) + 2 + _max_bonus;
			}
			talent.disabledIncrease = fw >= _max;

			talent.disabledDecrease = (['TAL_51','TAL_55'].indexOf(id) > -1 && SA_18_REQ) || fw <= Math.max(0, ...dependencies);

			talents.push(talent);
		}
		if (_filter !== '') {
			let filter = _filter.toLowerCase();
			talents = talents.filter(obj => obj.name.toLowerCase().match(filter));
		}
		if (_sortOrder == 'name') {
			talents.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			});
		} else if (_sortOrder == 'groups') {
			talents.sort((a, b) => {
				if (a.gr < b.gr) {
					return -1;
				} else if (a.gr > b.gr) {
					return 1;
				} else {
					if (a.name < b.name) {
						return -1;
					} else if (a.name > b.name) {
						return 1;
					} else {
						return 0;
					}
				}
			});
		}
		return talents;
	}

	getFilter() {
		return _filter;
	}

	getSortOrder() {
		return _sortOrder;
	}

	getTalentRating() {
		return _talentRating;
	}

}

const TalentsStore = new _TalentsStore();

TalentsStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.actionType ) {

		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.REMOVE_TALENT_POINT:
			break;

		case ActionTypes.FILTER_TALENTS:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_TALENTS:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.CHANGE_TALENT_RATING:
			_updateTalentRating();
			break;
		
		default:
			return true;
	}
	
	TalentsStore.emitChange();

	return true;

});

export default TalentsStore;
