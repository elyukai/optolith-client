import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import alert from '../utils/alert';
import * as AttributeUtils from '../utils/AttributeUtils';
import * as CombatTechniqueUtils from '../utils/CombatTechniqueUtils';
import { check, checkDisAdvantages, final } from '../utils/iccalc';
import * as LiturgyUtils from '../utils/LiturgyUtils';
import * as secondaryAttributes from '../utils/secondaryAttributes';
import * as SpellUtils from '../utils/SpellUtils';
import * as TalentUtils from '../utils/TalentUtils';
import APStore from './APStore';
import AttributeStore from './AttributeStore';
import CombatTechniquesStore from './CombatTechniquesStore';
import { get } from './ListStore';
import Store from './Store';

class RequirementsStoreStatic extends Store {
	readonly dispatchToken: string;
	private cost = 0;
	private validCost = false;
	private disadv: [boolean, 0 | 1 | 2] = [true, 0];
	private validOwnRequirements = false;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			if (action.undo) {
				this.updateOwnRequirements(true);
				this.updateCost(-action.cost!, true);
			}
			else {
				switch (action.type) {
					case ActionTypes.ACTIVATE_SPELL:
					case ActionTypes.ACTIVATE_LITURGY: {
						const obj = get(action.payload.id) as LiturgyInstance | SpellInstance;
						this.updateOwnRequirements(true);
						if ((obj.category === Categories.SPELLS && obj.gr === 5) || (obj.category === Categories.LITURGIES && obj.gr === 3)) {
							this.updateCost(1);
						}
						else {
							this.updateCost(final(obj.ic, 0));
						}
						break;
					}

					case ActionTypes.DEACTIVATE_SPELL:
					case ActionTypes.DEACTIVATE_LITURGY: {
						const obj = get(action.payload.id) as LiturgyInstance | SpellInstance;
						this.updateOwnRequirements(true);
						if ((obj.category === Categories.SPELLS && obj.gr === 5) || (obj.category === Categories.LITURGIES && obj.gr === 3)) {
							this.updateCost(-1);
						}
						else {
							this.updateCost(final(obj.ic, 0) * -1);
						}
						break;
					}

					case ActionTypes.ACTIVATE_DISADV:
						this.updateOwnRequirements(ActivatableUtils.isActivatable(get(action.payload.id) as ActivatableInstance));
						this.updateDisAdvCost(action.payload.id, action.payload.cost);
						break;

					case ActionTypes.ACTIVATE_SPECIALABILITY:
						this.updateOwnRequirements(ActivatableUtils.isActivatable(get(action.payload.id) as ActivatableInstance));
						this.updateCost(action.payload.cost);
						break;

					case ActionTypes.DEACTIVATE_DISADV:
						this.updateOwnRequirements(ActivatableUtils.isDeactivatable(get(action.payload.id) as ActivatableInstance));
						this.updateDisAdvCost(action.payload.id, -action.payload.cost);
						break;

					case ActionTypes.DEACTIVATE_SPECIALABILITY: {
						this.updateOwnRequirements(ActivatableUtils.isDeactivatable(get(action.payload.id) as ActivatableInstance));
						const id = action.payload.id;
						const redeemedPointsChange = AttributeStore.getPermanentRedeemedChangeAmount(id);
						const reducedCombatTechnique = CombatTechniquesStore.getValueChange(id);
						this.updateCost(-action.payload.cost - redeemedPointsChange * 2 - reducedCombatTechnique * 2, true);
						break;
					}

					case ActionTypes.SET_DISADV_TIER:
						this.updateOwnRequirements(true);
						this.updateDisAdvCost(action.payload.id, action.payload.cost);
						break;

					case ActionTypes.SET_SPECIALABILITY_TIER:
						this.updateOwnRequirements(true);
						this.updateCost(action.payload.cost);
						break;

					case ActionTypes.ADD_ATTRIBUTE_POINT: {
						const obj = get(action.payload.id) as AttributeInstance;
						this.updateOwnRequirements(AttributeUtils.isIncreasable(obj));
						this.updateCost(final(obj.ic, obj.value + 1));
						break;
					}

					case ActionTypes.ADD_COMBATTECHNIQUE_POINT: {
						const obj = get(action.payload.id) as CombatTechniqueInstance;
						this.updateOwnRequirements(CombatTechniqueUtils.isIncreasable(obj));
						this.updateCost(final(obj.ic, obj.value + 1));
						break;
					}

					case ActionTypes.ADD_LITURGY_POINT: {
						const obj = get(action.payload.id) as LiturgyInstance;
						this.updateOwnRequirements(LiturgyUtils.isIncreasable(obj));
						this.updateCost(final(obj.ic, obj.value + 1));
						break;
					}

					case ActionTypes.ADD_SPELL_POINT: {
						const obj = get(action.payload.id) as SpellInstance;
						this.updateOwnRequirements(SpellUtils.isIncreasable(obj));
						this.updateCost(final(obj.ic, obj.value + 1));
						break;
					}

					case ActionTypes.ADD_TALENT_POINT: {
						const obj = get(action.payload.id) as TalentInstance;
						this.updateOwnRequirements(TalentUtils.isIncreasable(obj));
						this.updateCost(final(obj.ic, obj.value + 1));
						break;
					}

					case ActionTypes.ADD_LIFE_POINT: {
						const obj = secondaryAttributes.get('LP') as Energy;
						this.updateOwnRequirements(obj.currentAdd < obj.maxAdd);
						this.updateCost(final(4, AttributeStore.getAdd('LP') + 1));
						break;
					}

					case ActionTypes.ADD_ARCANE_ENERGY_POINT: {
						const obj = secondaryAttributes.get('AE') as Energy;
						this.updateOwnRequirements(obj.currentAdd < obj.maxAdd);
						this.updateCost(final(4, AttributeStore.getAdd('AE') + 1));
						break;
					}

					case ActionTypes.ADD_KARMA_POINT: {
						const obj = secondaryAttributes.get('KP') as Energy;
						this.updateOwnRequirements(obj.currentAdd < obj.maxAdd);
						this.updateCost(final(4, AttributeStore.getAdd('KP') + 1));
						break;
					}

					case ActionTypes.REDEEM_AE_POINT:
					case ActionTypes.REDEEM_KP_POINT: {
						this.updateOwnRequirements(true);
						this.updateCost(2);
						break;
					}

					case ActionTypes.REMOVE_REDEEMED_AE_POINT:
					case ActionTypes.REMOVE_REDEEMED_KP_POINT: {
						this.updateOwnRequirements(true);
						this.updateCost(-2, true);
						break;
					}

					case ActionTypes.REMOVE_ATTRIBUTE_POINT: {
						const obj = get(action.payload.id) as AttributeInstance;
						this.updateOwnRequirements(AttributeUtils.isDecreasable(obj));
						this.updateCost(final(obj.ic, obj.value) * -1);
						break;
					}

					case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT: {
						const obj = get(action.payload.id) as CombatTechniqueInstance;
						this.updateOwnRequirements(CombatTechniqueUtils.isDecreasable(obj));
						this.updateCost(final(obj.ic, obj.value) * -1);
						break;
					}

					case ActionTypes.REMOVE_LITURGY_POINT: {
						const obj = get(action.payload.id) as LiturgyInstance;
						this.updateOwnRequirements(LiturgyUtils.isDecreasable(obj));
						this.updateCost(final(obj.ic, obj.value) * -1);
						break;
					}

					case ActionTypes.REMOVE_SPELL_POINT: {
						const obj = get(action.payload.id) as SpellInstance;
						this.updateOwnRequirements(SpellUtils.isDecreasable(obj));
						this.updateCost(final(obj.ic, obj.value) * -1);
						break;
					}

					case ActionTypes.REMOVE_TALENT_POINT: {
						const obj = get(action.payload.id) as TalentInstance;
						this.updateOwnRequirements(TalentUtils.isDecreasable(obj));
						this.updateCost(final(obj.ic, obj.value) * -1);
						break;
					}

					default:
						return true;
				}
			}
			this.emitChange();
			return true;
		});
	}

	getCurrentCost() {
		return this.cost;
	}

	getDisAdvDetails() {
		return this.disadv;
	}

	isValid() {
		return this.validCost && this.validOwnRequirements;
	}

	private updateCost(cost: number, valid?: boolean) {
		this.cost = cost;
		this.validCost = valid || check(this.cost);
		if (valid !== undefined) {
			this.validCost = valid;
		}
		else {
			this.validCost = check(cost);
		}
		if (!this.validCost) {
			alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
		}
	}

	private updateDisAdvCost(id: string, cost: number, valid?: boolean) {
		this.cost = cost;
		if (valid !== undefined) {
			this.validCost = valid;
			if (!this.validCost) {
				alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
			}
		}
		else {
			const { category, reqs } = get(id) as AdvantageInstance | DisadvantageInstance;
			const { adv, disadv, spent, total } = APStore.getAll();
			const add = category === Categories.ADVANTAGES;
			const target = () => add ? adv : disadv;

			const isKar = reqs.some(e => e !== 'RCP' && e.id === 'ADV_12' && !!e.active);
			const isMag = reqs.some(e => e !== 'RCP' && e.id === 'ADV_50' && !!e.active);
			const index = isKar ? 2 : isMag ? 1 : 0;

			const validDisAdv = checkDisAdvantages(cost, index, target(), spent, total, add);

			const sub = isKar ? 'karmale' : isMag ? 'magische' : '';
			const text = add ? 'Vorteile' : 'Nachteile';

			if (!validDisAdv[2]) {
				alert(`Obergrenze für ${sub} ${text} erreicht`, `Du kannst nicht mehr als 50 AP für ${sub} ${text} ausgeben!`);
			}
			else if (!validDisAdv[1]) {
				alert(`Obergrenze für ${text} erreicht`, `Du kannst nicht mehr als 80 AP für ${text} ausgeben!`);
			}
			else if (!validDisAdv[0]) {
				alert('Zu wenig AP', 'Du benötigst mehr AP als du momentan zur Verfügung hast!');
			}
			else {
				this.disadv = [ add, index ];
			}

			this.validCost = validDisAdv.every(e => e);
		}
	}

	private updateOwnRequirements(isValid: boolean) {
		this.validOwnRequirements = isValid;
	}
}

const RequirementsStore = new RequirementsStoreStatic();

export default RequirementsStore;
