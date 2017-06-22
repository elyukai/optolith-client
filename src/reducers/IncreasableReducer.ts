import { AddAttributePointAction, RemoveAttributePointAction } from '../actions/AttributesActions';
import { AddCombatTechniquePointAction, RemoveCombatTechniquePointAction } from '../actions/CombatTechniquesActions';
import { ActivateLiturgyAction, AddLiturgyPointAction, DeactivateLiturgyAction, RemoveLiturgyPointAction } from '../actions/LiturgiesActions';
import { ActivateSpellAction, AddSpellPointAction, DeactivateSpellAction, RemoveSpellPointAction } from '../actions/SpellsActions';
import { AddTalentPointAction, RemoveTalentPointAction } from '../actions/TalentsActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import * as Data from '../types/data.d';
import { alert } from '../utils/alert';
import { addDependencies, removeDependencies } from '../utils/DependentUtils';
import { mergeIntoList, setListItem } from '../utils/ListUtils';
import * as SpellUtils from '../utils/SpellUtils';

type Action = AddAttributePointAction | RemoveAttributePointAction | AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | ActivateLiturgyAction | AddLiturgyPointAction | DeactivateLiturgyAction | RemoveLiturgyPointAction | ActivateSpellAction | AddSpellPointAction | DeactivateSpellAction | RemoveSpellPointAction | AddTalentPointAction | RemoveTalentPointAction;

export function IncreasableReducer(state = new Map<string, Data.Instance>(), action: Action) {
	switch (action.type) {
		case ActionTypes.ACTIVATE_SPELL: {
			const { id } = action.payload;
			const entry = state.get(id) as Data.SpellInstance | Data.CantripInstance;
			return mergeIntoList(state, addDependencies(state, {...entry, active: true}));
		}

		case ActionTypes.ACTIVATE_LITURGY: {
			const { id } = action.payload;
			const entry = state.get(id) as Data.LiturgyInstance | Data.BlessingInstance;
			return setListItem(state, id, {...entry, active: true});
		}

		case ActionTypes.DEACTIVATE_SPELL: {
			const { id } = action.payload;
			const entry = state.get(id) as Data.SpellInstance | Data.CantripInstance;
			return mergeIntoList(state, removeDependencies(state, {...entry, active: false}));
		}

		case ActionTypes.DEACTIVATE_LITURGY: {
			const { id } = action.payload;
			const entry = state.get(id) as Data.LiturgyInstance | Data.BlessingInstance;
			return setListItem(state, id, {...entry, active: false});
		}

		case ActionTypes.ADD_ATTRIBUTE_POINT:
		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.ADD_LITURGY_POINT: {
			const { id } = action.payload;
			const entry = state.get(id) as Data.IncreasableInstance;
			return setListItem(state, id, {...entry, value: entry.value + 1});
		}

		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
		case ActionTypes.REMOVE_TALENT_POINT:
		case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
		case ActionTypes.REMOVE_SPELL_POINT:
		case ActionTypes.REMOVE_LITURGY_POINT: {
			const { id } = action.payload;
			const entry = state.get(id) as Data.IncreasableInstance;
			return setListItem(state, id, {...entry, value: entry.value - 1});
		}

		default:
			return state;
	}
}
