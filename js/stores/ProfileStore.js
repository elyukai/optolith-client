import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../constants/ActionTypes';
import RaceStore from './rcp/RaceStore';
import dice from '../utils/dice';

const HAIRCOLORS = [ 'blauschwarz', 'blond', 'braun', 'dunkelblond', 'dunkelbraun', 'goldblond', 'grau', 'hellblond', 'hellbraun', 'kupferrot', 'mittelblond', 'mittelbraun', 'rot', 'rotblond', 'schneeweiß', 'schwarz', 'silbern', 'weißblond', 'dunkelgrau', 'hellgrau', 'salzweiß', 'silberweiß', 'feuerrot' ];
const EYECOLORS = [ 'amethystviolett', 'bernsteinfarben', 'blau', 'braun', 'dunkelbraun', 'dunkelviolett', 'eisgrau', 'goldgesprenkelt', 'grau', 'graublau', 'grün', 'hellbraun', 'rubinrot', 'saphirblau', 'schwarz', 'schwarzbraun', 'silbergrau', 'smaragdgrün' ];
const SOCIALSTATUS = [ 'Unfrei', 'Frei', 'Niederadel', 'Adel', 'Hochadel' ];

var _id = null;
var _name = '';
var _sex = '';
var _avatar = '';
var _family = '';
var _placeofbirth = '';
var _dateofbirth = '';
var _age = '';
var _haircolor = 0;
var _eyecolor = 0;
var _size = '';
var _weight = '';
var _title = '';
var _socialstatus = 0;
var _characteristics = '';
var _otherinfo = '';

function _updateID(id) {
	_id = id;
}

function _updateName(text) {
	_name = text;
}

function _updateSex(id) {
	_sex = id;
}

function _updateAvatar(url) {
	_avatar = url;
}

function _updateFamily(text) {
	_family = text;
}

function _updatePlaceOfBirth(text) {
	_placeofbirth = text;
}

function _updateDateOfBirth(text) {
	_dateofbirth = text;
}

function _updateAge(text) {
	_age = text;
}

function _updateHaircolor(id) {
	_haircolor = id;
}

function _updateEyecolor(id) {
	_eyecolor = id;
}

function _updateSize(text) {
	_size = text;
}

function _updateWeight(text) {
	_weight = text;
}

function _updateTitle(text) {
	_title = text;
}

function _updateSocialStatus(id) {
	_socialstatus = id;
}

function _updateCharacteristics(text) {
	_characteristics = text;
}

function _updateOtherInfo(text) {
	_otherinfo = text;
}

function _rerollHair() {
	var result = dice(20);
	_haircolor = RaceStore.getCurrent().hair[result - 1];
}

function _rerollEyes() {
	var result = dice(20);
	_eyecolor = RaceStore.getCurrent().eyes[result - 1];
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

function _clear() {
	_id = null;
	_name = '';
	_sex = '';
	_avatar = '';
	_family = '';
	_placeofbirth = '';
	_dateofbirth = '';
	_age = '';
	_haircolor = 0;
	_eyecolor = 0;
	_size = '';
	_weight = '';
	_title = '';
	_socialstatus = 0;
	_characteristics = '';
	_otherinfo = '';
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

	getAll: function() {
		return {
			name: _name,
			sex: _sex,
			avatar: _avatar,
			family: _family,
			placeofbirth: _placeofbirth,
			dateofbirth: _dateofbirth,
			age: _age,
			haircolor: _haircolor,
			eyecolor: _eyecolor,
			size: _size,
			weight: _weight,
			title: _title,
			socialstatus: _socialstatus,
			characteristics: _characteristics,
			otherinfo: _otherinfo
		};
	},

	getID: function() {
		return _id;
	},

	getName: function() {
		return _name;
	},

	getSex: function() {
		return _sex;
	},

	getAvatar: function() {
		return _avatar;
	},

	getAppearance: function() {
		return {
			_haircolor, _eyecolor, _size, _weight
		};
	},

	getHaircolor: function() {
		return _haircolor;
	},

	getHaircolorTags: function() {
		return HAIRCOLORS;
	},

	getEyecolor: function() {
		return _eyecolor;
	},

	getEyecolorTags: function() {
		return EYECOLORS;
	},

	getSize: function() {
		return _size;
	},

	getWeight: function() {
		return _weight;
	},

	getSocialstatusTags: function() {
		return SOCIALSTATUS;
	}

});

ProfileStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.CREATE_NEW_HERO:
			_clear();
			_updateName(payload.name);
			_updateSex(payload.gender);
			break;

		case ActionTypes.CLEAR_HERO:
			_clear();
			break;

		case ActionTypes.RECEIVE_HERO:
			_updateID(payload.id);
			_updateName(payload.name);
			_updateSex(payload.sex);
			_updateAvatar(payload.avatar);
			_updateFamily(payload.pers._family);
			_updatePlaceOfBirth(payload.pers._placeofbirth);
			_updateDateOfBirth(payload.pers._dateofbirth);
			_updateAge(payload.pers._age);
			_updateHaircolor(payload.pers._haircolor);
			_updateEyecolor(payload.pers._eyecolor);
			_updateSize(payload.pers._size);
			_updateWeight(payload.pers._weight);
			_updateTitle(payload.pers._title);
			_updateSocialStatus(payload.pers._socialstatus);
			_updateCharacteristics(payload.pers._characteristics);
			_updateOtherInfo(payload.pers._otherinfo);
			break;

		case ActionTypes.UPDATE_HERO_NAME:
			_updateName(payload.name);
			break;

		case ActionTypes.UPDATE_HERO_AVATAR:
			_updateAvatar(payload.url);
			break;

		case ActionTypes.UPDATE_FAMILY:
			_updateFamily(payload.value);
			break;

		case ActionTypes.UPDATE_PLACEOFBIRTH:
			_updatePlaceOfBirth(payload.value);
			break;

		case ActionTypes.UPDATE_DATEOFBIRTH:
			_updateDateOfBirth(payload.value);
			break;

		case ActionTypes.UPDATE_AGE:
			_updateAge(payload.value);
			break;

		case ActionTypes.UPDATE_HAIRCOLOR:
			_updateHaircolor(payload.option);
			break;

		case ActionTypes.UPDATE_EYECOLOR:
			_updateEyecolor(payload.option);
			break;

		case ActionTypes.UPDATE_SIZE:
			_updateSize(payload.value);
			break;

		case ActionTypes.UPDATE_WEIGHT:
			_updateWeight(payload.value);
			break;

		case ActionTypes.UPDATE_TITLE:
			_updateTitle(payload.value);
			break;

		case ActionTypes.UPDATE_SOCIALSTATUS:
			_updateSocialStatus(payload.option);
			break;

		case ActionTypes.UPDATE_CHARACTERISTICS:
			_updateCharacteristics(payload.value);
			break;

		case ActionTypes.UPDATE_OTHERINFO:
			_updateOtherInfo(payload.value);
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
