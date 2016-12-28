import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';

var _heroes = {
	'H_1': {
		client_version: '1.0.0',
		date: new Date('2016-10-18T16:18:28.420Z'),
		player: ['U_1', 'schuchi'],
		id: 'H_1',
		phase: 2,
		name: 'Shimo ibn Rashdul',
		avatar: 'images/portrait.png',
		ap: {
			total: 1784,
			spent: 1775,
			rcp: [0, 12, 207, 14],
			adv: [63, 0, 0],
			disadv: [39, 0, 0]
		},
		el: 'EL_3',
		r: 'R_5',
		c: 'C_7',
		p: 'P_24',
		pv: null,
		sex: 'm'
	},
	'H_2': {
		id: 'H_2',
		phase: 2,
		name: 'Yendan Keres, Arran Ssitt\'Zzss',
		avatar: 'images/portrait2.png',
		ap: { total: 1705, spent: 1704 },
		el: 'EL_3',
		r: 'R_1',
		c: 'C_8',
		p: 'P_23',
		pv: null,
		sex: 'm'
	},
	'H_3': {
		id: 'H_3',
		phase: 3,
		name: 'Aki Raskirson',
		avatar: '',
		ap: { total: 1100, spent: 1100 },
		el: 'EL_3',
		r: 'R_4',
		c: 'C_17',
		p: 'P_23',
		pv: null,
		sex: 'm'
	},
	'H_4': {
		id: 'H_4',
		phase: 3,
		name: 'Coran Sero',
		avatar: 'images/portrait4.png',
		ap: { total: 1102, spent: 1102 },
		el: 'EL_3',
		r: 'R_1',
		c: 'C_15',
		p: 'P_22',
		pv: null,
		sex: 'm'
	},
	'H_5': {
		id: 'H_5',
		phase: 2,
		name: 'Aon Sgarr',
		avatar: 'images/portrait5.jpg',
		ap: { total: 1400, spent: 1391 },
		el: 'EL_3',
		r: 'R_1',
		c: 'C_8',
		p: 'P_26',
		pv: null,
		sex: 'm'
	},
	'H_6': {
		id: 'H_6',
		phase: 3,
		name: 'Zakhabar iban Bashur ban Mhadjâduri / Karmold',
		avatar: 'images/portrait6.png',
		ap: { total: 1567, spent: 1559 },
		el: 'EL_3',
		r: 'R_5',
		c: 'C_14',
		p: 'P_4',
		pv: 'PV_13',
		sex: 'm'
	},
	'H_7': {
		id: 'H_7',
		phase: 3,
		name: 'Jindrik aus Wallingheim',
		avatar: 'images/portrait7.jpg',
		ap: { total: 900, spent: 900 },
		el: 'EL_1',
		r: 'R_1',
		c: 'C_1',
		p: 'P_16',
		pv: null,
		sex: 'm'
	},
	'H_8': {
		id: 'H_8',
		phase: 2,
		name: 'Takate',
		avatar: 'images/portrait8.jpg',
		ap: { total: 1100, spent: 1100 },
		el: 'EL_3',
		r: 'R_6',
		c: 'C_9',
		p: 'P_4',
		pv: null,
		sex: 'm'
	},
	'H_9': {
		player: ['U_5', 'Maradas'],
		id: 'H_9',
		phase: 2,
		name: 'Adario Orelio von Paligan',
		avatar: 'images/portrait9.jpg',
		ap: { total: 1777, spent: 1677 },
		el: 'EL_3',
		r: 'R_1',
		c: 'C_15',
		p: 'P_24',
		pv: null,
		sex: 'm'
	}
};
var _filter = 'Shimo';
var _sortOrder = 'name';
var _view = 'all';

function _updateFilterText(text) {
	_filter = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

function _updateView(view) {
	_view = view;
}

function _updateHeroes(rawHeroes) {
	var heroes = JSON.parse(rawHeroes);
	var obj = {};
	heroes.forEach(e => obj[e.id] = e);
	_heroes = obj;
}

class _HerolistStore extends Store {

	get(id) {
		return _heroes[id];
	}

	getAll() {
		return _heroes;
	}

	getAllForView() {
		var array = [];
		for (let id in _heroes) {
			let hero = _heroes[id];
			array.push(hero);
		}

		if (_filter !== '') {
			let filter = _filter.toLowerCase();
			array = array.filter(obj => obj.name.toLowerCase().match(filter));
		}
		if (_view !== 'all') {
			array = array.filter(obj => !!obj.player === (_view === 'shared'));
		}
		if (_sortOrder === 'name') {
			array.sort(function(a, b) {
				if (a.name < b.name)
					return -1;
				else if (a.name > b.name)
					return 1;
				return 0;
			});
		} else if (_sortOrder === 'ap') {
			array.sort(function(a, b) {
				if (a.ap.total < b.ap.total)
					return -1;
				else if (a.ap.total > b.ap.total)
					return 1;
				else if (a.name < b.name)
					return -1;
				else if (a.name > b.name)
					return 1;
				return 0;
			});
		}
		return array;
	}

	getFilter() {
		return _filter;
	}

	getSortOrder() {
		return _sortOrder;
	}

	getView() {
		return _view;
	}

}

const HerolistStore = new _HerolistStore();

HerolistStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.actionType ) {

		case ActionTypes.FILTER_HEROLIST:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_HEROLIST:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.CHANGE_HEROLIST_VIEW:
			_updateView(payload.view);
			break;

		case ActionTypes.RECEIVE_ACCOUNT:
		case ActionTypes.RECEIVE_RAW_HEROES:
			_updateHeroes(payload.heroes);
			break;

		default:
			return true;
	}

	HerolistStore.emitChange();

	return true;

});

export default HerolistStore;
