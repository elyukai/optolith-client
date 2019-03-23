import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as EquipmentActions from '../App/Actions/EquipmentActions';
import { AppState } from '../reducers/appReducer';
import { getInitialStartingWealth } from '../Selectors/activatableSelectors';
import { getHasCurrentNoAddedAP } from '../Selectors/adventurePointsSelectors';
import { getCarryingCapacity } from '../Selectors/attributeSelectors';
import { getFilteredCombatTechniques } from '../Selectors/combatTechniquesSelectors';
import { getFilteredItems, getFilteredItemTemplates, getTotalPrice, getTotalWeight } from '../Selectors/equipmentSelectors';
import { getEquipmentFilterText, getItemTemplatesFilterText, getPurse } from '../Selectors/stateSelectors';
import { getEquipmentSortOrder, getMeleeItemTemplateCombatTechniqueFilter, getRangedItemTemplateCombatTechniqueFilter } from '../Selectors/uisettingsSelectors';
import { Maybe } from '../Utilities/dataUtils';
import { Equipment, EquipmentDispatchProps, EquipmentOwnProps, EquipmentStateProps } from '../Views/Equipment/Equipment';

const mapStateToProps = (state: AppState, ownProps: EquipmentOwnProps): EquipmentStateProps => ({
  combatTechniques: getFilteredCombatTechniques (state, ownProps),
  carryingCapacity: getCarryingCapacity (state),
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
});

const mapDispatchToProps = (dispatch: Dispatch<Action, AppState>): EquipmentDispatchProps => ({
  addTemplateToList (id: string): void {
    dispatch (EquipmentActions.addTemplateToList (id));
  },
  createItem (): void {
    dispatch (EquipmentActions.createItem ());
  },
  editItem (id: string): void {
    dispatch (EquipmentActions.editItem (id));
  },
  deleteItem (id: string) {
    dispatch (EquipmentActions.removeItem (id));
  },
  setSortOrder (option: string) {
    dispatch (EquipmentActions.setItemsSortOrder (option));
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
  setMeleeItemTemplatesCombatTechniqueFilter (filterOption: Maybe<string>) {
    dispatch (EquipmentActions.setMeleeItemTemplatesCombatTechniqueFilter (filterOption));
  },
  setRangedItemTemplatesCombatTechniqueFilter (filterOption: Maybe<string>) {
    dispatch (EquipmentActions.setRangedItemTemplatesCombatTechniqueFilter (filterOption));
  },
  setFilterText (filterText: string) {
    dispatch (EquipmentActions.setEquipmentFilterText (filterText));
  },
  setTemplatesFilterText (filterText: string) {
    dispatch (EquipmentActions.setItemTemplatesFilterText (filterText));
  },
});

export const connectEquipment =
  connect<EquipmentStateProps, EquipmentDispatchProps, EquipmentOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const EquipmentContainer = connectEquipment (Equipment);
