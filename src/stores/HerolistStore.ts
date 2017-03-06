import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';

type Action = SetHerolistSortOrderAction | SetHerolistVisibilityFilterAction | ReceiveLoginAction | ReceiveHerolistAction;

class HerolistStoreStatic extends Store {
	private byHeroId: { [id: string]: Hero} = {
		'H_1': {
			// ap: { total: 1784, spent: 1500, adv: [0, 0, 0], disadv: [0, 0, 0] },
			ap: { total: 1784, spent: 1775, adv: [63, 0, 0], disadv: [39, 0, 0] },
			avatar: 'images/portrait.png',
			c: 'C_7',
			clientVersion: '1.0.0',
			dateCreated: new Date('2016-10-18T16:18:28.420Z'),
			dateModified: new Date('2016-10-18T16:18:28.420Z'),
			el: 'EL_3',
			id: 'H_1',
			name: 'Shimo ibn Rashdul',
			p: 'P_24',
			phase: 2,
			player: 'U_1',
			pv: null,
			r: 'R_5',
			sex: 'm',
		},
		'H_2': {
			ap: { total: 1705, spent: 1704, adv: [63, 0, 0], disadv: [39, 0, 0] },
			avatar: 'images/portrait2.png',
			c: 'C_8',
			clientVersion: '1.0.0',
			dateCreated: new Date('2016-10-18T16:18:28.420Z'),
			dateModified: new Date('2016-10-18T16:18:28.420Z'),
			el: 'EL_3',
			id: 'H_2',
			name: 'Yendan Keres, Arran Ssitt\'Zzss',
			p: 'P_23',
			phase: 2,
			pv: null,
			r: 'R_1',
			sex: 'm',
		},
		'H_3': {
			ap: { total: 1100, spent: 1100, adv: [63, 0, 0], disadv: [39, 0, 0] },
			avatar: '',
			c: 'C_17',
			clientVersion: '1.0.0',
			dateCreated: new Date('2016-10-18T16:18:28.420Z'),
			dateModified: new Date('2016-10-18T16:18:28.420Z'),
			el: 'EL_3',
			id: 'H_3',
			name: 'Aki Raskirson',
			p: 'P_23',
			phase: 3,
			pv: null,
			r: 'R_4',
			sex: 'm',
		},
		'H_4': {
			ap: { total: 1102, spent: 1102, adv: [63, 0, 0], disadv: [39, 0, 0] },
			avatar: 'images/portrait4.png',
			c: 'C_15',
			clientVersion: '1.0.0',
			dateCreated: new Date('2016-10-18T16:18:28.420Z'),
			dateModified: new Date('2016-10-18T16:18:28.420Z'),
			el: 'EL_3',
			id: 'H_4',
			name: 'Coran Sero',
			p: 'P_22',
			phase: 3,
			pv: null,
			r: 'R_1',
			sex: 'm',
		},
		'H_5': {
			ap: { total: 1400, spent: 1391, adv: [63, 0, 0], disadv: [39, 0, 0] },
			avatar: 'images/portrait5.jpg',
			c: 'C_8',
			clientVersion: '1.0.0',
			dateCreated: new Date('2016-10-18T16:18:28.420Z'),
			dateModified: new Date('2016-10-18T16:18:28.420Z'),
			el: 'EL_3',
			id: 'H_5',
			name: 'Aon Sgarr',
			p: 'P_26',
			phase: 2,
			pv: null,
			r: 'R_1',
			sex: 'm',
		},
		'H_6': {
			ap: { total: 1567, spent: 1559, adv: [63, 0, 0], disadv: [39, 0, 0] },
			avatar: 'images/portrait6.png',
			c: 'C_14',
			clientVersion: '1.0.0',
			dateCreated: new Date('2016-10-18T16:18:28.420Z'),
			dateModified: new Date('2016-10-18T16:18:28.420Z'),
			el: 'EL_3',
			id: 'H_6',
			name: 'Zakhabar iban Bashur ban Mhadjâduri / Karmold',
			p: 'P_4',
			phase: 3,
			pv: 'PV_13',
			r: 'R_5',
			sex: 'm',
		},
		'H_7': {
			ap: { total: 900, spent: 900, adv: [63, 0, 0], disadv: [39, 0, 0] },
			avatar: 'images/portrait7.jpg',
			c: 'C_1',
			clientVersion: '1.0.0',
			dateCreated: new Date('2016-10-18T16:18:28.420Z'),
			dateModified: new Date('2016-10-18T16:18:28.420Z'),
			el: 'EL_1',
			id: 'H_7',
			name: 'Jindrik aus Wallingheim',
			p: 'P_16',
			phase: 3,
			pv: null,
			r: 'R_1',
			sex: 'm',
		},
		'H_8': {
			ap: { total: 1100, spent: 1100, adv: [63, 0, 0], disadv: [39, 0, 0] },
			avatar: 'images/portrait8.jpg',
			c: 'C_9',
			clientVersion: '1.0.0',
			dateCreated: new Date('2016-10-18T16:18:28.420Z'),
			dateModified: new Date('2016-10-18T16:18:28.420Z'),
			el: 'EL_3',
			id: 'H_8',
			name: 'Takate',
			p: 'P_4',
			phase: 2,
			pv: null,
			r: 'R_6',
			sex: 'm',
		},
		'H_9': {
			ap: { total: 1777, spent: 1677, adv: [63, 0, 0], disadv: [39, 0, 0] },
			avatar: 'images/portrait9.jpg',
			c: 'C_15',
			clientVersion: '1.0.0',
			dateCreated: new Date('2016-10-18T16:18:28.420Z'),
			dateModified: new Date('2016-10-18T16:18:28.420Z'),
			el: 'EL_3',
			id: 'H_9',
			name: 'Adario Orelio von Paligan',
			p: 'P_24',
			phase: 3,
			player: 'U_5',
			pv: null,
			r: 'R_1',
			sex: 'm',
		},
	};
	private allHeroIds = ['H_1', 'H_2', 'H_3', 'H_4', 'H_5', 'H_6', 'H_7', 'H_8', 'H_9'];
	private byUserId: { [id: string]: User} = {
		U_1: {
			displayName: 'schuchi',
			id: 'U_1',
		},
		U_5: {
			displayName: 'Maradas',
			id: 'U_5',
		},
	};
	private allUserIds = ['U_1', 'U_5'];
	private sortOrder = 'name';
	private view = 'all';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.SET_HEROLIST_SORT_ORDER:
					this.updateSortOrder(action.payload.sortOrder);
					break;

				case ActionTypes.SET_HEROLIST_VISIBILITY_FILTER:
					this.updateView(action.payload.filterOption);
					break;

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

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private updateView(view: string) {
		this.view = view;
	}

	private updateHeroes(heroes: { [id: string]: RawHero }) {
		this.byHeroId = {};
		this.byUserId = {};
		this.allHeroIds = Object.keys(heroes);
		this.allHeroIds.forEach(e => {
			const player = heroes[e].player;
			if (player) {
				this.byUserId[player.id] = player;
				this.byHeroId[e] = { ...heroes[e], player: player.id };
			}
		});
		this.allUserIds = Object.keys(this.byUserId);
	}
}

const HerolistStore = new HerolistStoreStatic();

export default HerolistStore;
