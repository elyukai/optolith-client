import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import { ProfileStore } from '../stores/ProfileStore';
import { RaceStore } from '../stores/RaceStore';

export interface SetHeroNameAction extends Action {
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

export interface SetCustomProfessionNameAction extends Action {
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

export interface SetHeroAvatarAction extends Action {
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

export interface SetFamilyAction extends Action {
	type: ActionTypes.SET_FAMILY;
	payload: {
		family: string;
	};
}

export const setFamily = (family: string) => AppDispatcher.dispatch<SetFamilyAction>({
	type: ActionTypes.SET_FAMILY,
	payload: {
		family,
	},
});

export interface SetPlaceOfBirthAction extends Action {
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

export interface SetDateOfBirthAction extends Action {
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

export interface SetAgeAction extends Action {
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

export interface SetHairColorAction extends Action {
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

export interface SetEyeColorAction extends Action {
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

export interface SetSizeAction extends Action {
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

export interface SetWeightAction extends Action {
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

export const rerollHairColor = () => {
	const race = RaceStore.getCurrent();
	if (typeof race !== 'undefined') {
		const hairColor = RaceStore.rerollHairColor(race);
		setHairColor(hairColor);
	}
};

export const rerollEyeColor = () => {
	const race = RaceStore.getCurrent();
	if (typeof race !== 'undefined') {
		const eyeColor = RaceStore.rerollEyeColor(race);
		setEyeColor(eyeColor);
	}
};

export const rerollSize = () => {
	const race = RaceStore.getCurrent();
	if (typeof race !== 'undefined') {
		const size = RaceStore.rerollSize(race);
		setSize(size);
	}
};

export const rerollWeight = () => {
	const race = RaceStore.getCurrent();
	if (typeof race !== 'undefined') {
		const [ weight, size ] = RaceStore.rerollWeight(race, ProfileStore.getSize());
		setWeight(weight, size);
	}
};

export interface SetTitleAction extends Action {
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

export interface SetSocialStatusAction extends Action {
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

export interface SetCharacteristicsAction extends Action {
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

export interface SetOtherInfoAction extends Action {
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

export interface EndHeroCreationAction extends Action {
	type: ActionTypes.END_HERO_CREATION;
}

export const endHeroCreation = () => AppDispatcher.dispatch<EndHeroCreationAction>({
	type: ActionTypes.END_HERO_CREATION,
});

export interface AddAdventurePointsAction extends Action {
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
