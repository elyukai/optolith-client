import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const setHeroName = (name: string) => AppDispatcher.dispatch<SetHeroNameAction>({
	type: ActionTypes.SET_HERO_NAME,
	payload: {
		name
	}
});

export const setHeroAvatar = (url: string) => AppDispatcher.dispatch<SetHeroAvatarAction>({
	type: ActionTypes.SET_HERO_AVATAR,
	payload: {
		url
	}
});

export const setFamily = (family: string) => AppDispatcher.dispatch<SetFamilyAction>({
	type: ActionTypes.SET_FAMILY,
	payload: {
		family
	}
});

export const setPlaceOfBirth = (placeofbirth: string) => AppDispatcher.dispatch<SetPlaceOfBirthAction>({
	type: ActionTypes.SET_PLACEOFBIRTH,
	payload: {
		placeofbirth
	}
});

export const setDateOfBirth = (dateofbirth: string) => AppDispatcher.dispatch<SetDateOfBirthAction>({
	type: ActionTypes.SET_DATEOFBIRTH,
	payload: {
		dateofbirth
	}
});

export const setAge = (age: string) => AppDispatcher.dispatch<SetAgeAction>({
	type: ActionTypes.SET_AGE,
	payload: {
		age
	}
});

export const setHairColor = (haircolor: number) => AppDispatcher.dispatch<SetHairColorAction>({
	type: ActionTypes.SET_HAIRCOLOR,
	payload: {
		haircolor
	}
});

export const setEyeColor = (eyecolor: number) => AppDispatcher.dispatch<SetEyeColorAction>({
	type: ActionTypes.SET_EYECOLOR,
	payload: {
		eyecolor
	}
});

export const setSize = (size: string) => AppDispatcher.dispatch<SetSizeAction>({
	type: ActionTypes.SET_SIZE,
	payload: {
		size
	}
});

export const setWeight = (weight: string) => AppDispatcher.dispatch<SetWeightAction>({
	type: ActionTypes.SET_WEIGHT,
	payload: {
		weight
	}
});

export const setTitle = (title: string) => AppDispatcher.dispatch<SetTitleAction>({
	type: ActionTypes.SET_TITLE,
	payload: {
		title
	}
});

export const setSocialStatus = (socialstatus: number) => AppDispatcher.dispatch<SetSocialStatusAction>({
	type: ActionTypes.SET_SOCIALSTATUS,
	payload: {
		socialstatus
	}
});

export const setCharacteristics = (characteristics: string) => AppDispatcher.dispatch<SetCharacteristicsAction>({
	type: ActionTypes.SET_CHARACTERISTICS,
	payload: {
		characteristics
	}
});

export const setOtherInfo = (otherinfo: string) => AppDispatcher.dispatch<SetOtherInfoAction>({
	type: ActionTypes.SET_OTHERINFO,
	payload: {
		otherinfo
	}
});

export const endHeroCreation = () => AppDispatcher.dispatch<EndHeroCreationAction>({
	type: ActionTypes.END_HERO_CREATION
});

export const addAdventurePoints = (amount: number) => AppDispatcher.dispatch<AddAdventurePointsAction>({
	type: ActionTypes.ADD_ADVENTURE_POINTS,
	payload: {
		amount
	}
});
