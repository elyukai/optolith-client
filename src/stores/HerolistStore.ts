import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import * as FileAPIUtils from '../utils/FileAPIUtils';
import Store from './Store';

type Action = SetHerolistSortOrderAction | SetHerolistVisibilityFilterAction | ReceiveLoginAction | ReceiveHerolistAction | ReceiveInitialDataAction | CreateHeroAction | ReceiveHeroDataAction | SaveHeroAction;

class HerolistStoreStatic extends Store {
	private byHeroId: { [id: string]: Hero} = {};
	private allHeroIds: string[] = [];
	private byUserId: { [id: string]: User} = {};
	private allUserIds: string[] = [];
	private currentId: string | null = null;
	private currentIndexId: string | null = null;
	private sortOrder = 'name';
	private view = 'all';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.CREATE_HERO:
					this.currentId = null;
					this.currentIndexId = null;
					break;

				case ActionTypes.RECEIVE_HERO_DATA:
					this.currentId = action.payload.data.id;
					this.currentIndexId = action.payload.data.indexId;
					break;

				case ActionTypes.SAVE_HERO:
					const indexId = action.payload.current.indexId;
					if (typeof indexId === 'string') {
						const player = this.byHeroId[indexId].player;
						const { dateCreated, dateModified } = action.payload.data;
						this.byHeroId[indexId] = {
							...action.payload.data,
							indexId,
							dateCreated: new Date(dateCreated),
							dateModified: new Date(dateModified)
						};
						if (player) {
							this.byHeroId[indexId].player = player;
						}
					}
					else {
						const newIndexForId = this.allHeroIds[this.allHeroIds.length - 1].split('_')[1] + 1;
						const newIndexId = `HI_${newIndexForId}`;
						this.byHeroId[newIndexId] = {
							...action.payload.data,
							indexId: newIndexId,
							dateCreated: new Date(),
							dateModified: new Date()
						};
						this.allHeroIds.push(newIndexId);
					}
					FileAPIUtils.saveAll();
					break;

				case ActionTypes.SET_HEROLIST_SORT_ORDER:
					this.updateSortOrder(action.payload.sortOrder);
					break;

				case ActionTypes.SET_HEROLIST_VISIBILITY_FILTER:
					this.updateView(action.payload.filterOption);
					break;

				case ActionTypes.RECEIVE_INITIAL_DATA:
				case ActionTypes.RECEIVE_LOGIN:
				case ActionTypes.RECEIVE_HEROLIST:
					this.updateHeroes(action.payload.heroes);
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	get(id: string) {
		return this.byHeroId[id];
	}

	getUser(id: string) {
		return this.byUserId[id];
	}

	getAll() {
		return this.allHeroIds.map(e => this.byHeroId[e]);
	}

	getSortOrder() {
		return this.sortOrder;
	}

	getView() {
		return this.view;
	}

	getCurrent() {
		return {
			id: this.currentId,
			indexId: this.currentIndexId
		};
	}

	getAllForSave() {
		return this.allHeroIds.map(e => {
			const { player: playerId, indexId, ...hero } = this.byHeroId[e];
			const raw: RawHero = {
				...hero,
				dateCreated: hero.dateCreated.toJSON(),
				dateModified: hero.dateModified.toJSON(),
			};
			if (playerId) {
				raw.player = this.byUserId[playerId];
			}
			return raw;
		});
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private updateView(view: string) {
		this.view = view;
	}

	private updateHeroes(heroes: RawHerolist) {
		this.byHeroId = {};
		this.byUserId = {};
		heroes.forEach((hero, index) => {
			const indexId = `HI_${index}`;
			const { player, ...other } = hero;
			this.byHeroId[indexId] = {
				...other,
				index,
				indexId,
				dateCreated: new Date(hero.dateCreated),
				dateModified: new Date(hero.dateModified),
			};
			if (player) {
				this.byHeroId[indexId].player = player.id;
				this.byUserId[player.id] = player;
			}
		});
		this.allHeroIds = Object.keys(this.byHeroId);
		this.allUserIds = Object.keys(this.byUserId);
	}
}

const HerolistStore = new HerolistStoreStatic();

export default HerolistStore;
