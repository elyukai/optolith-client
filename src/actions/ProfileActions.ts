import * as ActionTypes from '../constants/ActionTypes';

export interface SetHeroAvatarAction {
	type: ActionTypes.SET_HERO_AVATAR;
	payload: {
		url: string;
	};
}

export const setHeroAvatar = (url: string): SetHeroAvatarAction => ({
	type: ActionTypes.SET_HERO_AVATAR,
	payload: {
		url
	}
});

export interface SetFamilyAction {
	type: ActionTypes.SET_FAMILY;
	payload: {
		family: string;
	};
}

export const setFamily = (family: string): SetFamilyAction => ({
	type: ActionTypes.SET_FAMILY,
	payload: {
		family
	}
});

export interface SetPlaceOfBirthAction {
	type: ActionTypes.SET_PLACEOFBIRTH;
	payload: {
		placeofbirth: string;
	};
}

export const setPlaceOfBirth = (placeofbirth: string): SetPlaceOfBirthAction => ({
	type: ActionTypes.SET_PLACEOFBIRTH,
	payload: {
		placeofbirth
	}
});

export interface SetDateOfBirthAction {
	type: ActionTypes.SET_DATEOFBIRTH;
	payload: {
		dateofbirth: string;
	};
}

export const setDateOfBirth = (dateofbirth: string): SetDateOfBirthAction => ({
	type: ActionTypes.SET_DATEOFBIRTH,
	payload: {
		dateofbirth
	}
});

export interface SetAgeAction {
	type: ActionTypes.SET_AGE;
	payload: {
		age: string;
	};
}

export const setAge = (age: string): SetAgeAction => ({
	type: ActionTypes.SET_AGE,
	payload: {
		age
	}
});

export interface SetHairColorAction {
	type: ActionTypes.SET_HAIRCOLOR;
	payload: {
		haircolor: number;
	};
}

export const setHairColor = (haircolor: number): SetHairColorAction => ({
	type: ActionTypes.SET_HAIRCOLOR,
	payload: {
		haircolor
	}
});

export interface SetEyeColorAction {
	type: ActionTypes.SET_EYECOLOR;
	payload: {
		eyecolor: number;
	};
}

export const setEyeColor = (eyecolor: number): SetEyeColorAction => ({
	type: ActionTypes.SET_EYECOLOR,
	payload: {
		eyecolor
	}
});

export interface SetSizeAction {
	type: ActionTypes.SET_SIZE;
	payload: {
		size: string;
	};
}

export const setSize = (size: string): SetSizeAction => ({
	type: ActionTypes.SET_SIZE,
	payload: {
		size
	}
});

export interface SetWeightAction {
	type: ActionTypes.SET_WEIGHT;
	payload: {
		weight: string;
	};
}

export const setWeight = (weight: string): SetWeightAction => ({
	type: ActionTypes.SET_WEIGHT,
	payload: {
		weight
	}
});

export interface SetTitleAction {
	type: ActionTypes.SET_TITLE;
	payload: {
		title: string;
	};
}

export const setTitle = (title: string): SetTitleAction => ({
	type: ActionTypes.SET_TITLE,
	payload: {
		title
	}
});

export interface SetSocialStatusAction {
	type: ActionTypes.SET_SOCIALSTATUS;
	payload: {
		socialstatus: number;
	};
}

export const setSocialStatus = (socialstatus: number): SetSocialStatusAction => ({
	type: ActionTypes.SET_SOCIALSTATUS,
	payload: {
		socialstatus
	}
});

export interface SetCharacteristicsAction {
	type: ActionTypes.SET_CHARACTERISTICS;
	payload: {
		characteristics: string;
	};
}

export const setCharacteristics = (characteristics: string): SetCharacteristicsAction => ({
	type: ActionTypes.SET_CHARACTERISTICS,
	payload: {
		characteristics
	}
});

export interface SetOtherInfoAction {
	type: ActionTypes.SET_OTHERINFO;
	payload: {
		otherinfo: string;
	};
}

export const setOtherInfo = (otherinfo: string): SetOtherInfoAction => ({
	type: ActionTypes.SET_OTHERINFO,
	payload: {
		otherinfo
	}
});

export interface EndHeroCreationAction {
	type: ActionTypes.END_HERO_CREATION;
}

export const endHeroCreation = (): EndHeroCreationAction => ({
	type: ActionTypes.END_HERO_CREATION
});

export interface AddAdventurePointsAction {
	type: ActionTypes.ADD_ADVENTURE_POINTS;
	payload: {
		amount: number;
	};
}

export const addAdventurePoints = (amount: number): AddAdventurePointsAction => ({
	type: ActionTypes.ADD_ADVENTURE_POINTS,
	payload: {
		amount
	}
});
