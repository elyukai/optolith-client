import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import * as ActionTypes from '../constants/ActionTypes';

type Action = SetHerolistSortOrderAction | SetHerolistVisibilityFilterAction | ReceiveLoginAction | ReceiveHerolistAction;

let _byHeroId: { [id: string]: Hero} = {
	'H_1': {
		clientVersion: '1.0.0',
		dateCreated: new Date('2016-10-18T16:18:28.420Z'),
		dateModified: new Date('2016-10-18T16:18:28.420Z'),
		player: 'U_1',
		id: 'H_1',
		phase: 2,
		name: 'Shimo ibn Rashdul',
		avatar: 'images/portrait.png',
		ap: {
			total: 1784,
			spent: 1775,
			adv: [63, 0, 0],
			disadv: [39, 0, 0]
			// spent: 1500,
			// adv: [0, 0, 0],
			// disadv: [0, 0, 0]
		},
		el: 'EL_3',
		r: 'R_5',
		c: 'C_7',
		p: 'P_24',
		pv: null,
		sex: 'm'
	},
	'H_2': {
		clientVersion: '1.0.0',
		dateCreated: new Date('2016-10-18T16:18:28.420Z'),
		dateModified: new Date('2016-10-18T16:18:28.420Z'),
		id: 'H_2',
		phase: 2,
		name: 'Yendan Keres, Arran Ssitt\'Zzss',
		avatar: 'images/portrait2.png',
		ap: { total: 1705, spent: 1704, adv: [63, 0, 0], disadv: [39, 0, 0] },
		el: 'EL_3',
		r: 'R_1',
		c: 'C_8',
		p: 'P_23',
		pv: null,
		sex: 'm'
	},
	'H_3': {
		clientVersion: '1.0.0',
		dateCreated: new Date('2016-10-18T16:18:28.420Z'),
		dateModified: new Date('2016-10-18T16:18:28.420Z'),
		id: 'H_3',
		phase: 3,
		name: 'Aki Raskirson',
		avatar: '',
		ap: { total: 1100, spent: 1100, adv: [63, 0, 0], disadv: [39, 0, 0] },
		el: 'EL_3',
		r: 'R_4',
		c: 'C_17',
		p: 'P_23',
		pv: null,
		sex: 'm'
	},
	'H_4': {
		clientVersion: '1.0.0',
		dateCreated: new Date('2016-10-18T16:18:28.420Z'),
		dateModified: new Date('2016-10-18T16:18:28.420Z'),
		id: 'H_4',
		phase: 3,
		name: 'Coran Sero',
		avatar: 'images/portrait4.png',
		ap: { total: 1102, spent: 1102, adv: [63, 0, 0], disadv: [39, 0, 0] },
		el: 'EL_3',
		r: 'R_1',
		c: 'C_15',
		p: 'P_22',
		pv: null,
		sex: 'm'
	},
	'H_5': {
		clientVersion: '1.0.0',
		dateCreated: new Date('2016-10-18T16:18:28.420Z'),
		dateModified: new Date('2016-10-18T16:18:28.420Z'),
		id: 'H_5',
		phase: 2,
		name: 'Aon Sgarr',
		avatar: 'images/portrait5.jpg',
		ap: { total: 1400, spent: 1391, adv: [63, 0, 0], disadv: [39, 0, 0] },
		el: 'EL_3',
		r: 'R_1',
		c: 'C_8',
		p: 'P_26',
		pv: null,
		sex: 'm'
	},
	'H_6': {
		clientVersion: '1.0.0',
		dateCreated: new Date('2016-10-18T16:18:28.420Z'),
		dateModified: new Date('2016-10-18T16:18:28.420Z'),
		id: 'H_6',
		phase: 3,
		name: 'Zakhabar iban Bashur ban Mhadjâduri / Karmold',
		avatar: 'images/portrait6.png',
		ap: { total: 1567, spent: 1559, adv: [63, 0, 0], disadv: [39, 0, 0] },
		el: 'EL_3',
		r: 'R_5',
		c: 'C_14',
		p: 'P_4',
		pv: 'PV_13',
		sex: 'm'
	},
	'H_7': {
		clientVersion: '1.0.0',
		dateCreated: new Date('2016-10-18T16:18:28.420Z'),
		dateModified: new Date('2016-10-18T16:18:28.420Z'),
		id: 'H_7',
		phase: 3,
		name: 'Jindrik aus Wallingheim',
		avatar: 'images/portrait7.jpg',
		ap: { total: 900, spent: 900, adv: [63, 0, 0], disadv: [39, 0, 0] },
		el: 'EL_1',
		r: 'R_1',
		c: 'C_1',
		p: 'P_16',
		pv: null,
		sex: 'm'
	},
	'H_8': {
		clientVersion: '1.0.0',
		dateCreated: new Date('2016-10-18T16:18:28.420Z'),
		dateModified: new Date('2016-10-18T16:18:28.420Z'),
		id: 'H_8',
		phase: 2,
		name: 'Takate',
		avatar: 'images/portrait8.jpg',
		ap: { total: 1100, spent: 1100, adv: [63, 0, 0], disadv: [39, 0, 0] },
		el: 'EL_3',
		r: 'R_6',
		c: 'C_9',
		p: 'P_4',
		pv: null,
		sex: 'm'
	},
	'H_9': {
		clientVersion: '1.0.0',
		dateCreated: new Date('2016-10-18T16:18:28.420Z'),
		dateModified: new Date('2016-10-18T16:18:28.420Z'),
		player: 'U_5',
		id: 'H_9',
		phase: 3,
		name: 'Adario Orelio von Paligan',
		avatar: 'images/portrait9.jpg',
		ap: { total: 1777, spent: 1677, adv: [63, 0, 0], disadv: [39, 0, 0] },
		el: 'EL_3',
		r: 'R_1',
		c: 'C_15',
		p: 'P_24',
		pv: null,
		sex: 'm'
	}
};
let _allHeroIds = ['H_1','H_2','H_3','H_4','H_5','H_6','H_7','H_8','H_9'];
let _byUserId: { [id: string]: User} = {
	U_1: {
		id: 'U_1',
		displayName: 'schuchi'
	},
	U_5: {
		id: 'U_5',
		displayName: 'Maradas'
	}
};
let _allUserIds = ['U_1','U_5'];
let _sortOrder = 'name';
let _view = 'all';

