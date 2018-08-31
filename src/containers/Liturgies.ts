import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as LiturgiesActions from '../actions/LiturgiesActions';
import { AppState } from '../reducers/app';
import { getDerivedCharacteristicsMap } from '../selectors/derivedCharacteristicsSelectors';
import { getBlessedTraditionNumericId, getFilteredActiveLiturgicalChantsAndBlessings, getFilteredInactiveLiturgicalChantsAndBlessings, isActivationDisabled } from '../selectors/liturgiesSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getAttributes, getInactiveLiturgicalChantsFilterText, getLiturgicalChantsFilterText, getPhase } from '../selectors/stateSelectors';
import { getEnableActiveItemHints, getLiturgiesSortOrder } from '../selectors/uisettingsSelectors';
import { Liturgies, LiturgiesDispatchProps, LiturgiesOwnProps, LiturgiesStateProps } from '../views/skills/Liturgies';

function mapStateToProps(state: AppState) {
	return {
		attributes: getAttributes(state),
		addChantsDisabled: isActivationDisabled(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		enableActiveItemHints: getEnableActiveItemHints(state),
		isRemovingEnabled: getIsRemovingEnabled(state),
		activeList: getFilteredActiveLiturgicalChantsAndBlessings(state),
		inactiveList: getFilteredInactiveLiturgicalChantsAndBlessings(state),
		phase: getPhase(state),
		sortOrder: getLiturgiesSortOrder(state),
		traditionId: getBlessedTraditionNumericId(state)!,
		filterText: getLiturgicalChantsFilterText(state),
		inactiveFilterText: getInactiveLiturgicalChantsFilterText(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addPoint(id: string) {
			dispatch(LiturgiesActions._addPoint(id));
		},
		addToList(id: string) {
			dispatch(LiturgiesActions._addToList(id));
		},
		addBlessingToList(id: string) {
			dispatch(LiturgiesActions._addBlessingToList(id));
		},
		removePoint(id: string) {
			dispatch(LiturgiesActions._removePoint(id));
		},
		removeFromList(id: string) {
			dispatch(LiturgiesActions._removeFromList(id));
		},
		removeBlessingFromList(id: string) {
			dispatch(LiturgiesActions._removeBlessingFromList(id));
		},
		setSortOrder(sortOrder: string) {
			dispatch(LiturgiesActions._setSortOrder(sortOrder));
		},
		switchActiveItemHints() {
			dispatch(ConfigActions._switchEnableActiveItemHints());
		},
		setFilterText(filterText: string) {
			dispatch(LiturgiesActions.setActiveFilterText(filterText));
		},
		setInactiveFilterText(filterText: string) {
			dispatch(LiturgiesActions.setInactiveFilterText(filterText));
		},
	};
}

export const LiturgiesContainer = connect<LiturgiesStateProps, LiturgiesDispatchProps, LiturgiesOwnProps>(mapStateToProps, mapDispatchToProps)(Liturgies);
