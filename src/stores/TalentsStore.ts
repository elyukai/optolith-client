import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { default as ListStore, getAllByCategory } from './ListStore';
import Store from './Store';

type Action = AddTalentPointAction | RemoveTalentPointAction | SetTalentsSortOrderAction | SwitchTalentRatingVisibilityAction | UndoTriggerActions;

class TalentsStoreStatic extends Store {
	private readonly category: TALENTS = Categories.TALENTS;
	private sortOrder = 'group';
	private ratingVisible = true;
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
		return this.ratingVisible;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private updateRatingVisibility() {
		this.ratingVisible = !this.ratingVisible;
	}
}

const TalentsStore = new TalentsStoreStatic();

export default TalentsStore;
