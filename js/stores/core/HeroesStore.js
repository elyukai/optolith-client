import AppDispatcher from '../../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../../constants/ActionTypes';

var _heroes = [];
var _sortBy = 'name';

function updateSort(sort) {
	_sortBy = sort;
}

function updateHeroes(rawHeroes) {
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

var HeroesStore = Object.assign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	getAll: function() {
		return _heroes;
	},

	getSortOption: function() {
		return _sortBy;
	},

	getHeroes: function() {
		var heroes = [];
		for (var hero of _heroes) {
			if (hero.group !== 2) {
				heroes.push(hero);
			}
		}
		if (_sortBy === 'name') {
			heroes.sort(function(a, b) {
				if (a.name < b.name)
					return -1;
				else if (a.name > b.name)
					return 1;
				return 0;
			});
		} else if (_sortBy === 'ap') {
			heroes.sort(function(a, b) {
				if (a.ap < b.ap)
					return -1;
				else if (a.ap > b.ap)
					return 1;
				return 0;
			});
		}
		return heroes;
	},

	getAllForGroup: function(group) {
		var heroes = [];
		for (var hero of _heroes) {
			if (hero.group == group) {
				heroes.push(hero);
			}
		}
		if (_sortBy === 'name') {
			heroes.sort(function(a, b) {
				if (a.name < b.name)
					return -1;
				else if (a.name > b.name)
					return 1;
				return 0;
			});
		} else if (_sortBy === 'ap') {
			heroes.sort(function(a, b) {
				if (a.ap < b.ap)
					return -1;
				else if (a.ap > b.ap)
					return 1;
				return 0;
			});
		}
		return heroes;
	},

	getHeroByID: function(id) {
		for (let i = 0; i < HeroesStore.heroes.length; i++) {
			if (HeroesStore.heroes[i].id == id) return HeroesStore.heroes[i];
		}
		return false;
	}

});

HeroesStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.SORT_HEROES_BY:
			updateSort(payload.sortBy);
			break;

		case ActionTypes.RECEIVE_ACCOUNT:
		case ActionTypes.RECEIVE_RAW_HEROES:
			updateHeroes(payload.raw);
			break;

		default:
			return true;
	}

	HeroesStore.emitChange();

	return true;

});

export default HeroesStore;
