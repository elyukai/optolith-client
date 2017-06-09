import { ReceiveImportedHeroAction, ReceiveInitialDataAction } from '../actions/FileActions';
import { CreateHeroAction, DeleteHeroAction, DuplicateHeroAction, LoadHeroAction, SaveHeroAction, SetHerolistSortOrderAction, SetHerolistVisibilityFilterAction } from '../actions/HerolistActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { Hero, HeroForSave, User } from '../types/data.d';
import { RawHero, RawHerolist } from '../types/rawdata.d';
import * as FileAPIUtils from '../utils/FileAPIUtils';
import * as VersionUtils from '../utils/VersionUtils';
import { Store } from './Store';

type Action = SetHerolistSortOrderAction | SetHerolistVisibilityFilterAction | CreateHeroAction | LoadHeroAction | SaveHeroAction | DeleteHeroAction | ReceiveInitialDataAction | ReceiveImportedHeroAction | DuplicateHeroAction;

class HerolistStoreStatic extends Store {
	private heroes = new Map<string, Hero>();
	private users = new Map<string, User>();
	private currentId?: string;
	private sortOrder = 'name';
	private view = 'all';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.CREATE_HERO:
					this.currentId = undefined;
					break;

				case ActionTypes.LOAD_HERO:
					this.currentId = action.payload.data.id;
					break;

				case ActionTypes.SAVE_HERO:
					this.saveHero(action.payload.data);
					break;

				case ActionTypes.DELETE_HERO:
					this.deleteHero(action.payload.id);
					break;

				case ActionTypes.SET_HEROLIST_SORT_ORDER:
					this.updateSortOrder(action.payload.sortOrder);
					break;

				case ActionTypes.SET_HEROLIST_VISIBILITY_FILTER:
					this.updateView(action.payload.filterOption);
					break;

				case ActionTypes.RECEIVE_INITIAL_DATA:
					this.updateHeroes(action.payload.heroes);
					break;

				case ActionTypes.RECEIVE_IMPORTED_HERO:
					this.importHero(action.payload.data);
					break;

				case ActionTypes.DUPLICATE_HERO:
					this.duplicateHero(action.payload.id);
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	get(id: string) {
		return this.heroes.get(id);
	}

	getUser(id: string) {
		return this.users.get(id);
	}

	getAll() {
		return [...this.heroes.values()];
	}

	getSortOrder() {
		return this.sortOrder;
	}

	getView() {
		return this.view;
	}

	getCurrentId() {
		return this.currentId;
	}

	getForSave(id: string) {
		const hero = this.heroes.get(id);
		if (hero) {
			const { player: playerId, ...rest } = hero;
			return {
				...hero,
				id,
				dateCreated: rest.dateCreated.toJSON(),
				dateModified: rest.dateModified.toJSON(),
				player: playerId ? this.users.get(playerId) : undefined
			};
		}
		return;
	}

	getAllForSave() {
		return [...this.heroes].reduce((obj, [id, hero]) => {
			return { ...obj, [id]: hero };
		}, {});
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private updateView(view: string) {
		this.view = view;
	}

	private updateHeroes(heroes: RawHerolist) {
		this.heroes = new Map();
		this.users = new Map();
		Object.keys(heroes).forEach(key => {
			const hero = heroes[key];
			const { player, ...other } = hero;
			const finalHero: Hero = {
				...other,
				id: key,
				dateCreated: new Date(hero.dateCreated),
				dateModified: new Date(hero.dateModified),
			};
			if (player) {
				finalHero.player = player.id;
				this.users.set(player.id, player);
			}
			this.heroes.set(key, VersionUtils.convertHero(finalHero));
		});
	}

	private saveHero(data: HeroForSave) {
		const id = this.currentId;
		if (typeof id === 'string') {
			const oldData = this.heroes.get(id);
			this.heroes.set(id, {
				...data,
				id,
				player: oldData && oldData.player
			});
		}
		else {
			const newId = this.getNewId();
			this.heroes.set(newId, {
				...data,
				id: newId,
				dateCreated: new Date(),
				dateModified: new Date()
			});
			this.currentId = newId;
		}
		FileAPIUtils.saveAll();
	}

	private deleteHero(id: string) {
		this.heroes.delete(id);
	}

	private importHero(hero: RawHero) {
		const newId = this.getNewId();
		const { player, ...other } = hero;
		const finalHero: Hero = {
			...other,
			id: newId,
			dateCreated: new Date(hero.dateCreated),
			dateModified: new Date(hero.dateModified),
		};
		if (player) {
			finalHero.player = player.id;
			this.users.set(player.id, player);
		}
		this.heroes.set(newId, VersionUtils.convertHero(finalHero));
	}

	private duplicateHero(id: string) {
		const newId = this.getNewId();
		const hero = this.heroes.get(id);
		if (hero) {
			const finalHero: Hero = {
				...hero,
				id: newId
			};
			this.heroes.set(newId, finalHero);
		}
	}

	private getNewId() {
		const newIdNumber = Date.now().valueOf();
		return `HI_${newIdNumber}`;
	}
}

export const HerolistStore = new HerolistStoreStatic();
