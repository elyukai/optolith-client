import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as EquipmentActions from '../actions/EquipmentActions';
import { AppState } from '../reducers/app';
import { getAllCombatTechniques } from '../selectors/combatTechniquesSelectors';
import { getSortedTemplates } from '../selectors/equipmentSelectors';
import { getAttributes, getIsItemCreation, getItemEditorInstance } from '../selectors/stateSelectors';
import { ItemEditor, ItemEditorDispatchProps, ItemEditorOwnProps, ItemEditorStateProps } from '../views/belongings/ItemEditor';

function mapStateToProps(state: AppState) {
	return {
		attributes: getAttributes(state),
		combatTechniques: getAllCombatTechniques(state),
		create: getIsItemCreation(state),
		item: getItemEditorInstance(state),
		templates: getSortedTemplates(state)
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addToList(): void {
      dispatch<any>(EquipmentActions.addToList());
    },
		closeEditor(): void {
      dispatch<any>(EquipmentActions.closeItemEditor());
    },
		saveItem(): void {
      dispatch<any>(EquipmentActions.saveItem());
    },
		setName(value: string): void {
      dispatch<any>(EquipmentActions.setName(value));
    },
		setPrice(value: string): void {
      dispatch<any>(EquipmentActions.setPrice(value));
    },
		setWeight(value: string): void {
      dispatch<any>(EquipmentActions.setWeight(value));
    },
		setAmount(value: string): void {
      dispatch<any>(EquipmentActions.setAmount(value));
    },
		setWhere(value: string): void {
      dispatch<any>(EquipmentActions.setWhere(value));
    },
		setGroup(gr: number): void {
      dispatch<any>(EquipmentActions.setGroup(gr));
    },
		setTemplate(template: string): void {
      dispatch<any>(EquipmentActions.setTemplate(template));
    },
		setCombatTechnique(id: string): void {
      dispatch<any>(EquipmentActions.setCombatTechnique(id));
    },
		setDamageDiceNumber(value: string): void {
      dispatch<any>(EquipmentActions.setDamageDiceNumber(value));
    },
		setDamageDiceSides(value: number): void {
      dispatch<any>(EquipmentActions.setDamageDiceSides(value));
    },
		setDamageFlat(value: string): void {
      dispatch<any>(EquipmentActions.setDamageFlat(value));
    },
		setPrimaryAttribute(primary: string | undefined): void {
      dispatch<any>(EquipmentActions.setPrimaryAttribute(primary));
    },
		setDamageThreshold(value: string): void {
      dispatch<any>(EquipmentActions.setDamageThreshold(value));
    },
		setFirstDamageThreshold(value: string): void {
      dispatch<any>(EquipmentActions.setFirstDamageThreshold(value));
    },
		setSecondDamageThreshold(value: string): void {
      dispatch<any>(EquipmentActions.setSecondDamageThreshold(value));
    },
		switchIsDamageThresholdSeparated(): void {
      dispatch<any>(EquipmentActions.switchIsDamageThresholdSeparated());
    },
		setAttack(value: string): void {
      dispatch<any>(EquipmentActions.setAttack(value));
    },
		setParry(value: string): void {
      dispatch<any>(EquipmentActions.setParry(value));
    },
		setReach(id: number): void {
      dispatch<any>(EquipmentActions.setReach(id));
    },
		setLength(value: string): void {
      dispatch<any>(EquipmentActions.setLength(value));
    },
		setStructurePoints(value: string): void {
      dispatch<any>(EquipmentActions.setStructurePoints(value));
    },
		setRange(value: string, index: number): void {
      dispatch<any>(EquipmentActions.setRange(value, index));
    },
		setReloadTime(value: string): void {
      dispatch<any>(EquipmentActions.setReloadTime(value));
    },
		setAmmunition(id: string): void {
      dispatch<any>(EquipmentActions.setAmmunition(id));
    },
		setProtection(value: string): void {
      dispatch<any>(EquipmentActions.setProtection(value));
    },
		setEncumbrance(value: string): void {
      dispatch<any>(EquipmentActions.setEncumbrance(value));
    },
		setMovementModifier(value: string): void {
      dispatch<any>(EquipmentActions.setMovementModifier(value));
    },
		setInitiativeModifier(value: string): void {
      dispatch<any>(EquipmentActions.setInitiativeModifier(value));
    },
		setStabilityModifier(value: string): void {
      dispatch<any>(EquipmentActions.setStabilityModifier(value));
    },
		switchIsParryingWeapon(): void {
      dispatch<any>(EquipmentActions.switchIsParryingWeapon());
    },
		switchIsTwoHandedWeapon(): void {
      dispatch<any>(EquipmentActions.switchIsTwoHandedWeapon());
    },
		switchIsImprovisedWeapon(): void {
      dispatch<any>(EquipmentActions.switchIsImprovisedWeapon());
    },
		setImprovisedWeaponGroup(gr: number): void {
      dispatch<any>(EquipmentActions.setImprovisedWeaponGroup(gr));
    },
		setLoss(id: number | undefined): void {
      dispatch<any>(EquipmentActions.setLoss(id));
    },
		switchIsForArmorZonesOnly(): void {
      dispatch<any>(EquipmentActions.switchIsForArmorZonesOnly());
    },
		setHasAdditionalPenalties(): void {
      dispatch<any>(EquipmentActions.setHasAdditionalPenalties());
    },
		setArmorType(id: number): void {
      dispatch<any>(EquipmentActions.setArmorType(id));
    },
		applyTemplate(): void {
      dispatch<any>(EquipmentActions.applyItemTemplate());
    },
		lockTemplate(): void {
      dispatch<any>(EquipmentActions.lockItemTemplate());
    },
		unlockTemplate(): void {
      dispatch<any>(EquipmentActions.unlockItemTemplate());
    }
	};
}

export const ItemEditorContainer = connect<ItemEditorStateProps, ItemEditorDispatchProps, ItemEditorOwnProps>(mapStateToProps, mapDispatchToProps)(ItemEditor);
