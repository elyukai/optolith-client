import { ident } from "../../Data/Function";
import { over, set } from "../../Data/Lens";
import { isJust, Just, maybe_, Nothing } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { snd } from "../../Data/Tuple";
import * as DisAdvActions from "../Actions/DisAdvActions";
import * as ProfileActions from "../Actions/ProfileActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { ActivatableActivationEntryType } from "../Models/Actions/ActivatableActivationEntryType";
import { ActivatableDeactivationEntryType } from "../Models/Actions/ActivatableDeactivationEntryType";
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import { PersonalDataL } from "../Models/Hero/PersonalData";
import { composeL } from "../Utilities/compose";
import { pipe } from "../Utilities/pipe";

type Action = ProfileActions.SetHeroNameAction
            | ProfileActions.SetHeroAvatarAction
            | ProfileActions.DeleteHeroAvatarAction
            | ProfileActions.SetFamilyAction
            | ProfileActions.SetPlaceOfBirthAction
            | ProfileActions.SetDateOfBirthAction
            | ProfileActions.SetAgeAction
            | ProfileActions.SetHairColorAction
            | ProfileActions.SetEyeColorAction
            | ProfileActions.SetSizeAction
            | ProfileActions.SetWeightAction
            | ProfileActions.SetTitleAction
            | ProfileActions.SetSocialStatusAction
            | ProfileActions.SetCharacteristicsAction
            | ProfileActions.SetOtherInfoAction
            | ProfileActions.SetCultureAreaKnowledge
            | ProfileActions.SetCustomProfessionNameAction
            | ProfileActions.SetHeroLocaleAction
            | DisAdvActions.ActivateDisAdvAction
            | DisAdvActions.DeactivateDisAdvAction

const personalDataReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SET_FAMILY:
        return set (composeL (HeroModelL.personalData, PersonalDataL.family))
                   (Just (action.payload.family))

      case ActionTypes.SET_PLACEOFBIRTH:
        return set (composeL (HeroModelL.personalData, PersonalDataL.placeOfBirth))
                   (Just (action.payload.placeofbirth))

      case ActionTypes.SET_DATEOFBIRTH:
        return set (composeL (HeroModelL.personalData, PersonalDataL.dateOfBirth))
                   (Just (action.payload.dateofbirth))

      case ActionTypes.SET_AGE:
        return set (composeL (HeroModelL.personalData, PersonalDataL.age))
                   (Just (action.payload.age))

      case ActionTypes.SET_HAIRCOLOR:
        return set (composeL (HeroModelL.personalData, PersonalDataL.hairColor))
                   (Just (action.payload.haircolor))

      case ActionTypes.SET_EYECOLOR:
        return set (composeL (HeroModelL.personalData, PersonalDataL.eyeColor))
                   (Just (action.payload.eyecolor))

      case ActionTypes.SET_SIZE:
        return maybe_ (() => set (composeL (HeroModelL.personalData, PersonalDataL.size))
                                 (Just (action.payload.size)))
                      ((weight: string) => over (HeroModelL.personalData)
                                                (pipe (
                                                  set (PersonalDataL.size)
                                                      (Just (action.payload.size)),
                                                  set (PersonalDataL.weight)
                                                      (Just (weight))
                                                )))
                      (action.payload.weight)

      case ActionTypes.SET_WEIGHT:
          return maybe_ (() => set (composeL (HeroModelL.personalData, PersonalDataL.weight))
                                   (Just (action.payload.weight)))
                        ((size: string) => over (HeroModelL.personalData)
                                                  (pipe (
                                                    set (PersonalDataL.weight)
                                                        (Just (action.payload.weight)),
                                                    set (PersonalDataL.size)
                                                        (Just (size))
                                                  )))
                        (action.payload.size)

      case ActionTypes.SET_TITLE:
        return set (composeL (HeroModelL.personalData, PersonalDataL.title))
                   (Just (action.payload.title))

      case ActionTypes.SET_SOCIALSTATUS:
        return set (composeL (HeroModelL.personalData, PersonalDataL.socialStatus))
                   (Just (action.payload.socialstatus))

      case ActionTypes.SET_CHARACTERISTICS:
        return set (composeL (HeroModelL.personalData, PersonalDataL.characteristics))
                   (Just (action.payload.characteristics))

      case ActionTypes.SET_OTHERINFO:
        return set (composeL (HeroModelL.personalData, PersonalDataL.otherInfo))
                   (Just (action.payload.otherinfo))

      case ActionTypes.ACTIVATE_DISADV:
      case ActionTypes.DEACTIVATE_DISADV: {
        type EntryTypes = Record<ActivatableActivationEntryType>
                        | Record<ActivatableDeactivationEntryType>

        const eyeColor =
          ActivatableActivationEntryType.AL.eyeColor (snd<EntryTypes> (action.payload))

        const hairColor =
          ActivatableActivationEntryType.AL.hairColor (snd<EntryTypes> (action.payload))

        if (isJust (eyeColor) && isJust (hairColor)) {
          return over (HeroModelL.personalData)
                      (pipe (
                        set (PersonalDataL.eyeColor) (eyeColor),
                        set (PersonalDataL.hairColor) (hairColor)
                      ))
        }

        return ident
      }

      case ActionTypes.SET_CULTURE_AREA_KNOWLEDGE:
      return set (composeL (HeroModelL.personalData, PersonalDataL.cultureAreaKnowledge))
                 (Just (action.payload.cultureAreaKnowledge))

      default:
        return ident
    }
  }

export const profileReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SET_HERO_NAME:
        return set (HeroModelL.name) (action.payload.name)

      case ActionTypes.SET_CUSTOM_PROFESSION_NAME:
        return set (HeroModelL.professionName) (Just (action.payload.name))

      case ActionTypes.SET_HERO_AVATAR:
        return set (HeroModelL.avatar) (Just (action.payload.url))

      case ActionTypes.DELETE_HERO_AVATAR:
        return set (HeroModelL.avatar) (Nothing)

      case ActionTypes.SET_HERO_LOCALE:
        return set (HeroModelL.locale) (action.payload.locale)

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
        return personalDataReducer (action)

      default:
        return ident
    }
  }
