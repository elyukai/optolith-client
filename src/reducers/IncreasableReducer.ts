import { AddAttributePointAction, RemoveAttributePointAction } from '../actions/AttributesActions';
import { AddCombatTechniquePointAction, RemoveCombatTechniquePointAction } from '../actions/CombatTechniquesActions';
import { ActivateLiturgyAction, AddLiturgyPointAction, DeactivateLiturgyAction, RemoveLiturgyPointAction } from '../actions/LiturgiesActions';
import { ActivateSpellAction, AddSpellPointAction, DeactivateSpellAction, RemoveSpellPointAction } from '../actions/SpellsActions';
import { AddTalentPointAction, RemoveTalentPointAction } from '../actions/TalentsActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import * as Data from '../types/data.d';
import { alert } from '../utils/alert';
import { mergeIntoList } from '../utils/ListUtils';
import * as SpellUtils from '../utils/SpellUtils';

type Action = AddAttributePointAction | RemoveAttributePointAction | AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | ActivateLiturgyAction | AddLiturgyPointAction | DeactivateLiturgyAction | RemoveLiturgyPointAction | ActivateSpellAction | AddSpellPointAction | DeactivateSpellAction | RemoveSpellPointAction | AddTalentPointAction | RemoveTalentPointAction;

export interface IncreasableState {
	list: Map<string, Data.Instance>;
}

export function IncreasableReducer({ list = new Map()}: IncreasableState, action: Action) {
	switch (action.type) {
		case ActionTypes.ACTIVATE_SPELL: {
			const { id } = action.payload;
			const entry = list.get(id);
			if (entry) {
				return list.set(id, {...entry, active: true});
			}
			alert('Error', 'IncreasableReducer ACTIVATE_SPELL error: Entry not found');
			return list;
		}

		case ActionTypes.ACTIVATE_LITURGY: {
			const { id } = action.payload;
			const entry = list.get(id);
			if (entry) {
				return list.set(id, {...entry, active: true});
			}
			alert('Error', 'IncreasableReducer ACTIVATE_SPELL error: Entry not found');
			return list;
		}

		case ActionTypes.DEACTIVATE_SPELL:
				this.deactivateSpell(action.payload.id);
			break;

		case ActionTypes.DEACTIVATE_LITURGY:
				this.deactivate(action.payload.id);
			break;

		case ActionTypes.ADD_ATTRIBUTE_POINT:
		case ActionTypes.ADD_TALENT_POINT:
		case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.ADD_SPELL_POINT:
		case ActionTypes.ADD_LITURGY_POINT:
				this.addPoint(action.payload.id);
			break;

		case ActionTypes.REMOVE_ATTRIBUTE_POINT:
		case ActionTypes.REMOVE_TALENT_POINT:
		case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
		case ActionTypes.REMOVE_SPELL_POINT:
		case ActionTypes.REMOVE_LITURGY_POINT:
				this.removePoint(action.payload.id);
			break;

		default:
			return list;
	}
}

	private activate(id: string) {
		const entry = this.byId.get(id) as Data.LiturgyInstance | Data.SpellInstance | Data.CantripInstance | Data.BlessingInstance;
		if (entry) {
			this.byId.set(id, {...entry, active: true});
		}
	}

	private activateSpell(id: string) {
		const entry = this.byId.get(id) as Data.SpellInstance | Data.CantripInstance;
		if (entry) {
			if (entry.category === Categories.CANTRIPS) {
				this.activateCantrip(id);
			}
			else {
				const newList = SpellUtils.activate(entry);
				this.mergeIntoList(newList);
			}
		}
	}

	private activateCantrip(id: string) {
		this.mergeIntoList(SpellUtils.activateCantrip(this.byId.get(id) as Data.CantripInstance));
	}

	private deactivate(id: string) {
		const entry = this.byId.get(id) as Data.LiturgyInstance | Data.SpellInstance | Data.CantripInstance | Data.BlessingInstance;
		if (entry) {
			this.byId.set(id, {...entry, active: false});
		}
	}

	private deactivateSpell(id: string) {
		const entry = this.byId.get(id);
		if (entry) {
			if (entry.category === Categories.CANTRIPS) {
				this.deactivateCantrip(id);
			}
			else {
				this.mergeIntoList(SpellUtils.deactivate(entry as Data.SpellInstance));
			}
		}
	}
