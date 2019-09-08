import { ident } from "../../Data/Function";
import { over, set } from "../../Data/Lens";
import { modifyAt } from "../../Data/List";
import { Just } from "../../Data/Maybe";
import { adjust } from "../../Data/OrderedMap";
import { fst, snd } from "../../Data/Tuple";
import * as DisAdvActions from "../Actions/DisAdvActions";
import * as SpecialAbilitiesActions from "../Actions/SpecialAbilitiesActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { CombatTechniqueId, SpecialAbilityId } from "../Constants/Ids";
import { ActivatableActivationEntryType } from "../Models/Actions/ActivatableActivationEntryType";
import { ActivatableDeactivationEntryType } from "../Models/Actions/ActivatableDeactivationEntryType";
import { ActivatableDeactivationOptions } from "../Models/Actions/ActivatableDeactivationOptions";
import { ActivatableDependentL } from "../Models/ActiveEntries/ActivatableDependent";
import { ActiveObjectL } from "../Models/ActiveEntries/ActiveObject";
import { SkillDependentL } from "../Models/ActiveEntries/SkillDependent";
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import { activate, deactivate, setLevel } from "../Utilities/Activatable/activatableActivationUtils";
import { addAllStyleRelatedDependencies, removeAllStyleRelatedDependencies } from "../Utilities/Activatable/ExtendedStyleUtils";
import { pipe, pipe_ } from "../Utilities/pipe";

type Action = DisAdvActions.ActivateDisAdvAction
            | DisAdvActions.DeactivateDisAdvAction
            | DisAdvActions.SetDisAdvLevelAction
            | SpecialAbilitiesActions.ActivateSpecialAbilityAction
            | SpecialAbilitiesActions.DeactivateSpecialAbilityAction
            | SpecialAbilitiesActions.SetSpecialAbilityTierAction
            | SpecialAbilitiesActions.SetGuildMageUnfamiliarSpellIdAction

const AAETA = ActivatableActivationEntryType.A
const ADETA = ActivatableDeactivationEntryType.A
const ADOA = ActivatableDeactivationOptions.A
const HL = HeroModelL

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
          pipe_ (action.payload, fst, ADOA.id) === SpecialAbilityId.Feuerschlucker
            ? over (HeroModelL.combatTechniques)
                   (adjust (set (SkillDependentL.value) (6))
                           (CombatTechniqueId.Feuerspeien as string))
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

      case ActionTypes.SET_TRADITION_GUILD_MAGE_UNFAMILIAR_SPELL_ID: {
        return over (HL.specialAbilities)
                    (adjust (over (ActivatableDependentL.active)
                                  (modifyAt (0)
                                            (set (ActiveObjectL.sid)
                                                 (Just (action.payload.id)))))
                            (SpecialAbilityId.TraditionGuildMages as string))
      }

      default:
        return ident
    }
  }
