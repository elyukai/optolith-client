import { ident } from "../../Data/Function"
import { set } from "../../Data/Lens"
import * as AttributesActions from "../Actions/AttributesActions"
import * as CombatTechniquesActions from "../Actions/CombatTechniquesActions"
import * as DisAdvActions from "../Actions/DisAdvActions"
import * as HerolistActions from "../Actions/HerolistActions"
import * as LiturgicalChantActions from "../Actions/LiturgicalChantActions"
import * as SkillActions from "../Actions/SkillActions"
import * as SpecialAbilitiesActions from "../Actions/SpecialAbilitiesActions"
import * as SpellsActions from "../Actions/SpellsActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel"
import { activatableReducer } from "./activatableReducer"
import { increasableReducer } from "./increasableReducer"

type Action = AttributesActions.AddAttributePointAction
            | AttributesActions.RemoveAttributePointAction
            | AttributesActions.SetAdjustmentIdAction
            | CombatTechniquesActions.AddCombatTechniquePointAction
            | CombatTechniquesActions.RemoveCombatTechniquePointAction
            | HerolistActions.CreateHeroAction
            | HerolistActions.LoadHeroAction
            | LiturgicalChantActions.ActivateLiturgicalChantAction
            | LiturgicalChantActions.AddLiturgicalChantPointAction
            | LiturgicalChantActions.DeactivateLiturgyAction
            | LiturgicalChantActions.RemoveLiturgicalChantPointAction
            | LiturgicalChantActions.ActivateBlessingAction
            | LiturgicalChantActions.DeactivateBlessingAction
            | SpellsActions.ActivateSpellAction
            | SpellsActions.AddSpellPointAction
            | SpellsActions.DeactivateSpellAction
            | SpellsActions.RemoveSpellPointAction
            | SpellsActions.ActivateCantripAction
            | SpellsActions.DeactivateCantripAction
            | SkillActions.AddSkillPointAction
            | SkillActions.RemoveSkillPointAction
            | DisAdvActions.ActivateDisAdvAction
            | DisAdvActions.DeactivateDisAdvAction
            | DisAdvActions.SetDisAdvLevelAction
            | DisAdvActions.SaveRuleAction
            | SpecialAbilitiesActions.ActivateSpecialAbilityAction
            | SpecialAbilitiesActions.DeactivateSpecialAbilityAction
            | SpecialAbilitiesActions.SetSpecialAbilityTierAction
            | SpecialAbilitiesActions.SetGuildMageUnfamiliarSpellIdAction

const { attributeAdjustmentSelected } = HeroModelL

export const dependentReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ACTIVATE_SPELL:
      case ActionTypes.ACTIVATE_LITURGY:
      case ActionTypes.ACTIVATE_CANTRIP:
      case ActionTypes.ACTIVATE_BLESSING:
      case ActionTypes.DEACTIVATE_SPELL:
      case ActionTypes.DEACTIVATE_LITURGY:
      case ActionTypes.DEACTIVATE_CANTRIP:
      case ActionTypes.DEACTIVATE_BLESSING:
      case ActionTypes.ADD_ATTRIBUTE_POINT:
      case ActionTypes.ADD_TALENT_POINT:
      case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
      case ActionTypes.ADD_SPELL_POINT:
      case ActionTypes.ADD_LITURGY_POINT:
      case ActionTypes.REMOVE_ATTRIBUTE_POINT:
      case ActionTypes.REMOVE_TALENT_POINT:
      case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
      case ActionTypes.REMOVE_SPELL_POINT:
      case ActionTypes.REMOVE_LITURGY_POINT:
        return increasableReducer (action)

      case ActionTypes.ACTIVATE_DISADV:
      case ActionTypes.ACTIVATE_SPECIALABILITY:
      case ActionTypes.DEACTIVATE_DISADV:
      case ActionTypes.DEACTIVATE_SPECIALABILITY:
      case ActionTypes.SET_CUSTOM_RULE:
      case ActionTypes.SET_DISADV_TIER:
      case ActionTypes.SET_SPECIALABILITY_TIER:
      case ActionTypes.SET_TRAD_GUILD_MAGE_UNFAM_SPELL_ID:
        return activatableReducer (action)

      case ActionTypes.SET_ATTR_ADJUSTMENT_SID:
        return set (attributeAdjustmentSelected) (action.payload.id)

      default:
        return ident
    }
  }
