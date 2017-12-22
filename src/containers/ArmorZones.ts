import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as EquipmentActions from '../actions/EquipmentActions';
import { AppState } from '../reducers/app';
import { getInitialStartingWealth } from '../selectors/activatableSelectors';
import { getCarryingCapacity } from '../selectors/attributeSelectors';
import { getStartEl } from '../selectors/elSelectors';
import { getFilteredZoneArmors, getItems, getPurse, getTemplates, getTotalPrice, getTotalWeight } from '../selectors/equipmentSelectors';
import { getArmorZonesEditorInstance, getIsArmorZonesCreation, getTotalAdventurePoints, getZoneArmorFilterText } from '../selectors/stateSelectors';
import { ArmorZones, ArmorZonesDispatchProps, ArmorZonesOwnProps, ArmorZonesStateProps } from '../views/belongings/ArmorZones';

function mapStateToProps(state: AppState) {
	return {
		armorZones: getFilteredZoneArmors(state),
		carryingCapacity: getCarryingCapacity(state),
		initialStartingWealth: getInitialStartingWealth(state),
		items: getItems(state),
		create: getIsArmorZonesCreation(state),
		armorZonesEditor: getArmorZonesEditorInstance(state),
		hasNoAddedAP: getTotalAdventurePoints(state) === getStartEl(state).ap,
		purse: getPurse(state),
		templates: getTemplates(state),
		totalPrice: getTotalPrice(state),
		totalWeight: getTotalWeight(state),
		filterText: getZoneArmorFilterText(state)
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addToList() {
			dispatch(EquipmentActions.addArmorZonesToList());
		},
		createItem(): void {
      dispatch(EquipmentActions.createArmorZones());
    },
		editItem(id: string): void {
      dispatch(EquipmentActions.editArmorZones(id));
    },
		deleteItem(id: string) {
			dispatch(EquipmentActions.removeArmorZonesFromList(id));
		},
		closeEditor(): void {
      dispatch(EquipmentActions.closeArmorZonesEditor());
    },
		saveItem(): void {
      dispatch(EquipmentActions.saveArmorZones());
    },
		setDucates(value: string) {
			dispatch(EquipmentActions._setDucates(value));
		},
		setSilverthalers(value: string) {
			dispatch(EquipmentActions._setSilverthalers(value));
		},
		setHellers(value: string) {
			dispatch(EquipmentActions._setHellers(value));
		},
		setKreutzers(value: string) {
			dispatch(EquipmentActions._setKreutzers(value));
		},
		setName(value: string): void {
      dispatch(EquipmentActions.setArmorZonesName(value));
    },
		setHead(id: string | undefined): void {
      dispatch(EquipmentActions.setArmorZonesHead(id));
    },
		setHeadLoss(id: number | undefined): void {
      dispatch(EquipmentActions.setArmorZonesHeadLoss(id));
    },
		setLeftArm(id: string | undefined): void {
      dispatch(EquipmentActions.setArmorZonesLeftArm(id));
    },
		setLeftArmLoss(id: number | undefined): void {
      dispatch(EquipmentActions.setArmorZonesLeftArmLoss(id));
    },
		setLeftLeg(id: string | undefined): void {
      dispatch(EquipmentActions.setArmorZonesLeftLeg(id));
    },
		setLeftLegLoss(id: number | undefined): void {
      dispatch(EquipmentActions.setArmorZonesLeftLegLoss(id));
    },
		setTorso(id: string | undefined): void {
      dispatch(EquipmentActions.setArmorZonesTorso(id));
    },
		setTorsoLoss(id: number | undefined): void {
      dispatch(EquipmentActions.setArmorZonesTorsoLoss(id));
    },
		setRightArm(id: string | undefined): void {
      dispatch(EquipmentActions.setArmorZonesRightArm(id));
    },
		setRightArmLoss(id: number | undefined): void {
      dispatch(EquipmentActions.setArmorZonesRightArmLoss(id));
    },
		setRightLeg(id: string | undefined): void {
      dispatch(EquipmentActions.setArmorZonesRightLeg(id));
    },
		setRightLegLoss(id: number | undefined): void {
      dispatch(EquipmentActions.setArmorZonesRightLegLoss(id));
    },
		setFilterText(filterText: string) {
			dispatch(EquipmentActions.setZoneArmorFilterText(filterText));
		},
	};
}

export const ArmorZonesContainer = connect<ArmorZonesStateProps, ArmorZonesDispatchProps, ArmorZonesOwnProps>(mapStateToProps, mapDispatchToProps)(ArmorZones);
