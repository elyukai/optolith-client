import AppDispatcher from '../dispatcher/AppDispatcher';
import EventEmitter from 'events';
import ActionTypes from '../constants/ActionTypes';

var _rules = null; // 4 oder 5
var _gender = null;
var _attributeMax = 14;
var _gp = {
	max: 110,
	attributes: 100
};

function updateRules(rules) {
	_rules = rules;
}

function updateGender(gender) {
	_gender = gender;
}

function updateGpMax(max) {
	_gp.max = max;
}

function updateGpAttr(attributes) {
	_gp.attributes = attributes;
}

function updateAttrMax(max) {
	_attributeMax = max;
}

function reset() {
	_rules = null;
	_gender = null;
	_attributeMax = 14;
	_gp = {
		max: 110,
		attributes: 100
	};
}

var CharbaseStore = Object.assign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	getRules: function() {
		return _rules;
	},

	getGender: function() {
		return _gender;
	},

	getAttrMax: function() {
		return _attributeMax;
	},

	getGP: function() {
		return _gp;
	},

	getAll: function() {
		return {
			rules: _rules,
			gender: _gender,
			attributeMax: _attributeMax,
			gp: _gp
		};
	}

});

CharbaseStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.SET_RULES:
			updateRules(payload.data.value);
			break;

		case ActionTypes.SET_GENDER:
			updateGender(payload.data.value);
			break;

		case ActionTypes.SET_GP_MAXIMUM:
			updateGpMax(payload.data.value);
			break;

		case ActionTypes.SET_GP_FOR_ATTRIBUTES:
			updateGpAttr(payload.data.value);
			break;

		case ActionTypes.SET_ATTRIBUTE_MAXIMUM:
			updateAttrMax(payload.data.value);
			break;

		case ActionTypes.CLEAR_HERO:
			reset();
			break;

		default:
			return true;
	}

	CharbaseStore.emitChange();

	return true;

});

export default CharbaseStore;
