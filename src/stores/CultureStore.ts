import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import { get, getAllByCategory } from './ListStore';
import Store from './Store';

type Action = ReceiveHeroDataAction | SelectRaceAction | SelectCultureAction | SetCulturesSortOrderAction | SetCulturesVisibilityFilterAction | SwitchCultureValueVisibilityAction | ReceiveInitialDataAction | CreateHeroAction;

class CultureStoreStatic extends Store {
	private readonly category: CULTURES = Categories.CULTURES;
	private currentId: string | null = null;
	private sortOrder = 'name';
	private valueVisibility = true;
	private visibilityFilter = 'common';
	readonly dispatchToken: string;
	readonly socialstatus = [ 'Unfrei', 'Frei', 'Niederadel', 'Adel', 'Hochadel' ];

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_INITIAL_DATA:
					this.sortOrder = action.payload.config.culturesSortOrder;
					this.valueVisibility = action.payload.config.culturesValueVisibility;
					this.visibilityFilter = action.payload.config.culturesVisibilityFilter;
					break;

				case ActionTypes.RECEIVE_HERO_DATA:
					this.updateCurrentID(action.payload.data.c);
					break;

				case ActionTypes.CREATE_HERO:
				case ActionTypes.SELECT_RACE:
					this.updateCurrentID(null);
					break;

				case ActionTypes.SELECT_CULTURE:
					AppDispatcher.waitFor([APStore.dispatchToken]);
					this.updateCurrentID(action.payload.id);
					break;

				case ActionTypes.SET_CULTURES_SORT_ORDER:
					this.updateSortOrder(action.payload.sortOrder);
					break;

				case ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY:
					this.updateValueVisibility();
					break;

				case ActionTypes.SET_CULTURES_VISIBILITY_FILTER:
					this.updateVisibilityFilter(action.payload.filter);
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	getAll() {
		return getAllByCategory(this.category) as CultureInstance[];
	}

	getCurrentID() {
		return this.currentId;
	}

	getCurrent() {
		return this.currentId !== null ? get(this.currentId) as CultureInstance : undefined;
	}

	getCurrentName() {
		const current = this.getCurrent();
		return current ? current.name : undefined;
	}

	getSortOrder() {
		return this.sortOrder;
	}

	areValuesVisible() {
		return this.valueVisibility;
	}

	areAllVisible() {
		return this.visibilityFilter;
	}

	private updateCurrentID(id: string | null = null) {
		this.currentId = id;
	}

	private updateSortOrder(sortOrder: string) {
		this.sortOrder = sortOrder;
	}

	private updateValueVisibility() {
		this.valueVisibility = !this.valueVisibility;
	}

	private updateVisibilityFilter(filter: string) {
		this.visibilityFilter = filter;
	}
}

const CultureStore = new CultureStoreStatic();

export default CultureStore;
