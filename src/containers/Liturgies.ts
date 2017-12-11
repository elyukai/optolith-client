import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as LiturgiesActions from '../actions/LiturgiesActions';
import { AppState } from '../reducers/app';
import { getPresent } from '../selectors/currentHeroSelectors';
import { getActiveLiturgicalChants, getBlessedTraditionNumericId, getFilteredInactiveLiturgicalChants, isActivationDisabled } from '../selectors/liturgiesSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getAttributes, getPhase } from '../selectors/stateSelectors';
import { getEnableActiveItemHints, getLiturgiesSortOrder } from '../selectors/uisettingsSelectors';
import { getDerivedCharacteristicsMap } from '../utils/derivedCharacteristics';
import { Liturgies, LiturgiesDispatchProps, LiturgiesOwnProps, LiturgiesStateProps } from '../views/skills/Liturgies';

function mapStateToProps(state: AppState) {
	return {
		attributes: getAttributes(state),
		addChantsDisabled: isActivationDisabled(state),
		currentHero: getPresent(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		enableActiveItemHints: getEnableActiveItemHints(state),
		isRemovingEnabled: isRemovingEnabled(state),
		activeList: getActiveLiturgicalChants(state),
		inactiveList: getFilteredInactiveLiturgicalChants(state),
		phase: getPhase(state),
		sortOrder: getLiturgiesSortOrder(state),
		traditionId: getBlessedTraditionNumericId(state)!
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
		}
	};
}

export const LiturgiesContainer = connect<LiturgiesStateProps, LiturgiesDispatchProps, LiturgiesOwnProps>(mapStateToProps, mapDispatchToProps)(Liturgies);
