import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import WebAPIUtils from '../utils/WebAPIUtils';

export default {
	changeName(name: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_HERO_NAME,
			name
		});
	},
	addAP(value: number): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ADD_ADVENTURE_POINTS,
			value
		});
	},
	changeAvatar({ source, extern, file }): void {
		if (source === 'ext') {
			AppDispatcher.dispatch({
				type: ActionTypes.UPDATE_HERO_AVATAR,
				url: extern
			});
		} else {
			WebAPIUtils.changeHeroAvatar(source, file);
		}
	},
	changeFamily(value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_FAMILY,
			value
		});
	},
	changePlaceOfBirth(value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_PLACEOFBIRTH,
			value
		});
	},
	changeDateOfBirth(value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_DATEOFBIRTH,
			value
		});
	},
	changeAge(value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_AGE,
			value
		});
	},
	changeHaircolor(option): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_HAIRCOLOR,
			option
		});
	},
	changeEyecolor(option): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_EYECOLOR,
			option
		});
	},
	changeSize(value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_SIZE,
			value
		});
	},
	changeWeight(value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_WEIGHT,
			value
		});
	},
	changeTitle(value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_TITLE,
			value
		});
	},
	changeSocialStatus(option): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_SOCIALSTATUS,
			option
		});
	},
	changeCharacteristics(value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_CHARACTERISTICS,
			value
		});
	},
	changeOtherInfo(value: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.UPDATE_OTHERINFO,
			value
		});
	},
	rerollHair(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.REROLL_HAIRCOLOR
		});
	},
	rerollEyes(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.REROLL_EYECOLOR
		});
	},
	rerollSize(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.REROLL_SIZE
		});
	},
	rerollWeight(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.REROLL_WEIGHT
		});
	},
	endCharacterCreation(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.FINALIZE_CHARACTER_CREATION
		});
	}
};
