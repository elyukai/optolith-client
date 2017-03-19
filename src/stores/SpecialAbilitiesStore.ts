import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';

type Action = ActivateSpecialAbilityAction | DeactivateSpecialAbilityAction | SetSpecialAbilityTierAction | SetSpecialAbilitiesSortOrderAction | UndoTriggerActions;

class SpecialAbilitiesStoreStatic extends Store {
	private readonly groups = ['Allgemein', 'Schicksal', 'Kampf', 'Magisch', 'Magisch (Stabzauber)', 'Magisch (Hexe)', 'Geweiht', 'Magisch (Bann-/Schutzkreis)', 'Kampfstil (bewaffnet)', 'Kampfstil (unbewaffnet)', 'Kampf (erweitert)', 'Befehl'];
	private sortOrder = 'group';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			if (action.undo) {
				switch (action.type) {
					case ActionTypes.ACTIVATE_SPECIALABILITY:
					case ActionTypes.DEACTIVATE_SPECIALABILITY:
					case ActionTypes.SET_SPECIALABILITY_TIER:
						break;

					default:
						return true;
				}
			}
			else {
				switch (action.type) {
					case ActionTypes.SET_SPECIALABILITIES_SORT_ORDER:
						this.updateSortOrder(action.payload.sortOrder);
						break;

					case ActionTypes.ACTIVATE_SPECIALABILITY:
					case ActionTypes.DEACTIVATE_SPECIALABILITY:
					case ActionTypes.SET_SPECIALABILITY_TIER:
						break;

					default:
						return true;
				}
			}
			this.emitChange();
			return true;
		});
	}

	getGroupNames() {
		return this.groups;
	}

	getSortOrder() {
		return this.sortOrder;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}
}

const SpecialAbilitiesStore = new SpecialAbilitiesStoreStatic();

export default SpecialAbilitiesStore;
