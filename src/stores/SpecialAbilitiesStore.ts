import { ReceiveInitialDataAction } from '../actions/FileActions';
import { UndoTriggerActions } from '../actions/HistoryActions';
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityAction, SetSpecialAbilitiesSortOrderAction, SetSpecialAbilityTierAction } from '../actions/SpecialAbilitiesActions';
import * as ActionTypes from '../constants/ActionTypes';

import { ListStore } from './ListStore';
import { Store } from './Store';

type Action = ActivateSpecialAbilityAction | DeactivateSpecialAbilityAction | SetSpecialAbilityTierAction | SetSpecialAbilitiesSortOrderAction | UndoTriggerActions | ReceiveInitialDataAction;

class SpecialAbilitiesStoreStatic extends Store {
	private readonly groups = ['Allgemein', 'Schicksal', 'Kampf', 'Magisch', 'Magisch (Stab)', 'Magisch (Hexe)', 'Geweiht', 'Magisch (Bann-/Schutzkreis)', 'Kampfstil (bewaffnet)', 'Kampfstil (unbewaffnet)', 'Kampf (erweitert)', 'Befehl', 'Zauberstil', 'Magisch (Erweitert)', 'Magisch (Bannschwert)', 'Magisch (Dolch)', 'Magisch (Instrument)', 'Magisch (Gewand)', 'Magisch (Kugel)', 'Magisch (Stecken)'];
	private sortOrder = 'groupname';
	readonly dispatchToken: string;

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

export const SpecialAbilitiesStore = new SpecialAbilitiesStoreStatic();
