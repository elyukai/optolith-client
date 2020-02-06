import { connect } from "react-redux"
import { Maybe } from "../../Data/Maybe"
import { ReduxDispatch } from "../Actions/Actions"
import * as EquipmentActions from "../Actions/EquipmentActions"
import { AppStateRecord } from "../Models/AppState"
import { getSortedTemplates } from "../Selectors/equipmentSelectors"
import { getIsItemCreation, getItemEditorInstance, getWikiAttributes, getWikiCombatTechniques } from "../Selectors/stateSelectors"
import { ItemEditor, ItemEditorDispatchProps, ItemEditorOwnProps, ItemEditorStateProps } from "../Views/Equipment/ItemEditor"

const mapStateToProps =
  (state: AppStateRecord, ownProps: ItemEditorOwnProps): ItemEditorStateProps => ({
    attributes: getWikiAttributes (state),
    combatTechniques: getWikiCombatTechniques (state),
    isInCreation: getIsItemCreation (state),
    item: getItemEditorInstance (state),
    templates: getSortedTemplates (state, ownProps),
  })

const mapDispatchToProps = (dispatch: ReduxDispatch): ItemEditorDispatchProps => ({
  addToList (): void {
    dispatch (EquipmentActions.addItem)
  },
  closeEditor (): void {
    dispatch (EquipmentActions.closeItemEditor ())
  },
  saveItem (): void {
    dispatch (EquipmentActions.saveItem ())
  },
  setName (value: string): void {
    dispatch (EquipmentActions.setName (value))
  },
  setPrice (value: string): void {
    dispatch (EquipmentActions.setPrice (value))
  },
  setWeight (value: string): void {
    dispatch (EquipmentActions.setWeight (value))
  },
  setAmount (value: string): void {
    dispatch (EquipmentActions.setAmount (value))
  },
  setWhere (value: string): void {
    dispatch (EquipmentActions.setWhere (value))
  },
  setGroup (gr: number): void {
    dispatch (EquipmentActions.setGroup (gr))
  },
  setTemplate (template: string): void {
    dispatch (EquipmentActions.setTemplate (template))
  },
  setCombatTechnique (id: string): void {
    dispatch (EquipmentActions.setCombatTechnique (id))
  },
  setDamageDiceNumber (value: string): void {
    dispatch (EquipmentActions.setDamageDiceNumber (value))
  },
  setDamageDiceSides (value: number): void {
    dispatch (EquipmentActions.setDamageDiceSides (value))
  },
  setDamageFlat (value: string): void {
    dispatch (EquipmentActions.setDamageFlat (value))
  },
  setPrimaryAttribute (primary: Maybe<string>): void {
    dispatch (EquipmentActions.setPrimaryAttribute (primary))
  },
  setDamageThreshold (value: string): void {
    dispatch (EquipmentActions.setDamageThreshold (value))
  },
  setFirstDamageThreshold (value: string): void {
    dispatch (EquipmentActions.setFirstDamageThreshold (value))
  },
  setSecondDamageThreshold (value: string): void {
    dispatch (EquipmentActions.setSecondDamageThreshold (value))
  },
  switchIsDamageThresholdSeparated (): void {
    dispatch (EquipmentActions.switchIsDamageThresholdSeparated ())
  },
  setAttack (value: string): void {
    dispatch (EquipmentActions.setAttack (value))
  },
  setParry (value: string): void {
    dispatch (EquipmentActions.setParry (value))
  },
  setReach (id: number): void {
    dispatch (EquipmentActions.setReach (id))
  },
  setLength (value: string): void {
    dispatch (EquipmentActions.setLength (value))
  },
  setStructurePoints (value: string): void {
    dispatch (EquipmentActions.setStructurePoints (value))
  },
  setRange (index: 1 | 2 | 3): (value: string) => void {
    return value => dispatch (EquipmentActions.setRange (value, index))
  },
  setReloadTime (value: string): void {
    dispatch (EquipmentActions.setReloadTime (value))
  },
  setAmmunition (id: string): void {
    dispatch (EquipmentActions.setAmmunition (id))
  },
  setProtection (value: string): void {
    dispatch (EquipmentActions.setProtection (value))
  },
  setEncumbrance (value: string): void {
    dispatch (EquipmentActions.setEncumbrance (value))
  },
  setMovementModifier (value: string): void {
    dispatch (EquipmentActions.setMovementModifier (value))
  },
  setInitiativeModifier (value: string): void {
    dispatch (EquipmentActions.setInitiativeModifier (value))
  },
  setStabilityModifier (value: string): void {
    dispatch (EquipmentActions.setStabilityModifier (value))
  },
  switchIsParryingWeapon (): void {
    dispatch (EquipmentActions.switchIsParryingWeapon ())
  },
  switchIsTwoHandedWeapon (): void {
    dispatch (EquipmentActions.switchIsTwoHandedWeapon ())
  },
  switchIsImprovisedWeapon (): void {
    dispatch (EquipmentActions.switchIsImprovisedWeapon ())
  },
  setImprovisedWeaponGroup (gr: number): void {
    dispatch (EquipmentActions.setImprovisedWeaponGroup (gr))
  },
  setLoss (id: Maybe<number>): void {
    dispatch (EquipmentActions.setLoss (id))
  },
  switchIsForArmorZonesOnly (): void {
    dispatch (EquipmentActions.switchIsForArmorZonesOnly ())
  },
  setHasAdditionalPenalties (): void {
    dispatch (EquipmentActions.setHasAdditionalPenalties ())
  },
  setArmorType (id: number): void {
    dispatch (EquipmentActions.setArmorType (id))
  },
  applyTemplate (): void {
    dispatch (EquipmentActions.applyItemTemplate)
  },
  lockTemplate (): void {
    dispatch (EquipmentActions.lockItemTemplate)
  },
  unlockTemplate (): void {
    dispatch (EquipmentActions.unlockItemTemplate ())
  },
})

export const connectItemEditor =
  connect<ItemEditorStateProps, ItemEditorDispatchProps, ItemEditorOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const ItemEditorContainer = connectItemEditor (ItemEditor)
