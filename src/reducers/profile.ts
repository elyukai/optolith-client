import * as DisAdvActions from '../actions/DisAdvActions';
import * as HerolistActions from '../actions/HerolistActions';
import * as ProfileActions from '../actions/ProfileActions';
import { ActionTypes } from '../constants/ActionTypes';

type Action =
  ProfileActions.SetHeroNameAction |
  ProfileActions.SetHeroAvatarAction |
  ProfileActions.SetFamilyAction |
  ProfileActions.SetPlaceOfBirthAction |
  ProfileActions.SetDateOfBirthAction |
  ProfileActions.SetAgeAction |
  ProfileActions.SetHairColorAction |
  ProfileActions.SetEyeColorAction |
  ProfileActions.SetSizeAction |
  ProfileActions.SetWeightAction |
  ProfileActions.SetTitleAction |
  ProfileActions.SetSocialStatusAction |
  ProfileActions.SetCharacteristicsAction |
  ProfileActions.SetOtherInfoAction |
  ProfileActions.SetCultureAreaKnowledge |
  ProfileActions.SetCustomProfessionNameAction |
  HerolistActions.CreateHeroAction |
  HerolistActions.LoadHeroAction |
  DisAdvActions.ActivateDisAdvAction |
  DisAdvActions.DeactivateDisAdvAction;

export interface ProfileState {
  name?: string;
  dateCreated?: Date;
  dateModified?: Date;
  professionName?: string;
  sex?: 'm' | 'f';
  avatar?: string;
  family?: string;
  placeofbirth?: string;
  dateofbirth?: string;
  age?: string;
  haircolor?: number;
  eyecolor?: number;
  size?: string;
  weight?: string;
  title?: string;
  socialstatus?: number;
  characteristics?: string;
  otherinfo?: string;
  cultureAreaKnowledge?: string;
}

const initialState: ProfileState = {};

export function profile(state: ProfileState = initialState, action: Action): ProfileState {
  switch (action.type) {
    case ActionTypes.CREATE_HERO:
      return {
        name: action.payload.name,
        sex: action.payload.sex
      };

    case ActionTypes.LOAD_HERO:
      return {
        name: action.payload.data.name,
        professionName: action.payload.data.professionName,
        dateCreated: action.payload.data.dateCreated,
        dateModified: action.payload.data.dateModified,
        sex: action.payload.data.sex,
        avatar: action.payload.data.avatar,
        ...action.payload.data.pers
      };

    case ActionTypes.SET_HERO_NAME:
      return { ...state, name: action.payload.name };

    case ActionTypes.SET_CUSTOM_PROFESSION_NAME:
      return { ...state, professionName: action.payload.name };

    case ActionTypes.SET_HERO_AVATAR:
      return { ...state, avatar: action.payload.url };

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
      if (action.payload.weight) {
        return { ...state, weight: action.payload.weight, size: action.payload.size };
      }
      return { ...state, size: action.payload.size };

    case ActionTypes.SET_WEIGHT:
      if (action.payload.size) {
        return { ...state, weight: action.payload.weight, size: action.payload.size };
      }
      return { ...state, weight: action.payload.weight };

    case ActionTypes.SET_TITLE:
      return { ...state, title: action.payload.title };

    case ActionTypes.SET_SOCIALSTATUS:
      return { ...state, socialstatus: action.payload.socialstatus };

    case ActionTypes.SET_CHARACTERISTICS:
      return { ...state, characteristics: action.payload.characteristics };

    case ActionTypes.SET_OTHERINFO:
      return { ...state, otherinfo: action.payload.otherinfo };

    case ActionTypes.ACTIVATE_DISADV:
    case ActionTypes.DEACTIVATE_DISADV: {
      const { eyeColor, hairColor } = action.payload;
      if (typeof eyeColor === 'number' && typeof hairColor === 'number') {
        return {
          ...state,
          eyecolor: eyeColor,
          haircolor: hairColor,
        };
      }
      return state;
    }

    case ActionTypes.SET_CULTURE_AREA_KNOWLEDGE:
      return { ...state, cultureAreaKnowledge: action.payload.cultureAreaKnowledge };

    default:
      return state;
  }
}
