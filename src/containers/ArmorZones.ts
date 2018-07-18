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
			dispatch<any>(EquipmentActions.addArmorZonesToList());
		},
		createItem(): void {
      dispatch<any>(EquipmentActions.createArmorZones());
    },
		editItem(id: string): void {
      dispatch<any>(EquipmentActions.editArmorZones(id));
    },
		deleteItem(id: string) {
			dispatch<any>(EquipmentActions.removeArmorZonesFromList(id));
		},
		closeEditor(): void {
      dispatch<any>(EquipmentActions.closeArmorZonesEditor());
    },
		saveItem(): void {
      dispatch<any>(EquipmentActions.saveArmorZones());
    },
		setDucates(value: string) {
			dispatch<any>(EquipmentActions._setDucates(value));
		},
		setSilverthalers(value: string) {
			dispatch<any>(EquipmentActions._setSilverthalers(value));
		},
		setHellers(value: string) {
			dispatch<any>(EquipmentActions._setHellers(value));
		},
		setKreutzers(value: string) {
			dispatch<any>(EquipmentActions._setKreutzers(value));
		},
		setName(value: string): void {
      dispatch<any>(EquipmentActions.setArmorZonesName(value));
    },
		setHead(id: string | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesHead(id));
    },
		setHeadLoss(id: number | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesHeadLoss(id));
    },
		setLeftArm(id: string | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesLeftArm(id));
    },
		setLeftArmLoss(id: number | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesLeftArmLoss(id));
    },
		setLeftLeg(id: string | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesLeftLeg(id));
    },
		setLeftLegLoss(id: number | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesLeftLegLoss(id));
    },
		setTorso(id: string | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesTorso(id));
    },
		setTorsoLoss(id: number | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesTorsoLoss(id));
    },
		setRightArm(id: string | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesRightArm(id));
    },
		setRightArmLoss(id: number | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesRightArmLoss(id));
    },
		setRightLeg(id: string | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesRightLeg(id));
    },
		setRightLegLoss(id: number | undefined): void {
      dispatch<any>(EquipmentActions.setArmorZonesRightLegLoss(id));
    },
		setFilterText(filterText: string) {
			dispatch<any>(EquipmentActions.setZoneArmorFilterText(filterText));
		},
	};
}

export const ArmorZonesContainer = connect<ArmorZonesStateProps, ArmorZonesDispatchProps, ArmorZonesOwnProps>(mapStateToProps, mapDispatchToProps)(ArmorZones);
