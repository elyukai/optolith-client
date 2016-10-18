import AppDispatcher from '../../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../../constants/ActionTypes';

var _heroes = {

	'H_0': {
		client_version: '1.0.0',
		date: new Date('2016-10-18T16:18:28.420Z'),
		id: 'H_0',
		name: 'Shimo ibn Rashdul',
		avatar: 'images/portrait.png',
		ap: {
			_max: 1100,
			_used: 799,
			_rcp: [0, 12, 207, 14],
			_adv: 63,
			_adv_mag: 0,
			_adv_kar: 0,
			_disadv: 39,
			_disadv_mag: 0,
			_disadv_kar: 0
		},
		el: 'EL_3',
		r: 'R_1',
		c: 'C_8',
		p: 'P_6',
		pv: 'PV_21'
	},
	'H_1': {
		id: 'H_1',
		name: 'Yendan Keres',
		avatar: 'images/portrait2.png',
		ap: { _max: 1160, _used: 936 },
		el: 'EL_3',
		r: 'R_1',
		c: 'C_8',
		p: 'P_16',
		pv: 'PV_52'
	}
};
var _filter = '';
var _sortOrder = 'name';

function _updateFilterText(text) {
	_filter = text;
}

function _updateSortOrder(option) {
	_sortOrder = option;
}

function _updateHeroes(rawHeroes) {
	rawHeroes.split('#§');
	for (let i = 0; i < (rawHeroes.length - 1); i++) {
		rawHeroes[i] = rawHeroes[i].split('#%');
		rawHeroes[i][2] = rawHeroes[i][2].split('#$');
		rawHeroes[i] = {
			id: rawHeroes[i][0],
			name: rawHeroes[i][1],
			phase: rawHeroes[i][2][0],
			ap: rawHeroes[i][2][1],
			prof: rawHeroes[i][2][2],
			group: 1
			// group: raw[i][3],
			// player: raw[i][4]
		};
	}
	_heroes = rawHeroes;
}

var HerolistStore = Object.assign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	get: function(id) {
		return _heroes[id];
	},

	getAll: function() {
		return _heroes;
	},

	getAllForView: function() {
		var array = [];
		for (let id in _heroes) {
			let hero = _heroes[id];
			array.push(hero);
		}

		if (_filter !== '') {
			let filter = _filter.toLowerCase();
			array = array.filter(obj => obj.name.toLowerCase().match(filter));
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
				if (a.ap._max < b.ap._max)
					return -1;
				else if (a.ap._max > b.ap._max)
					return 1;
				else if (a.name < b.name)
					return -1;
				else if (a.name > b.name)
					return 1;
				return 0;
			});
		}
		return array;
	},

	getFilter: function() {
		return _filter;
	},

	getSortOrder: function() {
		return _sortOrder;
	}

});

HerolistStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.FILTER_HEROLIST:
			_updateFilterText(payload.text);
			break;

		case ActionTypes.SORT_HEROLIST:
			_updateSortOrder(payload.option);
			break;

		case ActionTypes.RECEIVE_ACCOUNT:
		case ActionTypes.RECEIVE_RAW_HEROES:
			_updateHeroes(payload.raw);
			break;

		default:
			return true;
	}

	HerolistStore.emitChange();

	return true;

});

export default HerolistStore;
