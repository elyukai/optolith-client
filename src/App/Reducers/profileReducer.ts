import * as DisAdvActions from '../Actions/DisAdvActions';
import * as ProfileActions from '../Actions/ProfileActions';
import { ActionTypes } from '../Constants/ActionTypes';
import * as Data from '../Models/Hero/heroTypeHelpers';
import { Record } from '../utils/dataUtils';

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
  DisAdvActions.ActivateDisAdvAction |
  DisAdvActions.DeactivateDisAdvAction;

export function personalDataReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_FAMILY:
      return state.modify<'personalData'> (
        profile => profile.insert ('family') (action.payload.family)
      ) ('personalData');

    case ActionTypes.SET_PLACEOFBIRTH:
      return state.modify<'personalData'> (
        profile => profile.insert ('placeOfBirth') (action.payload.placeofbirth)
      ) ('personalData');

    case ActionTypes.SET_DATEOFBIRTH:
      return state.modify<'personalData'> (
        profile => profile.insert ('dateOfBirth') (action.payload.dateofbirth)
      ) ('personalData');

    case ActionTypes.SET_AGE:
      return state.modify<'personalData'> (
        profile => profile.insert ('age') (action.payload.age)
      ) ('personalData');

    case ActionTypes.SET_HAIRCOLOR:
      return state.modify<'personalData'> (
        profile => profile.insert ('hairColor') (action.payload.haircolor)
      ) ('personalData');

    case ActionTypes.SET_EYECOLOR:
      return state.modify<'personalData'> (
        profile => profile.insert ('eyeColor') (action.payload.eyecolor)
      ) ('personalData');

    case ActionTypes.SET_SIZE: {
      if (typeof action.payload.weight === 'string') {
        return state.modify<'personalData'> (
          profile => profile
            .insert ('size') (action.payload.size)
            .insertMaybe ('weight') (action.payload.weight)
        ) ('personalData');
      }
      else {
        return state.modify<'personalData'> (
          profile => profile.insert ('size') (action.payload.size)
        ) ('personalData');
      }
    }

    case ActionTypes.SET_WEIGHT: {
      if (typeof action.payload.size === 'string') {
        return state.modify<'personalData'> (
          profile => profile
            .insert ('weight') (action.payload.weight)
            .insertMaybe ('size') (action.payload.size)
        ) ('personalData');
      }
      else {
        return state.modify<'personalData'> (
          profile => profile.insert ('weight') (action.payload.weight)
        ) ('personalData');
      }
    }

    case ActionTypes.SET_TITLE:
      return state.modify<'personalData'> (
        profile => profile.insert ('title') (action.payload.title)
      ) ('personalData');

    case ActionTypes.SET_SOCIALSTATUS:
      return state.modify<'personalData'> (
        profile => profile.insert ('socialStatus') (action.payload.socialstatus)
      ) ('personalData');

    case ActionTypes.SET_CHARACTERISTICS:
      return state.modify<'personalData'> (
        profile => profile.insert ('characteristics') (action.payload.characteristics)
      ) ('personalData');

    case ActionTypes.SET_OTHERINFO:
      return state.modify<'personalData'> (
        profile => profile.insert ('otherInfo') (action.payload.otherinfo)
      ) ('personalData');

    case ActionTypes.ACTIVATE_DISADV:
    case ActionTypes.DEACTIVATE_DISADV: {
      const { eyeColor, hairColor } = action.payload;

      if (typeof eyeColor === 'number' && typeof hairColor === 'number') {
        return state.modify<'personalData'> (
          profile => profile
            .insert ('eyeColor') (eyeColor)
            .insert ('hairColor') (hairColor)
        ) ('personalData');
      }

      return state;
    }

    case ActionTypes.SET_CULTURE_AREA_KNOWLEDGE:
      return state.modify<'personalData'> (
        profile => profile.insert ('cultureAreaKnowledge') (action.payload.cultureAreaKnowledge)
      ) ('personalData');

    default:
      return state;
  }
}

export function profileReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_HERO_NAME:
      return state.insert ('name') (action.payload.name);

    case ActionTypes.SET_CUSTOM_PROFESSION_NAME:
      return state.insert ('professionName') (action.payload.name);

    case ActionTypes.SET_HERO_AVATAR:
      return state.insert ('avatar') (action.payload.url);

    case ActionTypes.SET_FAMILY:
    case ActionTypes.SET_PLACEOFBIRTH:
    case ActionTypes.SET_DATEOFBIRTH:
    case ActionTypes.SET_AGE:
    case ActionTypes.SET_HAIRCOLOR:
    case ActionTypes.SET_EYECOLOR:
    case ActionTypes.SET_SIZE:
    case ActionTypes.SET_WEIGHT:
    case ActionTypes.SET_TITLE:
    case ActionTypes.SET_SOCIALSTATUS:
    case ActionTypes.SET_CHARACTERISTICS:
    case ActionTypes.SET_OTHERINFO:
    case ActionTypes.ACTIVATE_DISADV:
    case ActionTypes.DEACTIVATE_DISADV:
    case ActionTypes.SET_CULTURE_AREA_KNOWLEDGE:
      return personalDataReducer (state, action);

    default:
      return state;
  }
}
