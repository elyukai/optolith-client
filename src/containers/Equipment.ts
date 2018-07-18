import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as EquipmentActions from '../actions/EquipmentActions';
import { AppState } from '../reducers/app';
import { getInitialStartingWealth } from '../selectors/activatableSelectors';
import { getCarryingCapacity } from '../selectors/attributeSelectors';
import { getAllCombatTechniques } from '../selectors/combatTechniquesSelectors';
import { getStartEl } from '../selectors/elSelectors';
import { getFilteredItems, getFilteredItemTemplates, getPurse, getTotalPrice, getTotalWeight } from '../selectors/equipmentSelectors';
import { getAttributes, getEquipmentFilterText, getItemTemplatesFilterText, getTotalAdventurePoints } from '../selectors/stateSelectors';
import { getEquipmentSortOrder, getMeleeItemTemplateCombatTechniqueFilter, getRangedItemTemplateCombatTechniqueFilter } from '../selectors/uisettingsSelectors';
import { Equipment, EquipmentDispatchProps, EquipmentOwnProps, EquipmentStateProps } from '../views/belongings/Equipment';

function mapStateToProps(state: AppState) {
	return {
		attributes: getAttributes(state),
		combatTechniques: getAllCombatTechniques(state),
		carryingCapacity: getCarryingCapacity(state),
		initialStartingWealth: getInitialStartingWealth(state),
		items: getFilteredItems(state),
		hasNoAddedAP: getTotalAdventurePoints(state) === getStartEl(state).ap,
		purse: getPurse(state),
		sortOrder: getEquipmentSortOrder(state),
		templates: getFilteredItemTemplates(state),
		totalPrice: getTotalPrice(state),
		totalWeight: getTotalWeight(state),
		meleeItemTemplateCombatTechniqueFilter: getMeleeItemTemplateCombatTechniqueFilter(state),
		rangedItemTemplateCombatTechniqueFilter: getRangedItemTemplateCombatTechniqueFilter(state),
		filterText: getEquipmentFilterText(state),
		templatesFilterText: getItemTemplatesFilterText(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addTemplateToList(id: string): void {
      dispatch<any>(EquipmentActions.addTemplateToList(id));
    },
		createItem(): void {
      dispatch<any>(EquipmentActions.createItem());
    },
		editItem(id: string): void {
      dispatch<any>(EquipmentActions.editItem(id));
    },
		deleteItem(id: string) {
			dispatch<any>(EquipmentActions._removeFromList(id));
		},
		setSortOrder(option: string) {
			dispatch<any>(EquipmentActions._setSortOrder(option));
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
		setMeleeItemTemplatesCombatTechniqueFilter(filterOption: string | undefined) {
			dispatch<any>(EquipmentActions.setMeleeItemTemplatesCombatTechniqueFilter(filterOption));
		},
		setRangedItemTemplatesCombatTechniqueFilter(filterOption: string | undefined) {
			dispatch<any>(EquipmentActions.setRangedItemTemplatesCombatTechniqueFilter(filterOption));
		},
		setFilterText(filterText: string) {
			dispatch<any>(EquipmentActions.setEquipmentFilterText(filterText));
		},
		setTemplatesFilterText(filterText: string) {
			dispatch<any>(EquipmentActions.setItemTemplatesFilterText(filterText));
		},
	};
}

export const EquipmentContainer = connect<EquipmentStateProps, EquipmentDispatchProps, EquipmentOwnProps>(mapStateToProps, mapDispatchToProps)(Equipment);
