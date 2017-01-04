import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';
import { Race } from '../utils/DataUtils';
import RaceStore from './RaceStore';

const HAIRCOLORS = Race.haircolors;
const EYECOLORS = Race.eyecolors;
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
	_haircolor = Race.rerollHaircolor(RaceStore.getCurrent());
}

function _rerollEyes() {
	_eyecolor = Race.rerollEyecolor(RaceStore.getCurrent());
}

function _rerollSize() {
	_size = Race.rerollSize(RaceStore.getCurrent());
}

function _rerollWeight() {
	_weight = Race.rerollWeight(RaceStore.getCurrent(), _size);
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

class _ProfileStore extends Store {

	getAll() {
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
	}

	getID() {
		return _id;
	}

	getName() {
		return _name;
	}

	getSex() {
		return _sex;
	}

	getAvatar() {
		return _avatar;
	}

	getAppearance() {
		return {
			_haircolor, _eyecolor, _size, _weight
		};
	}

	getHaircolor() {
		return _haircolor;
	}

	getHaircolorTags() {
		return HAIRCOLORS;
	}

	getEyecolor() {
		return _eyecolor;
	}

	getEyecolorTags() {
		return EYECOLORS;
	}

	getSize() {
		return _size;
	}

	getWeight() {
		return _weight;
	}

	getSocialstatusTags() {
		return SOCIALSTATUS;
	}

}

const ProfileStore = new _ProfileStore();

ProfileStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.type ) {

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
			_updateFamily(payload.pers.family);
			_updatePlaceOfBirth(payload.pers.placeofbirth);
			_updateDateOfBirth(payload.pers.dateofbirth);
			_updateAge(payload.pers.age);
			_updateHaircolor(payload.pers.haircolor);
			_updateEyecolor(payload.pers.eyecolor);
			_updateSize(payload.pers.size);
			_updateWeight(payload.pers.weight);
			_updateTitle(payload.pers.title);
			_updateSocialStatus(payload.pers.socialstatus);
			_updateCharacteristics(payload.pers.characteristics);
			_updateOtherInfo(payload.pers.otherinfo);
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
