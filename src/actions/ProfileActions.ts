import { ActionTypes } from '../constants/ActionTypes';
import { isAlbino } from '../selectors/activatableSelectors';
import { getCurrentRace, getCurrentRaceVariant } from '../selectors/rcpSelectors';
import { getSize, getWeight } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { Just, Maybe, Nothing } from '../utils/dataUtils';
import * as RCPUtils from '../utils/rcpUtils';

export interface SetHeroNameAction {
  type: ActionTypes.SET_HERO_NAME;
  payload: {
    name: string;
  };
}

export const setHeroName = (name: string): SetHeroNameAction => ({
  type: ActionTypes.SET_HERO_NAME,
  payload: {
    name,
  },
});

export interface SetCustomProfessionNameAction {
  type: ActionTypes.SET_CUSTOM_PROFESSION_NAME;
  payload: {
    name: string;
  };
}

export const setCustomProfessionName = (name: string): SetCustomProfessionNameAction => ({
  type: ActionTypes.SET_CUSTOM_PROFESSION_NAME,
  payload: {
    name,
  },
});

export interface SetHeroAvatarAction {
  type: ActionTypes.SET_HERO_AVATAR;
  payload: {
    url: string;
  };
}

export const setHeroAvatar = (path: string): SetHeroAvatarAction => ({
  type: ActionTypes.SET_HERO_AVATAR,
  payload: {
    url: path,
  },
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
    family,
  },
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
    placeofbirth,
  },
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
    dateofbirth,
  },
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
    age,
  },
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
    haircolor,
  },
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
    eyecolor,
  },
});

export interface SetSizeAction {
  type: ActionTypes.SET_SIZE;
  payload: {
    size: string;
    weight: Maybe<string>;
  };
}

export const setSize = (size: string) => (weight: Maybe<string>): SetSizeAction => ({
  type: ActionTypes.SET_SIZE,
  payload: {
    size,
    weight,
  },
});

export interface SetWeightAction {
  type: ActionTypes.SET_WEIGHT;
  payload: {
    size: Maybe<string>;
    weight: string;
  };
}

export const setWeight = (weight: string) => (size: Maybe<string>): SetWeightAction => ({
  type: ActionTypes.SET_WEIGHT,
  payload: {
    size,
    weight,
  },
});

export const rerollHairColor = (): AsyncAction => (dispatch, getState) => {
  const state = getState ();
  const race = getCurrentRace (state);
  const raceVariant = getCurrentRaceVariant (state);

  const maybeHairColor = RCPUtils.rerollHairColor (race, raceVariant);

  if (Maybe.isJust (maybeHairColor)) {
    dispatch (setHairColor (Maybe.fromJust (maybeHairColor)));
  }
};

export const rerollEyeColor = (): AsyncAction => (dispatch, getState) => {
  const state = getState ();
  const race = getCurrentRace (state);
  const raceVariant = getCurrentRaceVariant (state);
  const isAlbinoVar = Maybe.fromMaybe (false) (isAlbino (state));

  const maybeEyeColor = RCPUtils.rerollEyeColor (race, raceVariant, isAlbinoVar);

  if (Maybe.isJust (maybeEyeColor)) {
    dispatch (setEyeColor (Maybe.fromJust (maybeEyeColor)));
  }
};

export const rerollSize = (): AsyncAction => (dispatch, getState) => {
  const state = getState ();
  const race = getCurrentRace (state);
  const raceVariant = getCurrentRaceVariant (state);

  const maybePrevSize = getSize (state);
  const maybeWeight = getWeight (state);
  const maybeNewSize = RCPUtils.rerollSize (race, raceVariant);

  if (Maybe.isJust (maybeNewSize)) {
    if (Maybe.isJust (maybePrevSize) && Maybe.isJust (maybeWeight)) {
      const newWeight = RCPUtils.getWeightForRerolledSize (
        Maybe.fromJust (maybeWeight),
        Maybe.fromJust (maybePrevSize),
        Maybe.fromJust (maybeNewSize)
      );

      dispatch (setSize (Maybe.fromJust (maybeNewSize)) (Just (newWeight)));
    }
    else {
      dispatch (setSize (Maybe.fromJust (maybeNewSize)) (Nothing ()));
    }
  }
};

export const rerollWeight = (): AsyncAction => (dispatch, getState) => {
  const state = getState ();
  const race = getCurrentRace (state);
  const raceVariant = getCurrentRaceVariant (state);
  const prevSize = getSize (state);

  const { weight, size } = RCPUtils.rerollWeight (race, raceVariant, prevSize);

  if (Maybe.isJust (weight)) {
    dispatch (setWeight (Maybe.fromJust (weight)) (size));
  }
};

export interface SetTitleAction {
  type: ActionTypes.SET_TITLE;
  payload: {
    title: string;
  };
}

export const setTitle = (title: string): SetTitleAction => ({
  type: ActionTypes.SET_TITLE,
  payload: {
    title,
  },
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
    socialstatus,
  },
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
    characteristics,
  },
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
    otherinfo,
  },
});

export interface SetCultureAreaKnowledge {
  type: ActionTypes.SET_CULTURE_AREA_KNOWLEDGE;
  payload: {
    cultureAreaKnowledge: string;
  };
}

export const setCultureAreaKnowledge = (cultureAreaKnowledge: string): SetCultureAreaKnowledge => ({
  type: ActionTypes.SET_CULTURE_AREA_KNOWLEDGE,
  payload: {
    cultureAreaKnowledge,
  },
});

export interface EndHeroCreationAction {
  type: ActionTypes.END_HERO_CREATION;
}

export const endHeroCreation = (): EndHeroCreationAction => ({
  type: ActionTypes.END_HERO_CREATION,
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
    amount,
  },
});
