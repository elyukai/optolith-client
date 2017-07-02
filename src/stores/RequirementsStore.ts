import { AddArcaneEnergyPointAction, AddAttributePointAction, AddBoughtBackAEPointAction, AddBoughtBackKPPointAction, AddKarmaPointAction, AddLifePointAction, AddLostAEPointsAction, AddLostKPPointsAction, RemoveAttributePointAction, RemoveBoughtBackAEPointAction, RemoveBoughtBackKPPointAction, RemoveLostAEPointAction, RemoveLostKPPointAction } from '../actions/AttributesActions';
import { AddCombatTechniquePointAction, RemoveCombatTechniquePointAction } from '../actions/CombatTechniquesActions';
import { ActivateDisAdvAction, DeactivateDisAdvAction, SetDisAdvTierAction } from '../actions/DisAdvActions';
import { ActivateLiturgyAction, AddLiturgyPointAction, DeactivateLiturgyAction, RemoveLiturgyPointAction } from '../actions/LiturgiesActions';
import { ActivateSpecialAbilityAction, DeactivateSpecialAbilityAction, SetSpecialAbilityTierAction } from '../actions/SpecialAbilitiesActions';
import { ActivateSpellAction, AddSpellPointAction, DeactivateSpellAction, RemoveSpellPointAction } from '../actions/SpellsActions';
import { AddTalentPointAction, RemoveTalentPointAction } from '../actions/TalentsActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import * as Data from '../types/data.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import { alert } from '../utils/alert';
import { checkDisAdvantages, getAdvantagesDisadvantagesSubMax, validate } from '../utils/APUtils';
import * as AttributeUtils from '../utils/AttributeUtils';
import * as CombatTechniqueUtils from '../utils/CombatTechniqueUtils';
import { getDecreaseAP, getIncreaseAP } from '../utils/ICUtils';
import * as LiturgyUtils from '../utils/LiturgyUtils';
import * as secondaryAttributes from '../utils/secondaryAttributes';
import * as SpellUtils from '../utils/SpellUtils';
import * as TalentUtils from '../utils/TalentUtils';
import { APStore } from './APStore';
import { AttributeStore } from './AttributeStore';
import { CombatTechniquesStore } from './CombatTechniquesStore';
import { get } from './ListStore';
import { Store } from './Store';

type Action = ActivateSpellAction | AddSpellPointAction | DeactivateSpellAction | RemoveSpellPointAction | ActivateLiturgyAction | AddLiturgyPointAction | DeactivateLiturgyAction | RemoveLiturgyPointAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | ActivateSpecialAbilityAction | DeactivateSpecialAbilityAction | SetSpecialAbilityTierAction | AddArcaneEnergyPointAction | AddAttributePointAction | AddKarmaPointAction | AddLifePointAction | RemoveAttributePointAction | AddBoughtBackAEPointAction | AddBoughtBackKPPointAction | AddLostAEPointsAction | AddLostKPPointsAction | RemoveBoughtBackAEPointAction | RemoveBoughtBackKPPointAction | AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | AddTalentPointAction | RemoveTalentPointAction | RemoveLostAEPointAction | RemoveLostKPPointAction;

