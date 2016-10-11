import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../constants/ActionTypes';
import RaceStore from './rcp/RaceStore';
import dice from '../utils/dice';

var _id = null;
var _name = 'Heldenname';
var _gender = 'm';
var _portrait = 'images/portrait.png';
var _hair = '';
var _eyes = '';
var _size = '';
var _weight = '';

function _updateID(id) {
	_id = id;
}

function _updateName(text) {
	_name = text;
}

function _updateGender(id) {
	_gender = id;
}

function _updatePortrait(url) {
	_portrait = url;
}

function _updateHair(id) {
	_hair = id;
}

function _updateEyes(id) {
	_eyes = id;
}

function _updateSize(text) {
	_size = text;
}

function _updateWeight(text) {
	_weight = text;
}

function _rerollHair() {
	var result = dice(20);
	_hair = RaceStore.getCurrent().hair[result - 1];
}

function _rerollEyes() {
	var result = dice(20);
	_eyes = RaceStore.getCurrent().eyes[result - 1];
}

function _rerollSize() {
	var [ base, ...dices ] = RaceStore.getCurrent().size;
	var arr = [];
	dices.forEach(e => {
		let elements = Array.from({ length: e[0] }, () => e[1]);
		arr.push(...elements);
	});
	_size = base + arr.map(e => dice(e)).reduce((a,b) => a + b, 0);
}

function _rerollWeight() {
	var [ base, ...dices ] = RaceStore.getCurrent().weight;
	var raceID = RaceStore.getCurrentID();
	var arr = [];
	dices.forEach(e => {
		let elements = Array.from({ length: e[0] }, () => e[1]);
		arr.push(...elements);
	});
	_weight = (parseInt(_size) || do {
		_rerollSize();
		_size;
	}) + base + arr.map(e => {
		let result = dice(Math.abs(e));
		if (new Set(['R_1','R_2','R_3','R_4','R_5','R_6','R_7']).has(raceID)) {
			return result % 2 > 0 ? -result : result;
		} else {
			return e < 0 ? -result : result;
		}
	}).reduce((a,b) => a + b, 0);
}

var ProfileStore = Object.assign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	getID: function() {
		return _id;
	},

	getName: function() {
		return _name;
	},

	getGender: function() {
		return _gender;
	},

	getPortrait: function() {
		return _portrait;
	},

	getAppearance: function() {
		return {
			_hair, _eyes, _size, _weight
		};
	},

	getHair: function() {
		return _hair;
	},

	getEyes: function() {
		return _eyes;
	},

	getSize: function() {
		return _size;
	},

	getWeight: function() {
		return _weight;
	}

});

ProfileStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.CREATE_NEW_HERO:
			_updateName(payload.name);
			_updateGender(payload.gender);
			break;

		case ActionTypes.RECEIVE_HERO:
			_updateID(payload.id);
			_updateName(payload.name);
			// _updateGender(payload.gender);
			_updatePortrait(payload.avatar);
			// _updateHair(payload.pers._hair);
			// _updateEyes(payload.pers._eyes);
			// _updateSize(payload.pers._size);
			// _updateWeight(payload.pers._weight);
			break;

		case ActionTypes.UPDATE_HERO_NAME:
			_updateName(payload.name);
			break;

		case ActionTypes.UPDATE_HERO_PORTRAIT:
			_updatePortrait(payload.url);
			break;

		case ActionTypes.UPDATE_HAIRCOLOR:
			_updateHair(payload.option);
			break;

		case ActionTypes.UPDATE_EYECOLOR:
			_updateEyes(payload.option);
			break;

		case ActionTypes.UPDATE_SIZE:
			_updateSize(payload.value);
			break;

		case ActionTypes.UPDATE_WEIGHT:
			_updateWeight(payload.value);
			break;

		case ActionTypes.REROLL_HAIRCOLOR:
			_rerollHair();
			break;

		case ActionTypes.REROLL_EYECOLOR:
			_rerollEyes();
			break;

		case ActionTypes.REROLL_SIZE:
			_rerollSize();
			break;

		case ActionTypes.REROLL_WEIGHT:
			_rerollWeight();
			break;

		default:
			return true;
	}

	ProfileStore.emitChange();

	return true;

});

export default ProfileStore;
