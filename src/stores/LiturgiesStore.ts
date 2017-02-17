import Store from './Store';
import ELStore from './ELStore';
import { get, getAllByCategory } from './ListStore';
import PhaseStore from './PhaseStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

type Action = ActivateLiturgyAction | DeactivateLiturgyAction | AddLiturgyPointAction | RemoveLiturgyPointAction | SetLiturgiesSortOrderAction | UndoTriggerActions;

const CATEGORY = Categories.LITURGIES;

let _sortOrder = 'name';

function _updateSortOrder(option: string) {
	_sortOrder = option;
}

class LiturgiesStoreStatic extends Store {

	getAll() {
		return getAllByCategory(CATEGORY) as LiturgyInstance[];
	}

	getForSave() {
		const active: { [id: string]: number } = {};
		this.getAll().forEach(e => {
			const { active: a, id, value } = e;
			if (a) {
				active[id] = value;
			}
		});
		return { active };
	}

	getAspectCounter() {
		return this.getAll().filter(e => e.value >= 10).reduce((a,b) => {
			if (!a.has(b.aspect)) {
				a.set(b.aspect, 1);
			} else {
				a.set(b.aspect, a.get(b.aspect) + 1);
			}
			return a;
		}, new Map());
	}

	isActivationDisabled() {
		const maxSpellsLiturgies = ELStore.getStart().maxSpellsLiturgies;
		return PhaseStore.get() < 3 && this.getAll().filter(e => e.gr < 3 && e.active).length >= maxSpellsLiturgies;
	}

	getGroupNames() {
		return ['Liturgie', 'Zeremonie', 'Segnung'];
	}

	getAspectNames() {
		return ['Allgemein', 'Antimagie', 'Ordnung', 'Schild', 'Sturm', 'Tod', 'Traum', 'Magie', 'Wissen', 'Handel', 'Schatten', 'Heilung', 'Landwirtschaft'];
	}

	getTraditionNames() {
		return ['Allgemein', 'Gildenmagier', 'Hexen', 'Elfen'];
	}

	getSortOrder() {
		return _sortOrder;
	}

}

const LiturgiesStore = new LiturgiesStoreStatic((action: Action) => {
	if (action.undo) {
		switch(action.type) {
			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				break;

			default:
				return true;
		}
	}
	else {
		switch(action.type) {
			case ActionTypes.ACTIVATE_LITURGY:
			case ActionTypes.DEACTIVATE_LITURGY:
			case ActionTypes.ADD_LITURGY_POINT:
			case ActionTypes.REMOVE_LITURGY_POINT:
				break;

			case ActionTypes.SET_LITURGIES_SORT_ORDER:
				_updateSortOrder(action.payload.sortOrder);
				break;

			default:
				return true;
		}
	}

	LiturgiesStore.emitChange();
	return true;
});

export default LiturgiesStore;
