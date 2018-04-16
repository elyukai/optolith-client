import * as AttributesActions from '../actions/AttributesActions';
import * as CombatTechniquesActions from '../actions/CombatTechniquesActions';
import * as LiturgiesActions from '../actions/LiturgiesActions';
import * as SpellsActions from '../actions/SpellsActions';
import * as TalentsActions from '../actions/TalentsActions';
import { ActionTypes } from '../constants/ActionTypes';
import { addDependencies, removeDependencies } from '../utils/DependentUtils';
import { mergeIntoState, setStateItem } from '../utils/ListUtils';
import { DependentInstancesState } from './dependentInstances';

type Action =
  AttributesActions.AddAttributePointAction |
  AttributesActions.RemoveAttributePointAction |
  TalentsActions.AddTalentPointAction |
  TalentsActions.RemoveTalentPointAction |
  CombatTechniquesActions.AddCombatTechniquePointAction |
  CombatTechniquesActions.RemoveCombatTechniquePointAction |
  SpellsActions.ActivateSpellAction |
  SpellsActions.AddSpellPointAction |
  SpellsActions.DeactivateSpellAction |
  SpellsActions.RemoveSpellPointAction |
  SpellsActions.ActivateCantripAction |
  SpellsActions.DeactivateCantripAction |
  LiturgiesActions.ActivateLiturgyAction |
  LiturgiesActions.AddLiturgyPointAction |
  LiturgiesActions.DeactivateLiturgyAction |
  LiturgiesActions.RemoveLiturgyPointAction |
  LiturgiesActions.ActivateBlessingAction |
  LiturgiesActions.DeactivateBlessingAction;

export function increasable(state: DependentInstancesState, action: Action): DependentInstancesState {
  switch (action.type) {
    case ActionTypes.ACTIVATE_SPELL: {
      const { id } = action.payload;
      const entry = state.spells.get(id)!;
      const newObject = { ...entry, active: true };
      const firstState = setStateItem(state, newObject.id, newObject);
      return mergeIntoState(firstState, addDependencies(firstState, newObject.reqs, newObject.id));
    }

    case ActionTypes.ACTIVATE_CANTRIP: {
      const { id } = action.payload;
      const entry = state.cantrips.get(id)!;
      const newObject = { ...entry, active: true };
      const firstState = setStateItem(state, newObject.id, newObject);
      return mergeIntoState(firstState, addDependencies(firstState, newObject.reqs, newObject.id));
    }

    case ActionTypes.ACTIVATE_LITURGY: {
      const { id } = action.payload;
      const entry = state.liturgies.get(id)!;
      return setStateItem(state, id, {...entry, active: true});
    }

    case ActionTypes.ACTIVATE_BLESSING: {
      const { id } = action.payload;
      const entry = state.blessings.get(id)!;
      return setStateItem(state, id, {...entry, active: true});
    }

    case ActionTypes.ACTIVATE_LITURGY: {
      const { id } = action.payload;
      const entry = state.liturgies.get(id)!;
      return setStateItem(state, id, {...entry, active: true});
    }

    case ActionTypes.DEACTIVATE_SPELL: {
      const { id } = action.payload;
      const entry = state.spells.get(id)!;
      const newObject = { ...entry, active: false };
      const firstState = setStateItem(state, newObject.id, newObject);
      return mergeIntoState(firstState, removeDependencies(firstState, newObject.reqs, newObject.id));
    }

    case ActionTypes.DEACTIVATE_CANTRIP: {
      const { id } = action.payload;
      const entry = state.cantrips.get(id)!;
      const newObject = { ...entry, active: false };
      const firstState = setStateItem(state, newObject.id, newObject);
      return mergeIntoState(firstState, removeDependencies(firstState, newObject.reqs, newObject.id));
    }

    case ActionTypes.DEACTIVATE_LITURGY: {
      const { id } = action.payload;
      const entry = state.liturgies.get(id)!;
      return setStateItem(state, id, {...entry, active: false});
    }

    case ActionTypes.DEACTIVATE_BLESSING: {
      const { id } = action.payload;
      const entry = state.blessings.get(id)!;
      return setStateItem(state, id, {...entry, active: false});
    }

    case ActionTypes.ADD_ATTRIBUTE_POINT: {
      const { id } = action.payload;
      const entry = state.attributes.get(id)!;
      return setStateItem(state, id, {...entry, value: entry.value + 1});
    }

    case ActionTypes.ADD_TALENT_POINT: {
      const { id } = action.payload;
      const entry = state.talents.get(id)!;
      return setStateItem(state, id, {...entry, value: entry.value + 1});
    }

    case ActionTypes.ADD_COMBATTECHNIQUE_POINT: {
      const { id } = action.payload;
      const entry = state.combatTechniques.get(id)!;
      return setStateItem(state, id, {...entry, value: entry.value + 1});
    }

    case ActionTypes.ADD_SPELL_POINT: {
      const { id } = action.payload;
      const entry = state.spells.get(id)!;
      return setStateItem(state, id, {...entry, value: entry.value + 1});
    }

    case ActionTypes.ADD_LITURGY_POINT: {
      const { id } = action.payload;
      const entry = state.liturgies.get(id)!;
      return setStateItem(state, id, {...entry, value: entry.value + 1});
    }

    case ActionTypes.REMOVE_ATTRIBUTE_POINT: {
      const { id } = action.payload;
      const entry = state.attributes.get(id)!;
      return setStateItem(state, id, {...entry, value: entry.value - 1});
    }

    case ActionTypes.REMOVE_TALENT_POINT: {
      const { id } = action.payload;
      const entry = state.talents.get(id)!;
      return setStateItem(state, id, {...entry, value: entry.value - 1});
    }

    case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT: {
      const { id } = action.payload;
      const entry = state.combatTechniques.get(id)!;
      return setStateItem(state, id, {...entry, value: entry.value - 1});
    }

    case ActionTypes.REMOVE_SPELL_POINT: {
      const { id } = action.payload;
      const entry = state.spells.get(id)!;
      return setStateItem(state, id, {...entry, value: entry.value - 1});
    }

    case ActionTypes.REMOVE_LITURGY_POINT: {
      const { id } = action.payload;
      const entry = state.liturgies.get(id)!;
      return setStateItem(state, id, {...entry, value: entry.value - 1});
    }

    default:
      return state;
  }
}
