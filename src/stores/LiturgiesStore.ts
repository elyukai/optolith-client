import { ReceiveInitialDataAction } from '../actions/FileActions';
import { UndoTriggerActions } from '../actions/HistoryActions';
import { ActivateLiturgyAction, AddLiturgyPointAction, DeactivateLiturgyAction, RemoveLiturgyPointAction, SetLiturgiesSortOrderAction } from '../actions/LiturgiesActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { BlessingInstance, LiturgyInstance } from '../types/data.d';
import { ELStore } from './ELStore';
import { getAllByCategory, ListStore } from './ListStore';
import { PhaseStore } from './PhaseStore';
import { Store } from './Store';

type Action = ActivateLiturgyAction | DeactivateLiturgyAction | AddLiturgyPointAction | RemoveLiturgyPointAction | SetLiturgiesSortOrderAction | UndoTriggerActions | ReceiveInitialDataAction;

class LiturgiesStoreStatic extends Store {
	private readonly category = Categories.LITURGIES;
	private sortOrder = 'name';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			if (action.undo) {
				switch (action.type) {
					case ActionTypes.ACTIVATE_LITURGY:
					case ActionTypes.DEACTIVATE_LITURGY:
					case ActionTypes.ADD_LITURGY_POINT:
					case ActionTypes.REMOVE_LITURGY_POINT:
						break;

					default:
						return true;
				}
			}
			else {
				switch (action.type) {
					case ActionTypes.RECEIVE_INITIAL_DATA:
						this.updateSortOrder(action.payload.config.liturgiesSortOrder);
						break;

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

	getAllBlessings() {
		return getAllByCategory(Categories.BLESSINGS) as BlessingInstance[];
	}

	getForSave() {
		const list: { [id: string]: number } = {};
		this.getAll().forEach(e => {
			const { active, id, value } = e;
			if (active) {
				list[id] = value;
			}
		});
		return list;
	}

	getBlessingsForSave() {
		const list: string[] = [];
		this.getAllBlessings().forEach(e => {
			const { active, id } = e;
			if (active) {
				list.push(id);
			}
		});
		return list;
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

	getSortOrder() {
		return this.sortOrder;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}
}

export const LiturgiesStore = new LiturgiesStoreStatic();
