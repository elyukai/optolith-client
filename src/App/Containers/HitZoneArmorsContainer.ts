import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as EquipmentActions from '../App/Actions/EquipmentActions';
import { AppState } from '../reducers/appReducer';
import { getInitialStartingWealth } from '../selectors/activatableSelectors';
import { getHasCurrentNoAddedAP } from '../selectors/adventurePointsSelectors';
import { getCarryingCapacity } from '../selectors/attributeSelectors';
import { getFilteredZoneArmors, getItems, getTemplates, getTotalPrice, getTotalWeight } from '../selectors/equipmentSelectors';
import { getArmorZonesEditorInstance, getIsInHitZoneArmorCreation, getPurse, getZoneArmorFilterText } from '../selectors/stateSelectors';
import { Maybe } from '../utils/dataUtils';
import { HitZoneArmors, HitZoneArmorsDispatchProps, HitZoneArmorsOwnProps, HitZoneArmorsStateProps } from '../views/hitZoneArmors/HitZoneArmors';

const mapStateToProps = (
  state: AppState,
  ownProps: HitZoneArmorsOwnProps
): HitZoneArmorsStateProps => ({
  armorZones: getFilteredZoneArmors (state, ownProps),
  carryingCapacity: getCarryingCapacity (state),
  initialStartingWealth: getInitialStartingWealth (state),
  items: getItems (state),
  isInHitZoneArmorCreation: getIsInHitZoneArmorCreation (state),
  armorZonesEditor: getArmorZonesEditorInstance (state),
  hasNoAddedAP: getHasCurrentNoAddedAP (state),
  purse: getPurse (state),
  templates: getTemplates (state),
  totalPrice: getTotalPrice (state, ownProps),
  totalWeight: getTotalWeight (state, ownProps),
  filterText: getZoneArmorFilterText (state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action, AppState>): HitZoneArmorsDispatchProps => ({
  addToList () {
    dispatch (EquipmentActions.addArmorZonesToList ());
  },
  createItem (): void {
    dispatch (EquipmentActions.createArmorZones ());
  },
  editItem (id: string): void {
    dispatch (EquipmentActions.editArmorZones (id));
  },
  deleteItem (id: string) {
    dispatch (EquipmentActions.removeArmorZonesFromList (id));
  },
  closeEditor (): void {
    dispatch (EquipmentActions.closeArmorZonesEditor ());
  },
  saveItem (): void {
    dispatch (EquipmentActions.saveArmorZones ());
  },
  setDucates (value: string) {
    dispatch (EquipmentActions.setDucates (value));
  },
  setSilverthalers (value: string) {
    dispatch (EquipmentActions.setSilverthalers (value));
  },
  setHellers (value: string) {
    dispatch (EquipmentActions.setHellers (value));
  },
  setKreutzers (value: string) {
    dispatch (EquipmentActions.setKreutzers (value));
  },
  setName (value: string): void {
    dispatch (EquipmentActions.setArmorZonesName (value));
  },
  setHead (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesHead (id));
  },
  setHeadLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesHeadLoss (id));
  },
  setLeftArm (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesLeftArm (id));
  },
  setLeftArmLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesLeftArmLoss (id));
  },
  setLeftLeg (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesLeftLeg (id));
  },
  setLeftLegLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesLeftLegLoss (id));
  },
  setTorso (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesTorso (id));
  },
  setTorsoLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesTorsoLoss (id));
  },
  setRightArm (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesRightArm (id));
  },
  setRightArmLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesRightArmLoss (id));
  },
  setRightLeg (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesRightLeg (id));
  },
  setRightLegLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesRightLegLoss (id));
  },
  setFilterText (filterText: string) {
    dispatch (EquipmentActions.setZoneArmorFilterText (filterText));
  },
});

export const connectHitZoneArmors =
  connect<HitZoneArmorsStateProps, HitZoneArmorsDispatchProps, HitZoneArmorsOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const HitZoneArmorsContainer = connectHitZoneArmors (HitZoneArmors);
