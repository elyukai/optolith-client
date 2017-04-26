import { ReceiveInitialDataAction } from '../actions/FileActions';
import { UndoTriggerActions } from '../actions/HistoryActions';
import { AddTalentPointAction, RemoveTalentPointAction, SetTalentsSortOrderAction, SwitchTalentRatingVisibilityAction } from '../actions/TalentsActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { TalentInstance } from '../types/data.d';
import { getAllByCategory, ListStore } from './ListStore';
import { Store } from './Store';

type Action = AddTalentPointAction | RemoveTalentPointAction | SetTalentsSortOrderAction | SwitchTalentRatingVisibilityAction | UndoTriggerActions | ReceiveInitialDataAction;

class TalentsStoreStatic extends Store {
	private readonly category = Categories.TALENTS;
	private sortOrder = 'group';
	private cultureRatingVisibility = true;
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			if (action.undo) {
				switch (action.type) {
					case ActionTypes.ADD_TALENT_POINT:
					case ActionTypes.REMOVE_TALENT_POINT:
						break;

					default:
						return true;
				}
			}
			else {
				switch (action.type) {
					case ActionTypes.RECEIVE_INITIAL_DATA:
						this.cultureRatingVisibility = action.payload.config.talentsCultureRatingVisibility;
						this.sortOrder = action.payload.config.talentsSortOrder;
						break;

					case ActionTypes.ADD_TALENT_POINT:
					case ActionTypes.REMOVE_TALENT_POINT:
						break;

					case ActionTypes.SET_TALENTS_SORT_ORDER:
						this.updateSortOrder(action.payload.sortOrder);
						break;

					case ActionTypes.SWITCH_TALENT_RATING_VISIBILITY:
						this.updateRatingVisibility();
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
		return getAllByCategory(this.category) as TalentInstance[];
	}

	getForSave() {
		const active: { [id: string]: number } = {};
		this.getAll().forEach(e => {
			const { id, value } = e;
			if (value > 0) {
				active[id] = value;
			}
		});
		return active;
	}

	getSortOrder() {
		return this.sortOrder;
	}

	isRatingVisible() {
		return this.cultureRatingVisibility;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private updateRatingVisibility() {
		this.cultureRatingVisibility = !this.cultureRatingVisibility;
	}
}

export const TalentsStore = new TalentsStoreStatic();
