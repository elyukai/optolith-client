import { ReceiveInitialDataAction } from '../actions/FileActions';
import { UndoTriggerActions } from '../actions/HistoryActions';
import { ActivateLiturgyAction, AddLiturgyPointAction, DeactivateLiturgyAction, RemoveLiturgyPointAction, SetLiturgiesSortOrderAction } from '../actions/LiturgiesActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

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

	getSortOrder() {
		return this.sortOrder;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}
}

export const LiturgiesStore = new LiturgiesStoreStatic();
