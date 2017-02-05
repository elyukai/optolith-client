import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import WebAPIUtils from '../utils/WebAPIUtils';

export default {
	changeName(name: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_HERO_NAME,
			name
		});
	},
	addAP(value: number) {
		AppDispatcher.dispatch({
			type: ActionTypes.ADD_ADVENTURE_POINTS,
			value
		});
	},
	changeAvatar({ source, extern, file }) {
		if (source === 'ext') {
			AppDispatcher.dispatch({
				type: ActionTypes.UPDATE_HERO_AVATAR,
				url: extern
			});
		} else {
			WebAPIUtils.changeHeroAvatar(source, file);
		}
	},
	changeFamily(value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_FAMILY,
			value
		});
	},
	changePlaceOfBirth(value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_PLACEOFBIRTH,
			value
		});
	},
	changeDateOfBirth(value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_DATEOFBIRTH,
			value
		});
	},
	changeAge(value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_AGE,
			value
		});
	},
	changeHaircolor(option) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_HAIRCOLOR,
			option
		});
	},
	changeEyecolor(option) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_EYECOLOR,
			option
		});
	},
	changeSize(value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_SIZE,
			value
		});
	},
	changeWeight(value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_WEIGHT,
			value
		});
	},
	changeTitle(value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_TITLE,
			value
		});
	},
	changeSocialStatus(option) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_SOCIALSTATUS,
			option
		});
	},
	changeCharacteristics(value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_CHARACTERISTICS,
			value
		});
	},
	changeOtherInfo(value: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_OTHERINFO,
			value
		});
	},
	rerollHair() {
		AppDispatcher.dispatch({
			type: ActionTypes.REROLL_HAIRCOLOR
		});
	},
	rerollEyes() {
		AppDispatcher.dispatch({
			type: ActionTypes.REROLL_EYECOLOR
		});
	},
	rerollSize() {
		AppDispatcher.dispatch({
			type: ActionTypes.REROLL_SIZE
		});
	},
	rerollWeight() {
		AppDispatcher.dispatch({
			type: ActionTypes.REROLL_WEIGHT
		});
	},
	endCharacterCreation() {
		AppDispatcher.dispatch({
			type: ActionTypes.FINALIZE_CHARACTER_CREATION
		});
	}
};
