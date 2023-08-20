import { ident } from "../../Data/Function"
import { over, set } from "../../Data/Lens"
import { modifyAt } from "../../Data/List"
import { Just } from "../../Data/Maybe"
import { adjust } from "../../Data/OrderedMap"
import { fst, snd } from "../../Data/Tuple"
import * as DisAdvActions from "../Actions/DisAdvActions"
import * as SpecialAbilitiesActions from "../Actions/SpecialAbilitiesActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { CombatTechniqueId, SpecialAbilityId } from "../Constants/Ids"
import { ActivatableActivationEntryType } from "../Models/Actions/ActivatableActivationEntryType"
import { ActivatableDeactivationEntryType } from "../Models/Actions/ActivatableDeactivationEntryType"
import { ActivatableDeactivationOptions } from "../Models/Actions/ActivatableDeactivationOptions"
import { ActivatableDependentL } from "../Models/ActiveEntries/ActivatableDependent"
import { ActiveObjectL } from "../Models/ActiveEntries/ActiveObject"
import { SkillDependentL } from "../Models/ActiveEntries/SkillDependent"
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel"
import {
  activate,
  deactivate,
  saveRule,
  setLevel,
} from "../Utilities/Activatable/activatableActivationUtils"
import { addOtherSpecialAbilityDependenciesOnActivation, removeOtherSpecialAbilityDependenciesOnDeletion } from "../Utilities/Activatable/SpecialAbilityUtils"
import { pipe, pipe_ } from "../Utilities/pipe"

type Action = DisAdvActions.ActivateDisAdvAction
            | DisAdvActions.DeactivateDisAdvAction
            | DisAdvActions.SetDisAdvLevelAction
            | DisAdvActions.SaveRuleAction
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
        return activate (action.payload.args)
                        (action.payload.staticData)
                        (AAETA.wikiEntry (action.payload.entryType))
                        (AAETA.heroEntry (action.payload.entryType))
      }

      case ActionTypes.ACTIVATE_SPECIALABILITY: {
        return pipe (
          addOtherSpecialAbilityDependenciesOnActivation (action),
          activate (action.payload.args)
                   (action.payload.staticData)
                   (fst (action.payload.entryType))
                   (snd (action.payload.entryType))
        )
      }

      case ActionTypes.DEACTIVATE_DISADV: {
        return deactivate (action.payload.staticData)
                          (ADOA.index (action.payload.args))
                          (ADETA.wikiEntry (action.payload.entryType))
                          (ADETA.heroEntry (action.payload.entryType))
      }

      case ActionTypes.DEACTIVATE_SPECIALABILITY: {
        return pipe (
          removeOtherSpecialAbilityDependenciesOnDeletion (action),
          deactivate (action.payload.staticData)
                     (ADOA.index (action.payload.args))
                     (fst (action.payload.entryType))
                     (snd (action.payload.entryType)),
          ADOA.id (action.payload.args) === SpecialAbilityId.Feuerschlucker
            ? over (HeroModelL.combatTechniques)
                   (adjust (set (SkillDependentL.value) (6))
                           (CombatTechniqueId.SpittingFire as string))
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

      case ActionTypes.SET_TRAD_GUILD_MAGE_UNFAM_SPELL_ID: {
        return over (HL.specialAbilities)
                    (adjust (over (ActivatableDependentL.active)
                                  (modifyAt (0)
                                            (set (ActiveObjectL.sid)
                                                 (Just (action.payload.id)))))
                            (SpecialAbilityId.TraditionGuildMages as string))
      }

      case ActionTypes.SET_CUSTOM_RULE: {
        return hero => saveRule (
          action.payload.rule,
          hero,
          action.payload.selector.index,
          action.payload.selector.currentId
        )
      }


      default:
        return ident
    }
  }
