import * as ActionTypes from '../constants/ActionTypes';
import { getArmorZonesState, getItemsState } from '../selectors/equipmentSelectors';
import { AsyncAction } from '../types/actions.d';
import { getNewId } from '../utils/IDUtils';

export interface AddItemAction {
	type: ActionTypes.ADD_ITEM;
	payload: {
		newId: string;
	};
}

export function addToList(): AsyncAction {
	return (dispatch, getState) => {
		const newId = `ITEM_${getNewId([...getItemsState(getState()).keys()])}`;
		dispatch<AddItemAction>({
			type: ActionTypes.ADD_ITEM,
			payload: {
				newId
			}
		});
	};
}

export interface AddItemTemplateAction {
	type: ActionTypes.ADD_ITEM_TEMPLATE;
	payload: {
		id: string;
		newId: string;
	};
}

export function addTemplateToList(id: string): AsyncAction {
	return (dispatch, getState) => {
		const { items } = getState().currentHero.present.equipment;
		const newId = `ITEM_${getNewId([...items.keys()])}`;
		dispatch({
			type: ActionTypes.ADD_ITEM_TEMPLATE,
			payload: {
				id,
				newId
			}
		} as AddItemTemplateAction);
	};
}

export interface CreateItemAction {
	type: ActionTypes.CREATE_ITEM;
}

export function createItem(): CreateItemAction {
	return {
		type: ActionTypes.CREATE_ITEM
	};
}

export interface CloseItemEditorAction {
	type: ActionTypes.CLOSE_ITEM_EDITOR;
}

export function closeItemEditor(): CloseItemEditorAction {
	return {
		type: ActionTypes.CLOSE_ITEM_EDITOR
	};
}

export interface SaveItemAction {
	type: ActionTypes.SAVE_ITEM;
}

export function saveItem(): SaveItemAction {
	return {
		type: ActionTypes.SAVE_ITEM
	};
}

export interface EditItemAction {
	type: ActionTypes.EDIT_ITEM;
	payload: {
		id: string;
	};
}

export function editItem(id: string): EditItemAction {
	return {
			type: ActionTypes.EDIT_ITEM,
			payload: {
				id
			}
		};
}

export interface RemoveItemAction {
	type: ActionTypes.REMOVE_ITEM;
	payload: {
		id: string;
	};
}

export function _removeFromList(id: string): RemoveItemAction {
	return {
		type: ActionTypes.REMOVE_ITEM,
		payload: {
			id
		}
	};
}

