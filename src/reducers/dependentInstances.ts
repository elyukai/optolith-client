import { AddAttributePointAction, RemoveAttributePointAction } from '../actions/AttributesActions';
import { AddCombatTechniquePointAction, RemoveCombatTechniquePointAction } from '../actions/CombatTechniquesActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { ActivateLiturgyAction, AddLiturgyPointAction, DeactivateLiturgyAction, RemoveLiturgyPointAction } from '../actions/LiturgiesActions';
import { ActivateSpellAction, AddSpellPointAction, DeactivateSpellAction, RemoveSpellPointAction } from '../actions/SpellsActions';
import { AddTalentPointAction, RemoveTalentPointAction } from '../actions/TalentsActions';
import * as ActionTypes from '../constants/ActionTypes';
import { Category, CategoryWithGroups } from '../constants/Categories';
import * as Data from '../types/data.d';
import { dependentInstancesClear } from './dependentInstancesClear';
import { increasable } from './increasable';

type Action = AddAttributePointAction | RemoveAttributePointAction | AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | CreateHeroAction | LoadHeroAction | ActivateLiturgyAction | AddLiturgyPointAction | DeactivateLiturgyAction | RemoveLiturgyPointAction | ActivateSpellAction | AddSpellPointAction | DeactivateSpellAction | RemoveSpellPointAction | AddTalentPointAction | RemoveTalentPointAction;

export type DependentInstancesState = Map<string, Data.Instance>;

export function dependentInstances(state = new Map<string, Data.Instance>(), action: Action) {
	switch (action.type) {
		case ActionTypes.ACTIVATE_SPELL:
		case ActionTypes.ACTIVATE_LITURGY:
		case ActionTypes.DEACTIVATE_SPELL:
		case ActionTypes.DEACTIVATE_LITURGY:
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
			return increasable(state, action);

		case ActionTypes.CREATE_HERO:
			return dependentInstancesClear(state);

		case ActionTypes.LOAD_HERO:
			return dependentInstancesClear(state);

		default:
			return state;
	}
}

export function get(state: DependentInstancesState, id: string) {
	return state.get(id);
}

export function getAllByCategory(state: DependentInstancesState, ...categories: Category[]) {
	return [...state.values()].filter(e => categories.includes(e.category));
}

export function getAllByCategoryGroup(state: DependentInstancesState, category: CategoryWithGroups, ...gr: number[]) {
	return [...state.values()].filter(e => e.category === category && gr.includes(e.gr));
}
