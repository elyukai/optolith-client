import { SetAgeAction, SetCharacteristicsAction, SetDateOfBirthAction, SetEyeColorAction, SetFamilyAction, SetHairColorAction, SetOtherInfoAction, SetPlaceOfBirthAction, SetSizeAction, SetSocialStatusAction, SetTitleAction, SetWeightAction } from '../actions/ProfileActions';
import { ReceiveHeroDataAction } from '../actions/ServerActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = ReceiveHeroDataAction | SetAgeAction | SetCharacteristicsAction | SetDateOfBirthAction | SetEyeColorAction | SetFamilyAction | SetHairColorAction | SetOtherInfoAction | SetPlaceOfBirthAction | SetSizeAction | SetSocialStatusAction | SetTitleAction | SetWeightAction;

export interface InfoState {
	readonly family: string;
	readonly placeofbirth: string;
	readonly dateofbirth: string;
	readonly age: string;
	readonly haircolor: number;
	readonly eyecolor: number;
	readonly size: string;
	readonly weight: string;
	readonly title: string;
	readonly socialstatus: number;
	readonly characteristics: string;
	readonly otherinfo: string;
}

const initialState = <InfoState>{
	family: '',
	placeofbirth: '',
	dateofbirth: '',
	age: '',
	haircolor: 0,
	eyecolor: 0,
	size: '',
	weight: '',
	title: '',
	socialstatus: 0,
	characteristics: '',
	otherinfo: ''
};

export default (state: InfoState = initialState, action: Action): InfoState => {
	switch (action.type) {
		case ActionTypes.RECEIVE_HERO_DATA:
			return { ...action.payload.data.pers };

		case ActionTypes.SET_FAMILY:
			return { ...state, family: action.payload.family };

		case ActionTypes.SET_PLACEOFBIRTH:
			return { ...state, placeofbirth: action.payload.placeofbirth };

		case ActionTypes.SET_DATEOFBIRTH:
			return { ...state, dateofbirth: action.payload.dateofbirth };

		case ActionTypes.SET_AGE:
			return { ...state, age: action.payload.age };

		case ActionTypes.SET_HAIRCOLOR:
			return { ...state, haircolor: action.payload.haircolor };

		case ActionTypes.SET_EYECOLOR:
			return { ...state, eyecolor: action.payload.eyecolor };

		case ActionTypes.SET_SIZE:
			return { ...state, size: action.payload.size };

		case ActionTypes.SET_WEIGHT:
			return { ...state, weight: action.payload.weight };

		case ActionTypes.SET_TITLE:
			return { ...state, title: action.payload.title };

		case ActionTypes.SET_SOCIALSTATUS:
			return { ...state, socialstatus: action.payload.socialstatus };

		case ActionTypes.SET_CHARACTERISTICS:
			return { ...state, characteristics: action.payload.characteristics };

		case ActionTypes.SET_OTHERINFO:
			return { ...state, otherinfo: action.payload.otherinfo };

		default:
			return state;
	}
};