export interface SetItemsSortOrderAction {
	type: ActionTypes.SET_ITEMS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export function _setSortOrder(sortOrder: string): SetItemsSortOrderAction {
	return {
		type: ActionTypes.SET_ITEMS_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

export interface SetDucatesAction {
	type: ActionTypes.SET_DUCATES;
	payload: {
		value: string;
	};
}

export function _setDucates(value: string): SetDucatesAction {
	return {
		type: ActionTypes.SET_DUCATES,
		payload: {
			value
		}
	};
}

export interface SetSilverthalersAction {
	type: ActionTypes.SET_SILVERTHALERS;
	payload: {
		value: string;
	};
}

export function _setSilverthalers(value: string): SetSilverthalersAction {
	return {
		type: ActionTypes.SET_SILVERTHALERS,
		payload: {
			value
		}
	};
}

export interface SetHellersAction {
	type: ActionTypes.SET_HELLERS;
	payload: {
		value: string;
	};
}

export function _setHellers(value: string): SetHellersAction {
	return {
		type: ActionTypes.SET_HELLERS,
		payload: {
			value
		}
	};
}

export interface SetKreutzersAction {
	type: ActionTypes.SET_KREUTZERS;
	payload: {
		value: string;
	};
}

export function _setKreutzers(value: string): SetKreutzersAction {
	return {
		type: ActionTypes.SET_KREUTZERS,
		payload: {
			value
		}
	};
}

export interface SetNameAction {
	type: ActionTypes.SET_ITEM_NAME;
	payload: {
		value: string;
	};
}

export function setName(value: string): SetNameAction {
	return {
		type: ActionTypes.SET_ITEM_NAME,
		payload: {
			value
		}
	};
}

export interface SetPriceAction {
	type: ActionTypes.SET_ITEM_PRICE;
	payload: {
		value: string;
	};
}

export function setPrice(value: string): SetPriceAction {
	return {
		type: ActionTypes.SET_ITEM_PRICE,
		payload: {
			value
		}
	};
}

export interface SetWeightAction {
	type: ActionTypes.SET_ITEM_WEIGHT;
	payload: {
		value: string;
	};
}

export function setWeight(value: string): SetWeightAction {
	return {
		type: ActionTypes.SET_ITEM_WEIGHT,
		payload: {
			value
		}
	};
}

export interface SetAmountAction {
	type: ActionTypes.SET_ITEM_AMOUNT;
	payload: {
		value: string;
	};
}

export function setAmount(value: string): SetAmountAction {
	return {
		type: ActionTypes.SET_ITEM_AMOUNT,
		payload: {
			value
		}
	};
}

export interface SetWhereAction {
	type: ActionTypes.SET_ITEM_WHERE;
	payload: {
		value: string;
	};
}

export function setWhere(value: string): SetWhereAction {
	return {
		type: ActionTypes.SET_ITEM_WHERE,
		payload: {
			value
		}
	};
}

export interface SetGroupAction {
	type: ActionTypes.SET_ITEM_GROUP;
	payload: {
		gr: number;
	};
}

export function setGroup(gr: number): SetGroupAction {
	return {
		type: ActionTypes.SET_ITEM_GROUP,
		payload: {
			gr
		}
	};
}

export interface SetTemplateAction {
	type: ActionTypes.SET_ITEM_TEMPLATE;
	payload: {
		template: string;
	};
}

export function setTemplate(template: string): SetTemplateAction {
	return {
		type: ActionTypes.SET_ITEM_TEMPLATE,
		payload: {
			template
		}
	};
}

export interface SetCombatTechniqueAction {
	type: ActionTypes.SET_ITEM_COMBAT_TECHNIQUE;
	payload: {
		id: string;
	};
}

export function setCombatTechnique(id: string): SetCombatTechniqueAction {
	return {
		type: ActionTypes.SET_ITEM_COMBAT_TECHNIQUE,
		payload: {
			id
		}
	};
}

export interface SetDamageDiceNumberAction {
	type: ActionTypes.SET_ITEM_DAMAGE_DICE_NUMBER;
	payload: {
		value: string;
	};
}

export function setDamageDiceNumber(value: string): SetDamageDiceNumberAction {
	return {
		type: ActionTypes.SET_ITEM_DAMAGE_DICE_NUMBER,
		payload: {
			value
		}
	};
}

export interface SetDamageDiceSidesAction {
	type: ActionTypes.SET_ITEM_DAMAGE_DICE_SIDES;
	payload: {
		value: number;
	};
}

export function setDamageDiceSides(value: number): SetDamageDiceSidesAction {
	return {
		type: ActionTypes.SET_ITEM_DAMAGE_DICE_SIDES,
		payload: {
			value
		}
	};
}

export interface SetDamageFlatAction {
	type: ActionTypes.SET_ITEM_DAMAGE_FLAT;
	payload: {
		value: string;
	};
}

export function setDamageFlat(value: string): SetDamageFlatAction {
	return {
		type: ActionTypes.SET_ITEM_DAMAGE_FLAT,
		payload: {
			value
		}
	};
}

export interface SetPrimaryAttributeAction {
	type: ActionTypes.SET_ITEM_PRIMARY_ATTRIBUTE;
	payload: {
		primary: string | undefined;
	};
}

export function setPrimaryAttribute(primary: string | undefined): SetPrimaryAttributeAction {
	return {
		type: ActionTypes.SET_ITEM_PRIMARY_ATTRIBUTE,
		payload: {
			primary
		}
	};
}

export interface SetDamageThresholdAction {
	type: ActionTypes.SET_ITEM_DAMAGE_THRESHOLD;
	payload: {
		value: string;
	};
}

export function setDamageThreshold(value: string): SetDamageThresholdAction {
	return {
		type: ActionTypes.SET_ITEM_DAMAGE_THRESHOLD,
		payload: {
			value
		}
	};
}

export interface SetFirstDamageThresholdAction {
	type: ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD;
	payload: {
		value: string;
	};
}

export function setFirstDamageThreshold(value: string): SetFirstDamageThresholdAction {
	return {
		type: ActionTypes.SET_ITEM_FIRST_DAMAGE_THRESHOLD,
		payload: {
			value
		}
	};
}

export interface SetSecondDamageThresholdAction {
	type: ActionTypes.SET_ITEM_SECOND_DAMAGE_THRESHOLD;
	payload: {
		value: string;
	};
}

export function setSecondDamageThreshold(value: string): SetSecondDamageThresholdAction {
	return {
		type: ActionTypes.SET_ITEM_SECOND_DAMAGE_THRESHOLD,
		payload: {
			value
		}
	};
}

export interface SwitchIsDamageThresholdSeparatedAction {
	type: ActionTypes.SWITCH_IS_ITEM_DAMAGE_THRESHOLD_SEPARATED;
}

export function switchIsDamageThresholdSeparated(): SwitchIsDamageThresholdSeparatedAction {
	return {
		type: ActionTypes.SWITCH_IS_ITEM_DAMAGE_THRESHOLD_SEPARATED
	};
}

export interface SetAttackAction {
	type: ActionTypes.SET_ITEM_ATTACK;
	payload: {
		value: string;
	};
}

export function setAttack(value: string): SetAttackAction {
	return {
		type: ActionTypes.SET_ITEM_ATTACK,
		payload: {
			value
		}
	};
}

export interface SetParryAction {
	type: ActionTypes.SET_ITEM_PARRY;
	payload: {
		value: string;
	};
}

export function setParry(value: string): SetParryAction {
	return {
		type: ActionTypes.SET_ITEM_PARRY,
		payload: {
			value
		}
	};
}

export interface SetReachAction {
	type: ActionTypes.SET_ITEM_REACH;
	payload: {
		id: number;
	};
}

export function setReach(id: number): SetReachAction {
	return {
		type: ActionTypes.SET_ITEM_REACH,
		payload: {
			id
		}
	};
}

export interface SetLengthAction {
	type: ActionTypes.SET_ITEM_LENGTH;
	payload: {
		value: string;
	};
}

export function setLength(value: string): SetLengthAction {
	return {
		type: ActionTypes.SET_ITEM_LENGTH,
		payload: {
			value
		}
	};
}

export interface SetStructurePointsAction {
	type: ActionTypes.SET_ITEM_STRUCTURE_POINTS;
	payload: {
		value: string;
	};
}

export function setStructurePoints(value: string): SetStructurePointsAction {
	return {
		type: ActionTypes.SET_ITEM_STRUCTURE_POINTS,
		payload: {
			value
		}
	};
}

export interface SetRangeAction {
	type: ActionTypes.SET_ITEM_RANGE;
	payload: {
		value: string;
		index: number;
	};
}

export function setRange(value: string, index: number): SetRangeAction {
	return {
		type: ActionTypes.SET_ITEM_RANGE,
		payload: {
			value,
			index
		}
	};
}

export interface SetReloadTimeAction {
	type: ActionTypes.SET_ITEM_RELOAD_TIME;
	payload: {
		value: string;
	};
}

export function setReloadTime(value: string): SetReloadTimeAction {
	return {
		type: ActionTypes.SET_ITEM_RELOAD_TIME,
		payload: {
			value
		}
	};
}

export interface SetAmmunitionAction {
	type: ActionTypes.SET_ITEM_AMMUNITION;
	payload: {
		id: string;
	};
}

export function setAmmunition(id: string): SetAmmunitionAction {
	return {
		type: ActionTypes.SET_ITEM_AMMUNITION,
		payload: {
			id
		}
	};
}

export interface SetProtectionAction {
	type: ActionTypes.SET_ITEM_PROTECTION;
	payload: {
		value: string;
	};
}

export function setProtection(value: string): SetProtectionAction {
	return {
		type: ActionTypes.SET_ITEM_PROTECTION,
		payload: {
			value
		}
	};
}

export interface SetEncumbranceAction {
	type: ActionTypes.SET_ITEM_ENCUMBRANCE;
	payload: {
		value: string;
	};
}

export function setEncumbrance(value: string): SetEncumbranceAction {
	return {
		type: ActionTypes.SET_ITEM_ENCUMBRANCE,
		payload: {
			value
		}
	};
}

export interface SetMovementModifierAction {
	type: ActionTypes.SET_ITEM_MOVEMENT_MODIFIER;
	payload: {
		value: string;
	};
}

export function setMovementModifier(value: string): SetMovementModifierAction {
	return {
		type: ActionTypes.SET_ITEM_MOVEMENT_MODIFIER,
		payload: {
			value
		}
	};
}

export interface SetInitiativeModifierAction {
	type: ActionTypes.SET_ITEM_INITIATIVE_MODIFIER;
	payload: {
		value: string;
	};
}

export function setInitiativeModifier(value: string): SetInitiativeModifierAction {
	return {
		type: ActionTypes.SET_ITEM_INITIATIVE_MODIFIER,
		payload: {
			value
		}
	};
}

export interface SetStabilityModifierAction {
	type: ActionTypes.SET_ITEM_STABILITY_MODIFIER;
	payload: {
		value: string;
	};
}

export function setStabilityModifier(value: string): SetStabilityModifierAction {
	return {
		type: ActionTypes.SET_ITEM_STABILITY_MODIFIER,
		payload: {
			value
		}
	};
}

export interface SwitchIsParryingWeaponAction {
	type: ActionTypes.SWITCH_IS_ITEM_PARRYING_WEAPON;
}

export function switchIsParryingWeapon(): SwitchIsParryingWeaponAction {
	return {
		type: ActionTypes.SWITCH_IS_ITEM_PARRYING_WEAPON
	};
}

export interface SwitchIsTwoHandedWeaponAction {
	type: ActionTypes.SWITCH_IS_ITEM_TWO_HANDED_WEAPON;
}

export function switchIsTwoHandedWeapon(): SwitchIsTwoHandedWeaponAction {
	return {
		type: ActionTypes.SWITCH_IS_ITEM_TWO_HANDED_WEAPON
	};
}

export interface SwitchIsImprovisedWeaponAction {
	type: ActionTypes.SWITCH_IS_ITEM_IMPROVISED_WEAPON;
}

export function switchIsImprovisedWeapon(): SwitchIsImprovisedWeaponAction {
	return {
		type: ActionTypes.SWITCH_IS_ITEM_IMPROVISED_WEAPON
	};
}

export interface SetImprovisedWeaponGroupAction {
	type: ActionTypes.SET_ITEM_IMPROVISED_WEAPON_GROUP;
	payload: {
		gr: number;
	};
}

export function setImprovisedWeaponGroup(gr: number): SetImprovisedWeaponGroupAction {
	return {
		type: ActionTypes.SET_ITEM_IMPROVISED_WEAPON_GROUP,
		payload: {
			gr
		}
	};
}

export interface SetLossAction {
	type: ActionTypes.SET_ITEM_LOSS;
	payload: {
		id: number | undefined;
	};
}

export function setLoss(id: number | undefined): SetLossAction {
	return {
		type: ActionTypes.SET_ITEM_LOSS,
		payload: {
			id
		}
	};
}

export interface SwitchIsForArmorZonesOnlyAction {
	type: ActionTypes.SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY;
}

export function switchIsForArmorZonesOnly(): SwitchIsForArmorZonesOnlyAction {
	return {
		type: ActionTypes.SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY
	};
}

export interface SwitchHasAdditionalPenaltiesAction {
	type: ActionTypes.SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES;
}

export function setHasAdditionalPenalties(): SwitchHasAdditionalPenaltiesAction {
	return {
		type: ActionTypes.SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES
	};
}

export interface SetArmorTypeAction {
	type: ActionTypes.SET_ITEM_ARMOR_TYPE;
	payload: {
		id: number;
	};
}

export function setArmorType(id: number): SetArmorTypeAction {
	return {
		type: ActionTypes.SET_ITEM_ARMOR_TYPE,
		payload: {
			id
		}
	};
}

export interface ApplyItemTemplateAction {
	type: ActionTypes.APPLY_ITEM_TEMPLATE;
}

export function applyItemTemplate(): ApplyItemTemplateAction {
	return {
		type: ActionTypes.APPLY_ITEM_TEMPLATE
	};
}

export interface LockItemTemplateAction {
	type: ActionTypes.LOCK_ITEM_TEMPLATE;
}

export function lockItemTemplate(): LockItemTemplateAction {
	return {
		type: ActionTypes.LOCK_ITEM_TEMPLATE
	};
}

export interface UnlockItemTemplateAction {
	type: ActionTypes.UNLOCK_ITEM_TEMPLATE;
}

export function unlockItemTemplate(): UnlockItemTemplateAction {
	return {
		type: ActionTypes.UNLOCK_ITEM_TEMPLATE
	};
}

export interface AddArmorZonesAction {
	type: ActionTypes.ADD_ARMOR_ZONES;
	payload: {
		newId: string;
	};
}

export function addArmorZonesToList(): AsyncAction {
	return (dispatch, getState) => {
		const newId = `ARMORZONES_${getNewId([...getArmorZonesState(getState()).keys()])}`;
		dispatch<AddArmorZonesAction>({
			type: ActionTypes.ADD_ARMOR_ZONES,
			payload: {
				newId
			}
		});
	};
}

export interface CreateArmorZonesAction {
	type: ActionTypes.CREATE_ARMOR_ZONES;
}

export function createArmorZones(): CreateArmorZonesAction {
	return {
		type: ActionTypes.CREATE_ARMOR_ZONES
	};
}

export interface CloseArmorZonesEditorAction {
	type: ActionTypes.CLOSE_ARMOR_ZONES_EDITOR;
}

export function closeArmorZonesEditor(): CloseArmorZonesEditorAction {
	return {
		type: ActionTypes.CLOSE_ARMOR_ZONES_EDITOR
	};
}

export interface SaveArmorZonesAction {
	type: ActionTypes.SAVE_ARMOR_ZONES;
}

export function saveArmorZones(): SaveArmorZonesAction {
	return {
		type: ActionTypes.SAVE_ARMOR_ZONES
	};
}

export interface EditArmorZonesAction {
	type: ActionTypes.EDIT_ARMOR_ZONES;
	payload: {
		id: string;
	};
}

export function editArmorZones(id: string): EditArmorZonesAction {
	return {
			type: ActionTypes.EDIT_ARMOR_ZONES,
			payload: {
				id
			}
		};
}

export interface RemoveArmorZonesAction {
	type: ActionTypes.REMOVE_ARMOR_ZONES;
	payload: {
		id: string;
	};
}

export function removeArmorZonesFromList(id: string): RemoveArmorZonesAction {
	return {
		type: ActionTypes.REMOVE_ARMOR_ZONES,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesNameAction {
	type: ActionTypes.SET_ARMOR_ZONES_NAME;
	payload: {
		value: string;
	};
}

export function setArmorZonesName(value: string): SetArmorZonesNameAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_NAME,
		payload: {
			value
		}
	};
}

export interface SetArmorZonesHeadAction {
	type: ActionTypes.SET_ARMOR_ZONES_HEAD;
	payload: {
		id: string | undefined;
	};
}

export function setArmorZonesHead(id: string | undefined): SetArmorZonesHeadAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_HEAD,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesHeadLossAction {
	type: ActionTypes.SET_ARMOR_ZONES_HEAD_LOSS;
	payload: {
		id: number | undefined;
	};
}

export function setArmorZonesHeadLoss(id: number | undefined): SetArmorZonesHeadLossAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_HEAD_LOSS,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesLeftArmAction {
	type: ActionTypes.SET_ARMOR_ZONES_LEFT_ARM;
	payload: {
		id: string | undefined;
	};
}

export function setArmorZonesLeftArm(id: string | undefined): SetArmorZonesLeftArmAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_LEFT_ARM,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesLeftArmLossAction {
	type: ActionTypes.SET_ARMOR_ZONES_LEFT_ARM_LOSS;
	payload: {
		id: number | undefined;
	};
}

export function setArmorZonesLeftArmLoss(id: number | undefined): SetArmorZonesLeftArmLossAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_LEFT_ARM_LOSS,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesLeftLegAction {
	type: ActionTypes.SET_ARMOR_ZONES_LEFT_LEG;
	payload: {
		id: string | undefined;
	};
}

export function setArmorZonesLeftLeg(id: string | undefined): SetArmorZonesLeftLegAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_LEFT_LEG,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesLeftLegLossAction {
	type: ActionTypes.SET_ARMOR_ZONES_LEFT_LEG_LOSS;
	payload: {
		id: number | undefined;
	};
}

export function setArmorZonesLeftLegLoss(id: number | undefined): SetArmorZonesLeftLegLossAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_LEFT_LEG_LOSS,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesTorsoAction {
	type: ActionTypes.SET_ARMOR_ZONES_TORSO;
	payload: {
		id: string | undefined;
	};
}

export function setArmorZonesTorso(id: string | undefined): SetArmorZonesTorsoAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_TORSO,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesTorsoLossAction {
	type: ActionTypes.SET_ARMOR_ZONES_TORSO_LOSS;
	payload: {
		id: number | undefined;
	};
}

export function setArmorZonesTorsoLoss(id: number | undefined): SetArmorZonesTorsoLossAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_TORSO_LOSS,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesRightArmAction {
	type: ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM;
	payload: {
		id: string | undefined;
	};
}

export function setArmorZonesRightArm(id: string | undefined): SetArmorZonesRightArmAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesRightArmLossAction {
	type: ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM_LOSS;
	payload: {
		id: number | undefined;
	};
}

export function setArmorZonesRightArmLoss(id: number | undefined): SetArmorZonesRightArmLossAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_RIGHT_ARM_LOSS,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesRightLegAction {
	type: ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG;
	payload: {
		id: string | undefined;
	};
}

export function setArmorZonesRightLeg(id: string | undefined): SetArmorZonesRightLegAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG,
		payload: {
			id
		}
	};
}

export interface SetArmorZonesRightLegLossAction {
	type: ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG_LOSS;
	payload: {
		id: number | undefined;
	};
}

export function setArmorZonesRightLegLoss(id: number | undefined): SetArmorZonesRightLegLossAction {
	return {
		type: ActionTypes.SET_ARMOR_ZONES_RIGHT_LEG_LOSS,
		payload: {
			id
		}
	};
}

export interface SetMeleeItemTemplatesCombatTechniqueFilterAction {
	type: ActionTypes.SET_MELEE_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER;
	payload: {
		filterOption: string | undefined;
	};
}

export function setMeleeItemTemplatesCombatTechniqueFilter(filterOption: string | undefined): SetMeleeItemTemplatesCombatTechniqueFilterAction {
	return {
		type: ActionTypes.SET_MELEE_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER,
		payload: {
			filterOption
		}
	};
}

export interface SetRangedItemTemplatesCombatTechniqueFilterAction {
	type: ActionTypes.SET_RANGED_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER;
	payload: {
		filterOption: string | undefined;
	};
}

export function setRangedItemTemplatesCombatTechniqueFilter(filterOption: string | undefined): SetRangedItemTemplatesCombatTechniqueFilterAction {
	return {
		type: ActionTypes.SET_RANGED_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER,
		payload: {
			filterOption
		}
	};
}

export interface SetEquipmentFilterTextAction {
	type: ActionTypes.SET_EQUIPMENT_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setEquipmentFilterText(filterText: string): SetEquipmentFilterTextAction {
	return {
		type: ActionTypes.SET_EQUIPMENT_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}

export interface SetItemTemplatesFilterTextAction {
	type: ActionTypes.SET_ITEM_TEMPLATES_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setItemTemplatesFilterText(filterText: string): SetItemTemplatesFilterTextAction {
	return {
		type: ActionTypes.SET_ITEM_TEMPLATES_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}

export interface SetZoneArmorFilterTextAction {
	type: ActionTypes.SET_ZONE_ARMOR_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setZoneArmorFilterText(filterText: string): SetZoneArmorFilterTextAction {
	return {
		type: ActionTypes.SET_ZONE_ARMOR_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}
