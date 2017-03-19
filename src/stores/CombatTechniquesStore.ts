import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { get, getAllByCategory } from './ListStore';
import Store from './Store';

type Action = AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | SetCombatTechniquesSortOrderAction | UndoTriggerActions;

class CombatTechniquesStoreStatic extends Store {
	private readonly category: COMBAT_TECHNIQUES = Categories.COMBAT_TECHNIQUES;
	private sortOrder = 'name';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			if (action.undo) {
				switch (action.type) {
					case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
					case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
						break;

					default:
						return true;
				}
			}
			else {
				switch (action.type) {
					case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
					case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
						break;

					case ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER:
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
		return getAllByCategory(this.category) as CombatTechniqueInstance[];
	}

	getAllForSave() {
		const active: { [id: string]: number } = {};
		this.getAll().forEach(e => {
			const { id, value } = e;
			if (value > 6) {
				active[id] = value;
			}
		});
		return { active };
	}

	getMaxPrimaryAttributeValueByID(array: string[]) {
		return array.map(attr => (get(attr) as AttributeInstance).value).reduce((a, b) => Math.max(a, b), 0);
	}

	getPrimaryAttributeMod(array: string[]) {
		return Math.max(Math.floor((this.getMaxPrimaryAttributeValueByID(array) - 8) / 3), 0);
	}

	getSortOrder() {
		return this.sortOrder;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}
}

const CombatTechniquesStore = new CombatTechniquesStoreStatic();

export default CombatTechniquesStore;