class RequirementsStoreStatic extends Store {
	readonly dispatchToken: string;
	private cost = 0;
	private validCost = false;
	private disadv: [boolean, 0 | 1 | 2] = [true, 0];
	private validOwnRequirements = false;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			if (action.undo && action.cost) {
				switch (action.type) {
					case ActionTypes.ACTIVATE_DISADV:
					case ActionTypes.DEACTIVATE_DISADV:
					case ActionTypes.SET_DISADV_TIER:
						this.updateOwnRequirements(true);
						this.updateDisAdvCost(action.payload.id, -action.cost);
						break;

					default:
						this.updateOwnRequirements(true);
						this.updateCost(-action.cost, true);
						break;
				}
			}
			else {
				switch (action.type) {
					case ActionTypes.ACTIVATE_SPELL:
					case ActionTypes.ACTIVATE_LITURGY: {
						const obj = get(action.payload.id) as Data.ActivatableSkillishInstance;
						this.updateOwnRequirements(true);
						if (obj.category === Categories.CANTRIPS || obj.category === Categories.BLESSINGS) {
							this.updateCost(1);
						}
						else {
							this.updateCost(getIncreaseAP(obj.ic));
						}
						break;
					}

					case ActionTypes.DEACTIVATE_SPELL:
					case ActionTypes.DEACTIVATE_LITURGY: {
						const obj = get(action.payload.id) as Data.ActivatableSkillishInstance;
						this.updateOwnRequirements(true);
						if (obj.category === Categories.CANTRIPS || obj.category === Categories.BLESSINGS) {
							this.updateCost(-1);
						}
						else {
							this.updateCost(getDecreaseAP(obj.ic));
						}
						break;
					}

					case ActionTypes.ACTIVATE_DISADV:
						this.updateOwnRequirements(ActivatableUtils.isActivatable(get(action.payload.id) as Data.ActivatableInstance));
						this.updateDisAdvCost(action.payload.id, action.payload.cost);
						break;

					case ActionTypes.ACTIVATE_SPECIALABILITY:
						this.updateOwnRequirements(ActivatableUtils.isActivatable(get(action.payload.id) as Data.ActivatableInstance));
						this.updateCost(action.payload.cost);
						break;

					case ActionTypes.DEACTIVATE_DISADV: {
						const obj = get(action.payload.id) as Data.ActivatableInstance;
						this.updateOwnRequirements(ActivatableUtils.isDeactivatable(obj, obj.active[action.payload.index].sid));
						this.updateDisAdvCost(action.payload.id, -action.payload.cost);
						break;
					}

					case ActionTypes.DEACTIVATE_SPECIALABILITY: {
						const obj = get(action.payload.id) as Data.ActivatableInstance;
						this.updateOwnRequirements(ActivatableUtils.isDeactivatable(obj, obj.active[action.payload.index].sid));
						const id = action.payload.id;
						const reducedCombatTechnique = CombatTechniquesStore.getValueChange(id);
						this.updateCost(-action.payload.cost - reducedCombatTechnique * 2, true);
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
						const obj = get(action.payload.id) as Data.AttributeInstance;
						this.updateOwnRequirements(AttributeUtils.isIncreasable(obj));
						this.updateCost(getIncreaseAP(obj.ic, obj.value));
						break;
					}

					case ActionTypes.ADD_COMBATTECHNIQUE_POINT: {
						const obj = get(action.payload.id) as Data.CombatTechniqueInstance;
						this.updateOwnRequirements(CombatTechniqueUtils.isIncreasable(obj));
						this.updateCost(getIncreaseAP(obj.ic, obj.value));
						break;
					}

					case ActionTypes.ADD_LITURGY_POINT: {
						const obj = get(action.payload.id) as Data.LiturgyInstance;
						this.updateOwnRequirements(LiturgyUtils.isIncreasable(obj));
						this.updateCost(getIncreaseAP(obj.ic, obj.value));
						break;
					}

					case ActionTypes.ADD_SPELL_POINT: {
						const obj = get(action.payload.id) as Data.SpellInstance;
						this.updateOwnRequirements(SpellUtils.isIncreasable(obj));
						this.updateCost(getIncreaseAP(obj.ic, obj.value));
						break;
					}

					case ActionTypes.ADD_TALENT_POINT: {
						const obj = get(action.payload.id) as Data.TalentInstance;
						this.updateOwnRequirements(TalentUtils.isIncreasable(obj));
						this.updateCost(getIncreaseAP(obj.ic, obj.value));
						break;
					}

					case ActionTypes.ADD_LIFE_POINT: {
						const obj = secondaryAttributes.get('LP') as Data.Energy;
						this.updateOwnRequirements(obj.currentAdd < obj.maxAdd);
						this.updateCost(getIncreaseAP(4, AttributeStore.getAdd('LP')));
						break;
					}

					case ActionTypes.ADD_ARCANE_ENERGY_POINT: {
						const obj = secondaryAttributes.get('AE') as Data.Energy;
						this.updateOwnRequirements(obj.currentAdd < obj.maxAdd);
						this.updateCost(getIncreaseAP(4, AttributeStore.getAdd('AE')));
						break;
					}

					case ActionTypes.ADD_KARMA_POINT: {
						const obj = secondaryAttributes.get('KP') as Data.Energy;
						this.updateOwnRequirements(obj.currentAdd < obj.maxAdd);
						this.updateCost(getIncreaseAP(4, AttributeStore.getAdd('KP')));
						break;
					}

					case ActionTypes.ADD_BOUGHT_BACK_AE_POINT:
					case ActionTypes.ADD_BOUGHT_BACK_KP_POINT: {
						this.updateOwnRequirements(true);
						this.updateCost(2);
						break;
					}

					case ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT:
					case ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT: {
						this.updateOwnRequirements(true);
						this.updateCost(-2, true);
						break;
					}

					case ActionTypes.REMOVE_LOST_AE_POINT: {
						const { lost, redeemed } = AttributeStore.getAddEnergies().permanentAE;
						this.updateOwnRequirements(true);
						this.updateCost(lost <= redeemed ? -2 : 0, true);
						break;
					}

					case ActionTypes.REMOVE_LOST_KP_POINT: {
						const { lost, redeemed } = AttributeStore.getAddEnergies().permanentKP;
						this.updateOwnRequirements(true);
						this.updateCost(lost <= redeemed ? -2 : 0, true);
						break;
					}

					case ActionTypes.REMOVE_ATTRIBUTE_POINT: {
						const obj = get(action.payload.id) as Data.AttributeInstance;
						this.updateOwnRequirements(AttributeUtils.isDecreasable(obj));
						this.updateCost(getDecreaseAP(obj.ic, obj.value));
						break;
					}

					case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT: {
						const obj = get(action.payload.id) as Data.CombatTechniqueInstance;
						this.updateOwnRequirements(CombatTechniqueUtils.isDecreasable(obj));
						this.updateCost(getDecreaseAP(obj.ic, obj.value));
						break;
					}

					case ActionTypes.REMOVE_LITURGY_POINT: {
						const obj = get(action.payload.id) as Data.LiturgyInstance;
						this.updateOwnRequirements(LiturgyUtils.isDecreasable(obj));
						this.updateCost(getDecreaseAP(obj.ic, obj.value));
						break;
					}

					case ActionTypes.REMOVE_SPELL_POINT: {
						const obj = get(action.payload.id) as Data.SpellInstance;
						this.updateOwnRequirements(SpellUtils.isDecreasable(obj));
						this.updateCost(getDecreaseAP(obj.ic, obj.value));
						break;
					}

					case ActionTypes.REMOVE_TALENT_POINT: {
						const obj = get(action.payload.id) as Data.TalentInstance;
						this.updateOwnRequirements(TalentUtils.isDecreasable(obj));
						this.updateCost(getDecreaseAP(obj.ic, obj.value));
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
		this.validCost = valid || validate(this.cost);
		if (valid !== undefined) {
			this.validCost = valid;
		}
		else {
			this.validCost = validate(cost);
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
			const entry = get(id) as Data.AdvantageInstance | Data.DisadvantageInstance;
			const { adv, disadv, spent, total } = APStore.getAll();
			const add = entry.category === Categories.ADVANTAGES;
			const target = () => add ? adv : disadv;
			const index = ActivatableUtils.isMagicalOrBlessed(entry);

			const validDisAdv = checkDisAdvantages(cost, index, target(), spent, total, add);

			const sub = index === 2 ? 'karmale' : index === 1 ? 'magische' : '';
			const text = add ? 'Vorteile' : 'Nachteile';

			if (!validDisAdv[2]) {
				const submax = getAdvantagesDisadvantagesSubMax(index);
				alert(`Obergrenze für ${sub} ${text} erreicht`, `Du kannst nicht mehr als ${submax} AP für ${sub} ${text} ausgeben!`);
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

export const RequirementsStore = new RequirementsStoreStatic();
