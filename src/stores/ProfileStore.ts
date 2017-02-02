import Race from '../data/Race';
import * as ActionTypes from '../constants/ActionTypes';
import RaceStore from './RaceStore';
import Store from './Store';

const HAIRCOLORS = Race.haircolors;
const EYECOLORS = Race.eyecolors;
const SOCIALSTATUS = [ 'Unfrei', 'Frei', 'Niederadel', 'Adel', 'Hochadel' ];

let _id: string | null = null;
let _name = '';
let _sex = '';
let _avatar = '';
let _family = '';
let _placeofbirth = '';
let _dateofbirth = '';
let _age = '';
let _haircolor = 0;
let _eyecolor = 0;
let _size = '';
let _weight = '';
let _title = '';
let _socialstatus = 0;
let _characteristics = '';
let _otherinfo = '';

function _updateID(id: string | null) {
	_id = id;
}

function _updateName(text: string) {
	_name = text;
}

function _updateSex(id: string) {
	_sex = id;
}

function _updateAvatar(url: string) {
	_avatar = url;
}

function _updateFamily(text: string) {
	_family = text;
}

function _updatePlaceOfBirth(text: string) {
	_placeofbirth = text;
}

function _updateDateOfBirth(text: string) {
	_dateofbirth = text;
}

function _updateAge(text: string) {
	_age = text;
}

function _updateHaircolor(id: number) {
	_haircolor = id;
}

function _updateEyecolor(id: number) {
	_eyecolor = id;
}

function _updateSize(text: string) {
	_size = text;
}

function _updateWeight(text: string) {
	_weight = text;
}

function _updateTitle(text: string) {
	_title = text;
}

function _updateSocialStatus(id: number) {
	_socialstatus = id;
}

function _updateCharacteristics(text: string) {
	_characteristics = text;
}

function _updateOtherInfo(text: string) {
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

class ProfileStoreStatic extends Store {

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

const ProfileStore = new ProfileStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.CREATE_HERO:
			_clear();
			_updateName(action.name);
			_updateSex(action.gender);
			break;

		case ActionTypes.RECEIVE_HERO_DATA:
			_updateID(action.id);
			_updateName(action.name);
			_updateSex(action.sex);
			_updateAvatar(action.avatar);
			_updateFamily(action.pers.family);
			_updatePlaceOfBirth(action.pers.placeofbirth);
			_updateDateOfBirth(action.pers.dateofbirth);
			_updateAge(action.pers.age);
			_updateHaircolor(action.pers.haircolor);
			_updateEyecolor(action.pers.eyecolor);
			_updateSize(action.pers.size);
			_updateWeight(action.pers.weight);
			_updateTitle(action.pers.title);
			_updateSocialStatus(action.pers.socialstatus);
			_updateCharacteristics(action.pers.characteristics);
			_updateOtherInfo(action.pers.otherinfo);
			break;

		case ActionTypes.SET_HERO_NAME:
			_updateName(action.name);
			break;

		case ActionTypes.SET_HERO_AVATAR:
			_updateAvatar(action.url);
			break;

		case ActionTypes.SET_FAMILY:
			_updateFamily(action.value);
			break;

		case ActionTypes.SET_PLACEOFBIRTH:
			_updatePlaceOfBirth(action.value);
			break;

		case ActionTypes.SET_DATEOFBIRTH:
			_updateDateOfBirth(action.value);
			break;

		case ActionTypes.SET_AGE:
			_updateAge(action.value);
			break;

		case ActionTypes.SET_HAIRCOLOR:
			_updateHaircolor(action.option);
			break;

		case ActionTypes.SET_EYECOLOR:
			_updateEyecolor(action.option);
			break;

		case ActionTypes.SET_SIZE:
			_updateSize(action.value);
			break;

		case ActionTypes.SET_WEIGHT:
			_updateWeight(action.value);
			break;

		case ActionTypes.SET_TITLE:
			_updateTitle(action.value);
			break;

		case ActionTypes.SET_SOCIALSTATUS:
			_updateSocialStatus(action.option);
			break;

		case ActionTypes.SET_CHARACTERISTICS:
			_updateCharacteristics(action.value);
			break;

		case ActionTypes.SET_OTHERINFO:
			_updateOtherInfo(action.value);
			break;

		// case ActionTypes.REROLL_HAIRCOLOR:
		// 	_rerollHair();
		// 	break;

		// case ActionTypes.REROLL_EYECOLOR:
		// 	_rerollEyes();
		// 	break;

		// case ActionTypes.REROLL_SIZE:
		// 	_rerollSize();
		// 	break;

		// case ActionTypes.REROLL_WEIGHT:
		// 	_rerollWeight();
		// 	break;

		default:
			return true;
	}

	ProfileStore.emitChange();
	return true;
});

export default ProfileStore;
