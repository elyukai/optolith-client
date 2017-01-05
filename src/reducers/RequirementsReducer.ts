import { FetchDataTablesAction } from '../actions/ServerActions';
import { LoginAction, LogoutAction } from '../actions/AuthActions';
import * as ActionTypes from '../constants/ActionTypes';
import { Category } from '../constants/Categories';
import { AdventurePoints, HeroState } from './HeroReducer';

import { check, checkDisAdvantages, final } from '../utils/iccalc';
import alert from '../utils/alert';
import * as secondaryAttributes from '../utils/secondaryAttributes';
import Categories from '../constants/Categories';

type Action = FetchDataTablesAction | LoginAction | LogoutAction;

type ValidationResult = [boolean, number, [boolean, 0 | 1 | 2] | undefined] | never[];

let cost = 0;
let validCost = false;
let disadvArgs: [boolean, 0 | 1 | 2] = [true, 0];
let validOwnRequirements = false;

function updateCost(cost: number, valid: boolean = check(cost)) {
	cost = cost;
	validCost = valid;
	if (!validCost) {
		alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
	}
}

function updateDisAdvCost(ap: AdventurePoints, category: Category, reqs: any[][], cost: number, valid?: boolean) {
	cost = cost;
	if (typeof valid === 'boolean') {
		validCost = valid;
		if (!validCost) {
			alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
		}
	}
	else {
		const { adv, disadv, spent, total } = ap;
		const add = category === Categories.ADVANTAGES;
		const target = () => add ? adv : disadv;

		const isKar = reqs.some((e: [string, boolean]) => e[0] === 'ADV_12' && e[1]);
		const isMag = reqs.some((e: [string, boolean]) => e[0] === 'ADV_50' && e[1]);
		const index = isKar ? 2 : isMag ? 1 : 0;

		const validCostArray = checkDisAdvantages(cost, index, target(), spent, total, add);

		const sub = isKar ? 'karmale' : isMag ? 'magische' : '';
		const text = add ? 'Vorteile' : 'Nachteile';

		if (!validCostArray[2]) {
			alert(`Obergrenze für ${sub} ${text} erreicht`, `Du kannst nicht mehr als 50 AP für ${sub} ${text} ausgeben!`);
		}
		else if (!validCostArray[1]) {
			alert(`Obergrenze für ${text} erreicht`, `Du kannst nicht mehr als 80 AP für ${text} ausgeben!`);
		}
		else if (!validCostArray[0]) {
			alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
		}
		else {
			disadvArgs = [ add, index ];
		}

		validCost = validCostArray.every(e => e);
	}
}

function updateOwnRequirements(valid: boolean) {
	validOwnRequirements = valid;
}

export default (state: HeroState, action: Action): ValidationResult => {
	if (action.payload && action.payload.undo) {
		updateOwnRequirements(true);
		updateCost(payload.cost * -1, true);
	}
	switch (action.type) {
		case ActionTypes.ATS.ACTIVATE_SPELL:
		case ActionTypes.ATS.ACTIVATE_LITURGY: {
			const obj = get(payload.id);
			updateOwnRequirements(true);
			if ((obj.category === Categories.SPELLS && obj.gr === 5) || (obj.category === Categories.CHANTS && obj.gr === 3)) {
				updateCost(1);
			}
			else {
				updateCost(final(obj.ic, 0));
			}
			break;
		}

		case ActionTypes.ATS.DEACTIVATE_SPELL:
		case ActionTypes.ATS.DEACTIVATE_LITURGY: {
			const obj = get(payload.id);
			updateOwnRequirements(true);
			if ((obj.category === Categories.SPELLS && obj.gr === 5) || (obj.category === Categories.CHANTS && obj.gr === 3)) {
				updateCost(-1);
			}
			else {
				updateCost(final(obj.ic, 0) * -1);
			}
			break;
		}

		case ActionTypes.ATS.ACTIVATE_DISADV:
			updateOwnRequirements(get(payload.id).isActivatable);
			updateDisAdvCost(payload.id, payload.cost);
			break;

		case ActionTypes.ATS.ACTIVATE_SPECIALABILITY:
			updateOwnRequirements(get(payload.id).isActivatable);
			updateCost(payload.cost);
			break;

		case ActionTypes.ATS.DEACTIVATE_DISADV:
			updateOwnRequirements(get(payload.id).isDeactivatable);
			updateDisAdvCost(payload.id, payload.cost);
			break;

		case ActionTypes.ATS.DEACTIVATE_SPECIALABILITY:
			updateOwnRequirements(get(payload.id).isDeactivatable);
			updateCost(-payload.cost);
			break;

		case ActionTypes.ATS.UPDATE_DISADV_TIER:
			updateOwnRequirements(true);
			updateDisAdvCost(payload.id, payload.cost);
			break;

		case ActionTypes.ATS.UPDATE_SPECIALABILITY_TIER:
			updateOwnRequirements(true);
			updateCost(payload.cost);
			break;

		case ActionTypes.ATS.ADD_ATTRIBUTE_POINT:
		case ActionTypes.ATS.ADD_TALENT_POINT:
		case ActionTypes.ATS.ADD_COMBATTECHNIQUE_POINT:
		case ActionTypes.ATS.ADD_SPELL_POINT:
		case ActionTypes.ATS.ADD_LITURGY_POINT: {
			const obj = get(payload.id);
			updateOwnRequirements(obj.isIncreasable);
			updateCost(final(obj.ic, obj.value + 1));
			break;
		}

		case ActionTypes.ATS.ADD_MAX_ENERGY_POINT: {
			const obj = secondaryAttributes.get(payload.id);
			updateOwnRequirements(obj.maxAdd && obj.currentAdd < obj.maxAdd);
			updateCost(final(4, AttributeStore.getAdd(payload.id) + 1));
			break;
		}

		case ActionTypes.ATS.REMOVE_ATTRIBUTE_POINT:
		case ActionTypes.ATS.REMOVE_TALENT_POINT:
		case ActionTypes.ATS.REMOVE_COMBATTECHNIQUE_POINT:
		case ActionTypes.ATS.REMOVE_SPELL_POINT:
		case ActionTypes.ATS.REMOVE_LITURGY_POINT: {
			const obj = get(payload.id);
			updateOwnRequirements(obj.isDecreasable);
			updateCost(final(obj.ic, obj.value) * -1);
			break;
		}

		// UPDATE_USERNAME

		default:
			return [];
	}
	return [validCost && validOwnRequirements, cost, disadvArgs];
};
