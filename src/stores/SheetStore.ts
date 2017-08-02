import { ReceiveInitialDataAction } from '../actions/FileActions';
import { SwitchSheetAttributeValueVisibilityAction } from '../actions/SheetActions';
import * as ActionTypes from '../constants/ActionTypes';

import { Store } from './Store';

type Action = ReceiveInitialDataAction | SwitchSheetAttributeValueVisibilityAction;

class SheetStoreStatic extends Store {
	private checkAttributeValueVisibility: boolean;
	readonly dispatchToken: string;

	getAll() {
		return {
			checkAttributeValueVisibility: this.checkAttributeValueVisibility
		};
	}

	getAllForSkillsSheet() {
		return {
			checkAttributeValueVisibility: this.checkAttributeValueVisibility
		};
	}

	getAllForSpellsSheet() {
		return {
			checkAttributeValueVisibility: this.checkAttributeValueVisibility
		};
	}

	getForSave() {
		return {
			sheetCheckAttributeValueVisibility: this.checkAttributeValueVisibility
		};
	}
}

export const SheetStore = new SheetStoreStatic();
