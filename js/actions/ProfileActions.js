import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import React from 'react';
import ReactDOM from 'react-dom';
import Selections from '../components/content/rcp/Selections';

var ProfileActions = {
	changeName: function(name) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_HERO_NAME,
			name
		});
	},
	changeHair: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_HAIRCOLOR,
			option
		});
	},
	changeEyes: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_EYECOLOR,
			option
		});
	},
	changeSize: function(value) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_SIZE,
			value
		});
	},
	changeWeight: function(value) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_WEIGHT,
			value
		});
	},
	rerollHair: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REROLL_HAIRCOLOR
		});
	},
	rerollEyes: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REROLL_EYECOLOR
		});
	},
	rerollSize: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REROLL_SIZE
		});
	},
	rerollWeight: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REROLL_WEIGHT
		});
	}
};

export default ProfileActions;
