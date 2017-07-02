import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../reducers/dependentInstances';
import { store } from '../stores/AppStore';
import { RaceInstance } from '../types/data.d';
import * as RCPUtils from '../utils/RCPUtils';

export interface SetHeroNameAction {
	type: ActionTypes.SET_HERO_NAME;
	payload: {
		name: string;
	};
}

export const setHeroName = (name: string) => AppDispatcher.dispatch<SetHeroNameAction>({
	type: ActionTypes.SET_HERO_NAME,
	payload: {
		name,
	},
});

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

export const setCustomProfessionName = (name: string) => AppDispatcher.dispatch<SetCustomProfessionNameAction>({
	type: ActionTypes.SET_CUSTOM_PROFESSION_NAME,
	payload: {
		name,
	},
});

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

export const setHeroAvatar = (path: string) => {
	AppDispatcher.dispatch<SetHeroAvatarAction>({
		type: ActionTypes.SET_HERO_AVATAR,
		payload: {
			url: path,
		},
	});
};

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

export const setFamily = (family: string) => AppDispatcher.dispatch<SetFamilyAction>({
	type: ActionTypes.SET_FAMILY,
	payload: {
		family
	}
});

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

export const setPlaceOfBirth = (placeofbirth: string) => AppDispatcher.dispatch<SetPlaceOfBirthAction>({
	type: ActionTypes.SET_PLACEOFBIRTH,
	payload: {
		placeofbirth,
	},
});

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

export const setDateOfBirth = (dateofbirth: string) => AppDispatcher.dispatch<SetDateOfBirthAction>({
	type: ActionTypes.SET_DATEOFBIRTH,
	payload: {
		dateofbirth,
	},
});

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

export const setAge = (age: string) => AppDispatcher.dispatch<SetAgeAction>({
	type: ActionTypes.SET_AGE,
	payload: {
		age,
	},
});

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

export const setHairColor = (haircolor: number) => AppDispatcher.dispatch<SetHairColorAction>({
	type: ActionTypes.SET_HAIRCOLOR,
	payload: {
		haircolor,
	},
});

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

export const setEyeColor = (eyecolor: number) => AppDispatcher.dispatch<SetEyeColorAction>({
	type: ActionTypes.SET_EYECOLOR,
	payload: {
		eyecolor,
	},
});

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

export const setSize = (size: string) => AppDispatcher.dispatch<SetSizeAction>({
	type: ActionTypes.SET_SIZE,
	payload: {
		size,
	},
});

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

export const setWeight = (weight: string, size?: string) => AppDispatcher.dispatch<SetWeightAction>({
	type: ActionTypes.SET_WEIGHT,
	payload: {
		size,
		weight,
	},
});

export function _setWeight(weight: string, size?: string): SetWeightAction {
	return {
		type: ActionTypes.SET_WEIGHT,
		payload: {
			size,
			weight
		}
	};
}

export const rerollHairColor = () => {
	const race = RaceStore.getCurrent();
	if (typeof race !== 'undefined') {
		const hairColor = RaceStore.rerollHairColor(race);
		setHairColor(hairColor);
	}
};

export function _rerollHairColor(): SetHairColorAction | undefined {
	const { dependent, rcp: { race: raceId }} = store.getState().currentHero.present;
	const race = raceId ? get(dependent, raceId) as RaceInstance | undefined : undefined;
	if (typeof race !== 'undefined') {
		const hairColor = RCPUtils.rerollHairColor(race);
		return _setHairColor(hairColor);
	}
	return;
}

export const rerollEyeColor = () => {
	const race = RaceStore.getCurrent();
	if (typeof race !== 'undefined') {
		const eyeColor = RaceStore.rerollEyeColor(race);
		setEyeColor(eyeColor);
	}
};

export function _rerollEyeColor(): SetEyeColorAction | undefined {
	const { dependent, rcp: { race: raceId }} = store.getState().currentHero.present;
	const race = raceId ? get(dependent, raceId) as RaceInstance | undefined : undefined;
	if (typeof race !== 'undefined') {
		const eyeColor = RCPUtils.rerollEyeColor(race);
		return _setEyeColor(eyeColor);
	}
	return;
}

export const rerollSize = () => {
	const race = RaceStore.getCurrent();
	if (typeof race !== 'undefined') {
		const size = RaceStore.rerollSize(race);
		setSize(size);
	}
};

export function _rerollSize(): SetSizeAction | undefined {
	const { dependent, rcp: { race: raceId }} = store.getState().currentHero.present;
	const race = raceId ? get(dependent, raceId) as RaceInstance | undefined : undefined;
	if (typeof race !== 'undefined') {
		const size = RCPUtils.rerollSize(race);
		return _setSize(size);
	}
	return;
}

export const rerollWeight = () => {
	const race = RaceStore.getCurrent();
	if (typeof race !== 'undefined') {
		const [ weight, size ] = RaceStore.rerollWeight(race, ProfileStore.getSize());
		setWeight(weight, size);
	}
};

export function _rerollWeight(): SetWeightAction | undefined {
	const { dependent, profile: { size: prevSize }, rcp: { race: raceId }} = store.getState().currentHero.present;
	const race = raceId ? get(dependent, raceId) as RaceInstance | undefined : undefined;
	if (typeof race !== 'undefined') {
		const [ weight, size ] = RCPUtils.rerollWeight(race, prevSize);
		return _setWeight(weight, size);
	}
	return;
}

export interface SetTitleAction {
	type: ActionTypes.SET_TITLE;
	payload: {
		title: string;
	};
}

export const setTitle = (title: string) => AppDispatcher.dispatch<SetTitleAction>({
	type: ActionTypes.SET_TITLE,
	payload: {
		title,
	},
});

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

export const setSocialStatus = (socialstatus: number) => AppDispatcher.dispatch<SetSocialStatusAction>({
	type: ActionTypes.SET_SOCIALSTATUS,
	payload: {
		socialstatus,
	},
});

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

export const setCharacteristics = (characteristics: string) => AppDispatcher.dispatch<SetCharacteristicsAction>({
	type: ActionTypes.SET_CHARACTERISTICS,
	payload: {
		characteristics,
	},
});

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

export const setOtherInfo = (otherinfo: string) => AppDispatcher.dispatch<SetOtherInfoAction>({
	type: ActionTypes.SET_OTHERINFO,
	payload: {
		otherinfo,
	},
});

export function _setOtherInfo(otherinfo: string): SetOtherInfoAction {
	return {
		type: ActionTypes.SET_OTHERINFO,
		payload: {
			otherinfo
		}
	};
}

export interface SetCultureAreaKnowledge extends Action {
	type: ActionTypes.SET_CULTURE_AREA_KNOWLEDGE;
	payload: {
		cultureAreaKnowledge: string;
	};
}

export const setCultureAreaKnowledge = (cultureAreaKnowledge: string) => AppDispatcher.dispatch<SetCultureAreaKnowledge>({
	type: ActionTypes.SET_CULTURE_AREA_KNOWLEDGE,
	payload: {
		cultureAreaKnowledge,
	},
});

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

export const endHeroCreation = () => AppDispatcher.dispatch<EndHeroCreationAction>({
	type: ActionTypes.END_HERO_CREATION,
});

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

export const addAdventurePoints = (amount: number) => AppDispatcher.dispatch<AddAdventurePointsAction>({
	type: ActionTypes.ADD_ADVENTURE_POINTS,
	payload: {
		amount,
	},
});

export function _addAdventurePoints(amount: number): AddAdventurePointsAction {
	return {
		type: ActionTypes.ADD_ADVENTURE_POINTS,
		payload: {
			amount
		}
	};
}
