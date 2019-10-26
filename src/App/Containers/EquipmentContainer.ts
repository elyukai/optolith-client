import { connect } from "react-redux";
import { Maybe } from "../../Data/Maybe";
import { ReduxDispatch } from "../Actions/Actions";
import * as EquipmentActions from "../Actions/EquipmentActions";
import { MeleeCombatTechniqueId, RangedCombatTechniqueId } from "../Constants/Ids";
import { AppStateRecord } from "../Reducers/appReducer";
import { getInitialStartingWealth } from "../Selectors/activatableSelectors";
import { getHasCurrentNoAddedAP } from "../Selectors/adventurePointsSelectors";
import { getCarryingCapacity } from "../Selectors/attributeSelectors";
import { getFilteredCombatTechniques } from "../Selectors/combatTechniquesSelectors";
import { getAvailableSortedEquipmentGroups, getFilteredItems, getFilteredItemTemplates, getTotalPrice, getTotalWeight } from "../Selectors/equipmentSelectors";
import { getEquipmentFilterText, getItemTemplatesFilterText, getPurse } from "../Selectors/stateSelectors";
import { getEquipmentSortOrder, getMeleeItemTemplateCombatTechniqueFilter, getRangedItemTemplateCombatTechniqueFilter } from "../Selectors/uisettingsSelectors";
import { EquipmentSortOptions } from "../Utilities/Raw/JSON/Config";
import { Equipment, EquipmentDispatchProps, EquipmentOwnProps, EquipmentStateProps } from "../Views/Equipment/Equipment";

const mapStateToProps =
  (state: AppStateRecord, ownProps: EquipmentOwnProps): EquipmentStateProps => ({
    combatTechniques: getFilteredCombatTechniques (state, ownProps),
    carryingCapacity: getCarryingCapacity (state, ownProps),
    initialStartingWealth: getInitialStartingWealth (state),
    items: getFilteredItems (state, ownProps),
    hasNoAddedAP: getHasCurrentNoAddedAP (state),
    purse: getPurse (state),
    sortOrder: getEquipmentSortOrder (state),
    templates: getFilteredItemTemplates (state, ownProps),
    totalPrice: getTotalPrice (state, ownProps),
    totalWeight: getTotalWeight (state, ownProps),
    meleeItemTemplateCombatTechniqueFilter: getMeleeItemTemplateCombatTechniqueFilter (state),
    rangedItemTemplateCombatTechniqueFilter: getRangedItemTemplateCombatTechniqueFilter (state),
    filterText: getEquipmentFilterText (state),
    templatesFilterText: getItemTemplatesFilterText (state),
    filteredEquipmentGroups: getAvailableSortedEquipmentGroups (state, ownProps),
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
