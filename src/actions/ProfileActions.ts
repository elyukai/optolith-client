import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../selectors/dependentInstancesSelectors';
import { AsyncAction } from '../types/actions.d';
import { RaceInstance } from '../types/data.d';
import * as RCPUtils from '../utils/RCPUtils';

export interface SetHeroNameAction {
	type: ActionTypes.SET_HERO_NAME;
	payload: {
		name: string;
	};
}

export function _setHeroName(name: string): SetHeroNameAction {
	return {
		type: ActionTypes.SET_HERO_NAME,
		payload: {
			name
		}
	};
}

export interface SetCustomProfessionNameAction {
	type: ActionTypes.SET_CUSTOM_PROFESSION_NAME;
	payload: {
		name: string;
	};
}

export function _setCustomProfessionName(name: string): SetCustomProfessionNameAction {
	return {
		type: ActionTypes.SET_CUSTOM_PROFESSION_NAME,
		payload: {
			name
		}
	};
}

export interface SetHeroAvatarAction {
	type: ActionTypes.SET_HERO_AVATAR;
	payload: {
		url: string;
	};
}

export function _setHeroAvatar(path: string): SetHeroAvatarAction {
	return {
		type: ActionTypes.SET_HERO_AVATAR,
		payload: {
			url: path
		}
	};
}

export interface SetFamilyAction {
	type: ActionTypes.SET_FAMILY;
	payload: {
		family: string;
	};
}

export function _setFamily(family: string): SetFamilyAction {
	return {
		type: ActionTypes.SET_FAMILY,
		payload: {
			family,
		},
	};
}

export interface SetPlaceOfBirthAction {
	type: ActionTypes.SET_PLACEOFBIRTH;
	payload: {
		placeofbirth: string;
	};
}

export function _setPlaceOfBirth(placeofbirth: string): SetPlaceOfBirthAction {
	return {
		type: ActionTypes.SET_PLACEOFBIRTH,
		payload: {
			placeofbirth
		}
	};
}

export interface SetDateOfBirthAction {
	type: ActionTypes.SET_DATEOFBIRTH;
	payload: {
		dateofbirth: string;
	};
}

export function _setDateOfBirth(dateofbirth: string): SetDateOfBirthAction {
	return {
		type: ActionTypes.SET_DATEOFBIRTH,
		payload: {
			dateofbirth
		}
	};
}

export interface SetAgeAction {
	type: ActionTypes.SET_AGE;
	payload: {
		age: string;
	};
}

export function _setAge(age: string): SetAgeAction {
	return {
		type: ActionTypes.SET_AGE,
		payload: {
			age
		}
	};
}

export interface SetHairColorAction {
	type: ActionTypes.SET_HAIRCOLOR;
	payload: {
		haircolor: number;
	};
}

export function _setHairColor(haircolor: number): SetHairColorAction {
	return {
		type: ActionTypes.SET_HAIRCOLOR,
		payload: {
			haircolor
		}
	};
}

export interface SetEyeColorAction {
	type: ActionTypes.SET_EYECOLOR;
	payload: {
		eyecolor: number;
	};
}

export function _setEyeColor(eyecolor: number): SetEyeColorAction {
	return {
		type: ActionTypes.SET_EYECOLOR,
		payload: {
			eyecolor
		}
	};
}

export interface SetSizeAction {
	type: ActionTypes.SET_SIZE;
	payload: {
		size: string;
	};
}

export function _setSize(size: string): SetSizeAction {
	return {
		type: ActionTypes.SET_SIZE,
		payload: {
			size
		}
	};
}

export interface SetWeightAction {
	type: ActionTypes.SET_WEIGHT;
	payload: {
		size?: string;
		weight: string;
	};
}

export function _setWeight(weight: string, size?: string): SetWeightAction {
	return {
		type: ActionTypes.SET_WEIGHT,
		payload: {
			size,
			weight
		}
	};
}

