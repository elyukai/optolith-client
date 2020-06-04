import { connect } from "react-redux"
import { Maybe } from "../../Data/Maybe"
import { ReduxDispatch } from "../Actions/Actions"
import * as EquipmentActions from "../Actions/EquipmentActions"
import * as SubwindowsActions from "../Actions/SubwindowsActions"
import { MeleeCombatTechniqueId, RangedCombatTechniqueId } from "../Constants/Ids"
import { AppStateRecord } from "../Models/AppState"
import { EquipmentSortOptions } from "../Models/Config"
import { getInitialStartingWealth } from "../Selectors/activatableSelectors"
import { getHasCurrentNoAddedAP } from "../Selectors/adventurePointsSelectors"
import { getCarryingCapacity } from "../Selectors/attributeSelectors"
import { getFilteredCombatTechniques } from "../Selectors/combatTechniquesSelectors"
import { getAvailableSortedEquipmentGroups, getFilteredItems, getFilteredItemTemplates, getTotalPrice, getTotalWeight } from "../Selectors/equipmentSelectors"
import { getEquipmentFilterText, getItemTemplatesFilterText, getPurse, getIsAddRemoveMoneyOpen } from "../Selectors/stateSelectors"
import { getEquipmentSortOrder, getMeleeItemTemplateCombatTechniqueFilter, getRangedItemTemplateCombatTechniqueFilter } from "../Selectors/uisettingsSelectors"
import { Equipment, EquipmentDispatchProps, EquipmentOwnProps, EquipmentStateProps } from "../Views/Equipment/Equipment"

const mapStateToProps =
  (state: AppStateRecord, ownProps: EquipmentOwnProps): EquipmentStateProps => ({
    combatTechniques: getFilteredCombatTechniques (state, ownProps),
    carryingCapacity: getCarryingCapacity (state, ownProps),
    initialStartingWealth: getInitialStartingWealth (state),
    items: getFilteredItems (state),
    hasNoAddedAP: getHasCurrentNoAddedAP (state),
    purse: getPurse (state),
    sortOrder: getEquipmentSortOrder (state),
    templates: getFilteredItemTemplates (state, ownProps),
    totalPrice: getTotalPrice (state),
    totalWeight: getTotalWeight (state),
    meleeItemTemplateCombatTechniqueFilter: getMeleeItemTemplateCombatTechniqueFilter (state),
    rangedItemTemplateCombatTechniqueFilter: getRangedItemTemplateCombatTechniqueFilter (state),
    filterText: getEquipmentFilterText (state),
    templatesFilterText: getItemTemplatesFilterText (state),
    filteredEquipmentGroups: getAvailableSortedEquipmentGroups (state, ownProps),
    isAddRemoveMoneyOpen: getIsAddRemoveMoneyOpen (state),
  })

const mapDispatchToProps = (dispatch: ReduxDispatch): EquipmentDispatchProps => ({
  addTemplateToList (id: string): void {
    dispatch (EquipmentActions.addTemplateToList (id))
  },
  createItem (): void {
    dispatch (EquipmentActions.createItem ())
  },
  editItem (id: string): void {
    dispatch (EquipmentActions.editItem (id))
  },
  deleteItem (id: string) {
    dispatch (EquipmentActions.removeItem (id))
  },
  setSortOrder (option: EquipmentSortOptions) {
    dispatch (EquipmentActions.setItemsSortOrder (option))
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
  setMeleeItemTemplatesCombatTechniqueFilter (filterOption: Maybe<MeleeCombatTechniqueId>) {
    dispatch (EquipmentActions.setMeleeItemTemplatesCombatTechniqueFilter (filterOption))
  },
  setRangedItemTemplatesCombatTechniqueFilter (filterOption: Maybe<RangedCombatTechniqueId>) {
    dispatch (EquipmentActions.setRangedItemTemplatesCombatTechniqueFilter (filterOption))
  },
  setFilterText (filterText: string) {
    dispatch (EquipmentActions.setEquipmentFilterText (filterText))
  },
  setTemplatesFilterText (filterText: string) {
    dispatch (EquipmentActions.setItemTemplatesFilterText (filterText))
  },
})

export const connectEquipment =
  connect<EquipmentStateProps, EquipmentDispatchProps, EquipmentOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const EquipmentContainer = connectEquipment (Equipment)
