import * as ActionTypes from '../constants/ActionTypes';
import * as WebAPIUtils from '../utils/WebAPIUtils';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ProfileStore from '../stores/ProfileStore';
import Race from '../data/Race';
import RaceStore from '../stores/RaceStore';

export const setHeroName = (name: string) => AppDispatcher.dispatch<SetHeroNameAction>({
	type: ActionTypes.SET_HERO_NAME,
	payload: {
		name
	}
});

export const setHeroAvatar = (source: string | File) => {
	if (typeof source === 'string') {
		AppDispatcher.dispatch<SetHeroAvatarAction>({
			type: ActionTypes.SET_HERO_AVATAR,
			payload: {
				url: source
			}
		});
	}
	// else {
	// 	WebAPIUtils.changeHeroAvatar(source);
	// }
};
	// changeAvatar({ source, extern, file }) {
	// 	if (source === 'ext') {
	// 		AppDispatcher.dispatch({
	// 			type: ActionTypes.UPDATE_HERO_AVATAR,
	// 			url: extern
	// 		});
	// 	} else {
	// 		WebAPIUtils.changeHeroAvatar(source, file);
	// 	}
	// },

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

export const setWeight = (weight: string, size?: string) => AppDispatcher.dispatch<SetWeightAction>({
	type: ActionTypes.SET_WEIGHT,
	payload: {
		size,
		weight
	}
});

export const rerollHairColor = () => {
	const race = RaceStore.getCurrent();
	const hairColor = Race.rerollHairColor(race);
	setHairColor(hairColor);
};

export const rerollEyeColor = () => {
	const race = RaceStore.getCurrent();
	const eyeColor = Race.rerollEyeColor(race);
	setEyeColor(eyeColor);
};

export const rerollSize = () => {
	const race = RaceStore.getCurrent();
	const size = Race.rerollSize(race);
	setSize(size);
};

export const rerollWeight = () => {
	const race = RaceStore.getCurrent();
	const [ weight, size ] = Race.rerollWeight(race, ProfileStore.getSize());
	setWeight(weight, size);
};

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

export const deleteHero = () => console.error('REQUEST missing');

export const addAdventurePoints = (amount: number) => AppDispatcher.dispatch<AddAdventurePointsAction>({
	type: ActionTypes.ADD_ADVENTURE_POINTS,
	payload: {
		amount
	}
});
