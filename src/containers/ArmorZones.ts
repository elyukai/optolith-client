import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as EquipmentActions from '../actions/EquipmentActions';
import { AppState } from '../reducers/app';
import { getInitialStartingWealth } from '../selectors/activatableSelectors';
import { getTotal } from '../selectors/adventurePointsSelectors';
import { getCarryingCapacity } from '../selectors/attributeSelectors';
import { getStartEl } from '../selectors/elSelectors';
import { getArmorZoneInstances, getItems, getPurse, getTemplates, getTotalPrice, getTotalWeight } from '../selectors/equipmentSelectors';
import { ArmorZonesEditorInstance, ArmorZonesInstance } from '../types/data.d';
import { ArmorZones, ArmorZonesDispatchProps, ArmorZonesOwnProps, ArmorZonesStateProps } from '../views/belongings/ArmorZones';

function mapStateToProps(state: AppState) {
	return {
		armorZones: getArmorZoneInstances(state),
		carryingCapacity: getCarryingCapacity(state),
		initialStartingWealth: getInitialStartingWealth(state),
		items: getItems(state),
		hasNoAddedAP: getTotal(state) === getStartEl(state).ap,
		purse: getPurse(state),
		templates: getTemplates(state),
		totalPrice: getTotalPrice(state),
		totalWeight: getTotalWeight(state)
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addToList(item: ArmorZonesEditorInstance) {
			dispatch(EquipmentActions._addArmorZonesToList(item));
		},
		deleteItem(id: string) {
			dispatch(EquipmentActions._removeArmorZonesFromList(id));
		},
		set(id: string, item: ArmorZonesEditorInstance) {
			dispatch(EquipmentActions._setArmorZones(id, item as ArmorZonesInstance));
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
		}
	};
}

export const ArmorZonesContainer = connect<ArmorZonesStateProps, ArmorZonesDispatchProps, ArmorZonesOwnProps>(mapStateToProps, mapDispatchToProps)(ArmorZones);
