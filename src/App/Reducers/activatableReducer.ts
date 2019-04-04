import { ident } from "../../Data/Function";
import { over, set } from "../../Data/Lens";
import { adjust } from "../../Data/OrderedMap";
import { fst, snd } from "../../Data/Pair";
import * as DisAdvActions from "../Actions/DisAdvActions";
import * as SpecialAbilitiesActions from "../Actions/SpecialAbilitiesActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { ActivatableActivationEntryType } from "../Models/Actions/ActivatableActivationEntryType";
import { ActivatableDeactivationEntryType } from "../Models/Actions/ActivatableDeactivationEntryType";
import { ActivatableDeactivationOptions } from "../Models/Actions/ActivatableDeactivationOptions";
import { SkillDependentL } from "../Models/ActiveEntries/SkillDependent";
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import { activate, deactivate, setLevel } from "../Utilities/Activatable/activatableActivationUtils";
import { addAllStyleRelatedDependencies, removeAllStyleRelatedDependencies } from "../Utilities/Activatable/ExtendedStyleUtils";
import { prefixCT, prefixSA } from "../Utilities/IDUtils";
import { pipe, pipe_ } from "../Utilities/pipe";

type Action = DisAdvActions.ActivateDisAdvAction
            | DisAdvActions.DeactivateDisAdvAction
            | DisAdvActions.SetDisAdvLevelAction
            | SpecialAbilitiesActions.ActivateSpecialAbilityAction
            | SpecialAbilitiesActions.DeactivateSpecialAbilityAction
            | SpecialAbilitiesActions.SetSpecialAbilityTierAction

const AAETA = ActivatableActivationEntryType.A
const ADETA = ActivatableDeactivationEntryType.A
const ADOA = ActivatableDeactivationOptions.A

export const activatableReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ACTIVATE_DISADV: {
        return activate (fst (action.payload))
                        (AAETA.wikiEntry (snd (action.payload)))
                        (AAETA.heroEntry (snd (action.payload)))
      }

      case ActionTypes.ACTIVATE_SPECIALABILITY: {
        return pipe (
          addAllStyleRelatedDependencies (pipe_ (action.payload, snd, fst)),
          activate (fst (action.payload))
                   (pipe_ (action.payload, snd, fst))
                   (pipe_ (action.payload, snd, snd))
        )
      }

      case ActionTypes.DEACTIVATE_DISADV: {
        return deactivate (pipe_ (action.payload, fst, ADOA.index))
                          (ADETA.wikiEntry (snd (action.payload)))
                          (ADETA.heroEntry (snd (action.payload)))
      }

      case ActionTypes.DEACTIVATE_SPECIALABILITY: {
        return pipe (
          removeAllStyleRelatedDependencies (pipe_ (action.payload, snd, fst)),
          deactivate (pipe_ (action.payload, fst, ADOA.index))
                     (pipe_ (action.payload, snd, fst))
                     (pipe_ (action.payload, snd, snd)),
          pipe_ (action.payload, fst, ADOA.id) === prefixSA (109)
            ? over (HeroModelL.combatTechniques)
                   (adjust (set (SkillDependentL.value) (6))
                           (prefixCT (17)))
            : ident
        )
      }

      case ActionTypes.SET_DISADV_TIER: {
        return setLevel (pipe_ (action.payload, fst, e => e.index))
                        (pipe_ (action.payload, fst, e => e.tier))
                        (ADETA.wikiEntry (snd (action.payload)))
                        (ADETA.heroEntry (snd (action.payload)))
      }

      case ActionTypes.SET_SPECIALABILITY_TIER: {
        return setLevel (pipe_ (action.payload, fst, e => e.index))
                        (pipe_ (action.payload, fst, e => e.tier))
                        (pipe_ (action.payload, snd, fst))
                        (pipe_ (action.payload, snd, snd))
      }

      default:
        return ident
    }
  }
