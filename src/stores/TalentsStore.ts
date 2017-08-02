import { ReceiveInitialDataAction } from '../actions/FileActions';
import { UndoTriggerActions } from '../actions/HistoryActions';
import { AddTalentPointAction, RemoveTalentPointAction, SetTalentsSortOrderAction, SwitchTalentRatingVisibilityAction } from '../actions/TalentsActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

import { TalentInstance } from '../types/data.d';
import { getAllByCategory, ListStore } from './ListStore';
import { Store } from './Store';

type Action = AddTalentPointAction | RemoveTalentPointAction | SetTalentsSortOrderAction | SwitchTalentRatingVisibilityAction | UndoTriggerActions | ReceiveInitialDataAction;

class TalentsStoreStatic extends Store {
	private sortOrder = 'group';
	private cultureRatingVisibility = true;
	readonly dispatchToken: string;

	getAll() {
		return getAllByCategory(Categories.TALENTS) as TalentInstance[];
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
