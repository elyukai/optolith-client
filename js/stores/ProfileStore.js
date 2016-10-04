import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../constants/ActionTypes';

var _name = 'Heldenname';
var _gender = 'm';
var _portrait = 'images/portrait.png';

function _updateName(text) {
	_name = text;
}

function _updateGender(id) {
	_gender = id;
}

function _updatePortrait(url) {
	_portrait = url;
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

	getName: function() {
		return _name;
	},

	getGender: function() {
		return _gender;
	},

	getPortrait: function() {
		return _portrait;
	}

});

ProfileStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.CREATE_NEW_HERO:
			_updateName(payload.name);
			_updateGender(payload.gender);
			break;

		case ActionTypes.UPDATE_HERO_NAME:
			_updateName(payload.name);
			break;

		case ActionTypes.UPDATE_HERO_PORTRAIT:
			_updatePortrait(payload.url);
			break;

		default:
			return true;
	}

	ProfileStore.emitChange();

	return true;

});

export default ProfileStore;
