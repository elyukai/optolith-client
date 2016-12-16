import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import WebAPIUtils from '../utils/WebAPIUtils';
import createOverlay from '../utils/createOverlay';
import ProfileAvatarChange from '../views/profile/ProfileAvatarChange';
import React from 'react';

export default {
	changeName: function(name) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_HERO_NAME,
			name
		});
	},
	showImageUpload: function() {
		createOverlay(<ProfileAvatarChange />);
	},
	changeAvatar: function({ source, extern, file }) {
		if (source === 'ext') {
			AppDispatcher.dispatch({
				actionType: ActionTypes.UPDATE_HERO_AVATAR,
				url: extern
			});
		} else {
			WebAPIUtils.changeHeroAvatar(file);
		}
	},
	changeFamily: function(value) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_FAMILY,
			value
		});
	},
	changePlaceOfBirth: function(value) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_PLACEOFBIRTH,
			value
		});
	},
	changeDateOfBirth: function(value) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_DATEOFBIRTH,
			value
		});
	},
	changeAge: function(value) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_AGE,
			value
		});
	},
	changeHaircolor: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_HAIRCOLOR,
			option
		});
	},
	changeEyecolor: function(option) {
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
	changeTitle: function(value) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_TITLE,
			value
		});
	},
	changeSocialStatus: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_SOCIALSTATUS,
			option
		});
	},
	changeCharacteristics: function(value) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_CHARACTERISTICS,
			value
		});
	},
	changeOtherInfo: function(value) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_OTHERINFO,
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
	},
	endCharacterCreation: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FINALIZE_CHARACTER_CREATION
		});
	}
};
