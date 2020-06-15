import { connect } from "react-redux"
import { Maybe } from "../../Data/Maybe"
import { ReduxDispatch } from "../Actions/Actions"
import * as EquipmentActions from "../Actions/EquipmentActions"
import * as SubwindowsActions from "../Actions/SubwindowsActions"
import { AppStateRecord } from "../Models/AppState"
import { getInitialStartingWealth } from "../Selectors/activatableSelectors"
import { getHasCurrentNoAddedAP } from "../Selectors/adventurePointsSelectors"
import { getCarryingCapacity } from "../Selectors/attributeSelectors"
import { getFilteredHitZoneArmors, getItems, getTemplates, getTotalPrice, getTotalWeight } from "../Selectors/equipmentSelectors"
import { getArmorZonesEditorInstance, getIsInHitZoneArmorCreation, getPurse, getZoneArmorFilterText, getIsAddRemoveMoneyOpen } from "../Selectors/stateSelectors"
import { HitZoneArmors, HitZoneArmorsDispatchProps, HitZoneArmorsOwnProps, HitZoneArmorsStateProps } from "../Views/HitZoneArmors/HitZoneArmors"

const mapStateToProps = (
  state: AppStateRecord,
  ownProps: HitZoneArmorsOwnProps
): HitZoneArmorsStateProps => ({
  armorZones: getFilteredHitZoneArmors (state),
  carryingCapacity: getCarryingCapacity (state, ownProps),
  initialStartingWealth: getInitialStartingWealth (state),
  items: getItems (state),
  isInHitZoneArmorCreation: getIsInHitZoneArmorCreation (state),
  armorZonesEditor: getArmorZonesEditorInstance (state),
  hasNoAddedAP: getHasCurrentNoAddedAP (state),
  purse: getPurse (state),
  templates: getTemplates (state),
  totalPrice: getTotalPrice (state),
  totalWeight: getTotalWeight (state),
  filterText: getZoneArmorFilterText (state),
  isAddRemoveMoneyOpen: getIsAddRemoveMoneyOpen (state),
})

const mapDispatchToProps = (dispatch: ReduxDispatch): HitZoneArmorsDispatchProps => ({
  addToList () {
    dispatch (EquipmentActions.addArmorZonesToList ())
  },
  createItem (): void {
    dispatch (EquipmentActions.createArmorZones ())
  },
  editItem (id: string): void {
    dispatch (EquipmentActions.editArmorZones (id))
  },
  deleteItem (id: string) {
    dispatch (EquipmentActions.removeArmorZonesFromList (id))
  },
  closeEditor (): void {
    dispatch (EquipmentActions.closeArmorZonesEditor ())
  },
  saveItem (): void {
    dispatch (EquipmentActions.saveArmorZones ())
  },
  setDucates (value: string) {
    dispatch (EquipmentActions.setDucates (value))
  },
  setSilverthalers (value: string) {
    dispatch (EquipmentActions.setSilverthalers (value))
  },
  setHellers (value: string) {
    dispatch (EquipmentActions.setHellers (value))
  },
  setKreutzers (value: string) {
    dispatch (EquipmentActions.setKreutzers (value))
  },
  setMoney (d: number, s: number, h: number, k: number) {
    dispatch (EquipmentActions.setMoney (d, s, h, k))
  },
  openAddRemoveMoney () {
    dispatch (SubwindowsActions.openAddRemoveMoney ())
  },
  closeAddRemoveMoney () {
    dispatch (SubwindowsActions.closeAddRemoveMoney ())
  },
  setName (value: string): void {
    dispatch (EquipmentActions.setArmorZonesName (value))
  },
  setHead (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesHead (id))
  },
  setHeadLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesHeadLoss (id))
  },
  setLeftArm (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesLeftArm (id))
  },
  setLeftArmLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesLeftArmLoss (id))
  },
  setLeftLeg (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesLeftLeg (id))
  },
  setLeftLegLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesLeftLegLoss (id))
  },
  setTorso (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesTorso (id))
  },
  setTorsoLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesTorsoLoss (id))
  },
  setRightArm (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesRightArm (id))
  },
  setRightArmLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesRightArmLoss (id))
  },
  setRightLeg (id: Maybe<string>): void {
    dispatch (EquipmentActions.setArmorZonesRightLeg (id))
  },
  setRightLegLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setArmorZonesRightLegLoss (id))
  },
  setFilterText (filterText: string) {
    dispatch (EquipmentActions.setZoneArmorFilterText (filterText))
  },
})

export const connectHitZoneArmors =
  connect<
    HitZoneArmorsStateProps, HitZoneArmorsDispatchProps, HitZoneArmorsOwnProps, AppStateRecord
  > (
    mapStateToProps,
    mapDispatchToProps
  )

export const HitZoneArmorsContainer = connectHitZoneArmors (HitZoneArmors)