function _updateSortOrder(option: string) {
	_sortOrder = option;
}

function _updateView(view: string) {
	_view = view;
}

function _updateHeroes(heroes: { [id: string]: RawHero }) {
	_byHeroId = {};
	_byUserId = {};
	_allHeroIds = Object.keys(heroes);
	_allHeroIds.forEach(e => {
		const player = heroes[e].player;
		if (player) {
			_byUserId[player.id] = player;
			_byHeroId[e] = { ...heroes[e], player: player.id };
		}
	});
	_allUserIds = Object.keys(_byUserId);
}

class HerolistStoreStatic extends Store {

	get(id: string) {
		return _byHeroId[id];
	}

	getUser(id: string) {
		return _byUserId[id];
	}

	getAll() {
		return _allHeroIds.map(e => _byHeroId[e]);
	}

	getSortOrder() {
		return _sortOrder;
	}

	getView() {
		return _view;
	}

}

const HerolistStore = new HerolistStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.SET_HEROLIST_SORT_ORDER:
			_updateSortOrder(action.payload.sortOrder);
			break;

		case ActionTypes.SET_HEROLIST_VISIBILITY_FILTER:
			_updateView(action.payload.filterOption);
			break;

		case ActionTypes.RECEIVE_LOGIN:
		case ActionTypes.RECEIVE_HEROLIST:
			_updateHeroes(action.payload.heroes);
			break;

		default:
			return true;
	}

	HerolistStore.emitChange();
	return true;
});

export default HerolistStore;