export function _rerollHairColor(): AsyncAction {
	return (dispatch, getState) => {
		const { dependent, rcp: { race: raceId }} = getState().currentHero.present;
		const race = raceId ? get(dependent, raceId) as RaceInstance | undefined : undefined;
		if (typeof race !== 'undefined') {
			const hairColor = RCPUtils.rerollHairColor(race);
			dispatch(_setHairColor(hairColor));
		}
		return;
	};
}

export function _rerollEyeColor(): AsyncAction {
	return (dispatch, getState) => {
		const { dependent, rcp: { race: raceId }} = getState().currentHero.present;
		const race = raceId ? get(dependent, raceId) as RaceInstance | undefined : undefined;
		if (typeof race !== 'undefined') {
			const eyeColor = RCPUtils.rerollEyeColor(race);
			dispatch(_setEyeColor(eyeColor));
		}
		return;
	};
}

export function _rerollSize(): AsyncAction {
	return (dispatch, getState) => {
		const { dependent, rcp: { race: raceId }} = getState().currentHero.present;
		const race = raceId ? get(dependent, raceId) as RaceInstance | undefined : undefined;
		if (typeof race !== 'undefined') {
			const size = RCPUtils.rerollSize(race);
			dispatch(_setSize(size));
		}
		return;
	};
}

export function _rerollWeight(): AsyncAction {
	return (dispatch, getState) => {
		const { dependent, profile: { size: prevSize }, rcp: { race: raceId }} = getState().currentHero.present;
		const race = raceId ? get(dependent, raceId) as RaceInstance | undefined : undefined;
		if (typeof race !== 'undefined') {
			const [ weight, size ] = RCPUtils.rerollWeight(race, prevSize);
			dispatch(_setWeight(weight, size));
		}
		return;
	};
}

export interface SetTitleAction {
	type: ActionTypes.SET_TITLE;
	payload: {
		title: string;
	};
}

export function _setTitle(title: string): SetTitleAction {
	return {
		type: ActionTypes.SET_TITLE,
		payload: {
			title
		}
	};
}

export interface SetSocialStatusAction {
	type: ActionTypes.SET_SOCIALSTATUS;
	payload: {
		socialstatus: number;
	};
}

export function _setSocialStatus(socialstatus: number): SetSocialStatusAction {
	return {
		type: ActionTypes.SET_SOCIALSTATUS,
		payload: {
			socialstatus
		}
	};
}

export interface SetCharacteristicsAction {
	type: ActionTypes.SET_CHARACTERISTICS;
	payload: {
		characteristics: string;
	};
}

export function _setCharacteristics(characteristics: string): SetCharacteristicsAction {
	return {
		type: ActionTypes.SET_CHARACTERISTICS,
		payload: {
			characteristics
		}
	};
}

export interface SetOtherInfoAction {
	type: ActionTypes.SET_OTHERINFO;
	payload: {
		otherinfo: string;
	};
}

export function _setOtherInfo(otherinfo: string): SetOtherInfoAction {
	return {
		type: ActionTypes.SET_OTHERINFO,
		payload: {
			otherinfo
		}
	};
}

export interface SetCultureAreaKnowledge {
	type: ActionTypes.SET_CULTURE_AREA_KNOWLEDGE;
	payload: {
		cultureAreaKnowledge: string;
	};
}

export function _setCultureAreaKnowledge(cultureAreaKnowledge: string): SetCultureAreaKnowledge {
	return {
		type: ActionTypes.SET_CULTURE_AREA_KNOWLEDGE,
		payload: {
			cultureAreaKnowledge
		}
	};
}

export interface EndHeroCreationAction {
	type: ActionTypes.END_HERO_CREATION;
}

export function _endHeroCreation(): EndHeroCreationAction {
	return {
		type: ActionTypes.END_HERO_CREATION
	};
}

export interface AddAdventurePointsAction {
	type: ActionTypes.ADD_ADVENTURE_POINTS;
	payload: {
		amount: number;
	};
}

export function _addAdventurePoints(amount: number): AddAdventurePointsAction {
	return {
		type: ActionTypes.ADD_ADVENTURE_POINTS,
		payload: {
			amount
		}
	};
}
