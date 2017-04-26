import { ReceiveInitialDataAction } from '../actions/FileActions';
import { SwitchSheetAttributeValueVisibilityAction } from '../actions/SheetActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { Store } from './Store';

type Action = ReceiveInitialDataAction | SwitchSheetAttributeValueVisibilityAction;

class SheetStoreStatic extends Store {
	private checkAttributeValueVisibility: boolean;
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_INITIAL_DATA: {
					const {
						sheetCheckAttributeValueVisibility
					} = action.payload.config;

					this.checkAttributeValueVisibility = sheetCheckAttributeValueVisibility || false;
					break;
				}

				case ActionTypes.SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY: {
					this.checkAttributeValueVisibility = !this.checkAttributeValueVisibility;
					break;
				}

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

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
