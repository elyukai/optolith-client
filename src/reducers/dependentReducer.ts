import * as AttributesActions from '../actions/AttributesActions';
import * as CombatTechniquesActions from '../actions/CombatTechniquesActions';
import * as DisAdvActions from '../actions/DisAdvActions';
import * as HerolistActions from '../actions/HerolistActions';
import * as LiturgicalChantActions from '../actions/LiturgicalChantActions';
import * as SkillActions from '../actions/SkillActions';
import * as SpecialAbilitiesActions from '../actions/SpecialAbilitiesActions';
import * as SpellsActions from '../actions/SpellsActions';
import * as Data from '../App/Models/Hero/heroTypeHelpers';
import { ActionTypes } from '../constants/ActionTypes';
import { Record } from '../utils/dataUtils';
import { activatableReducer } from './activatableReducer';
import { increasableReducer } from './increasableReducer';
type Action =
  AttributesActions.AddAttributePointAction |
  AttributesActions.RemoveAttributePointAction |
  AttributesActions.SetAdjustmentIdAction |
  CombatTechniquesActions.AddCombatTechniquePointAction |
  CombatTechniquesActions.RemoveCombatTechniquePointAction |
  HerolistActions.CreateHeroAction |
  HerolistActions.LoadHeroAction |
  LiturgicalChantActions.ActivateLiturgicalChantAction |
  LiturgicalChantActions.AddLiturgicalChantPointAction |
  LiturgicalChantActions.DeactivateLiturgyAction |
  LiturgicalChantActions.RemoveLiturgicalChantPointAction |
  LiturgicalChantActions.ActivateBlessingAction |
  LiturgicalChantActions.DeactivateBlessingAction |
  SpellsActions.ActivateSpellAction |
  SpellsActions.AddSpellPointAction |
  SpellsActions.DeactivateSpellAction |
  SpellsActions.RemoveSpellPointAction |
  SpellsActions.ActivateCantripAction |
  SpellsActions.DeactivateCantripAction |
  SkillActions.AddSkillPointAction |
  SkillActions.RemoveSkillPointAction |
  DisAdvActions.ActivateDisAdvAction |
  DisAdvActions.DeactivateDisAdvAction |
  DisAdvActions.SetDisAdvTierAction |
  SpecialAbilitiesActions.ActivateSpecialAbilityAction |
  SpecialAbilitiesActions.DeactivateSpecialAbilityAction |
  SpecialAbilitiesActions.SetSpecialAbilityTierAction;

export function dependentReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
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
      return increasableReducer (state, action);

    case ActionTypes.ACTIVATE_DISADV:
    case ActionTypes.ACTIVATE_SPECIALABILITY:
    case ActionTypes.DEACTIVATE_DISADV:
    case ActionTypes.DEACTIVATE_SPECIALABILITY:
    case ActionTypes.SET_DISADV_TIER:
    case ActionTypes.SET_SPECIALABILITY_TIER:
      return activatableReducer (state, action);

    case ActionTypes.SET_ATTRIBUTE_ADJUSTMENT_SELECTION_ID:
      return state .insert ('attributeAdjustmentSelected') (action.payload.id);

    default:
      return state;
  }
}
