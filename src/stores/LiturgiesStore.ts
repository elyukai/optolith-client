import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ELStore from './ELStore';
import { getAllByCategory } from './ListStore';
import PhaseStore from './PhaseStore';
import Store from './Store';

type Action = ActivateLiturgyAction | DeactivateLiturgyAction | AddLiturgyPointAction | RemoveLiturgyPointAction | SetLiturgiesSortOrderAction | UndoTriggerActions;

class LiturgiesStoreStatic extends Store {
	private readonly category: LITURGIES = Categories.LITURGIES;
	private sortOrder = 'name';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			if (action.undo) {
				switch (action.type) {
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
				switch (action.type) {
					case ActionTypes.ACTIVATE_LITURGY:
					case ActionTypes.DEACTIVATE_LITURGY:
					case ActionTypes.ADD_LITURGY_POINT:
					case ActionTypes.REMOVE_LITURGY_POINT:
						break;

					case ActionTypes.SET_LITURGIES_SORT_ORDER:
						this.updateSortOrder(action.payload.sortOrder);
						break;

					default:
						return true;
				}
			}
			this.emitChange();
			return true;
		});
	}

	getAll() {
		return getAllByCategory(this.category) as LiturgyInstance[];
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
		return this.getAll().filter(e => e.value >= 10).reduce((a, b) => {
			if (!a.has(b.aspects)) {
				a.set(b.aspects, 1);
			} else {
				a.set(b.aspects, a.get(b.aspects) + 1);
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
		return this.sortOrder;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}
}

const LiturgiesStore = new LiturgiesStoreStatic();

export default LiturgiesStore;
