import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as DisAdvActions from '../actions/DisAdvActions';
import { AppState } from '../reducers/app';
import { getAdvantagesRating, getFilteredActiveAdvantages } from '../selectors/activatableSelectors';
import { get, getDependent } from '../selectors/dependentInstancesSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getAdvantages, getAdvantagesFilterText, getInactiveAdvantagesFilterText } from '../selectors/stateSelectors';
import { getAdvantagesDisadvantagesCultureRatingVisibility, getEnableActiveItemHints } from '../selectors/uisettingsSelectors';
import { ActivateArgs, DeactivateArgs } from '../types/data.d';
import { getAdvantagesDisadvantagesSubMax } from '../utils/APUtils';
import { Advantages, AdvantagesDispatchProps, AdvantagesOwnProps, AdvantagesStateProps } from '../views/disadv/Advantages';
import { getAdventurePointsObject } from '../selectors/adventurePointsSelectors';
import { getFilteredInactiveAdvantages } from '../selectors/combinedActivatablesSelectors';

function mapStateToProps(state: AppState) {
	return {
		activeList: getFilteredActiveAdvantages(state),
		ap: getAdventurePointsObject(state),
		deactiveList: getFilteredInactiveAdvantages(state),
		enableActiveItemHints: getEnableActiveItemHints(state),
		get(id: string) {
			return get(getDependent(state), id);
		},
		isRemovingEnabled: isRemovingEnabled(state),
		list: [...getAdvantages(state).values()],
		magicalMax: getAdvantagesDisadvantagesSubMax(getDependent(state), 1),
		rating: getAdvantagesRating(state),
		showRating: getAdvantagesDisadvantagesCultureRatingVisibility(state),
		filterText: getAdvantagesFilterText(state),
		inactiveFilterText: getInactiveAdvantagesFilterText(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		switchRatingVisibility() {
			dispatch<any>(DisAdvActions._switchRatingVisibility());
		},
		switchActiveItemHints() {
			dispatch<any>(ConfigActions._switchEnableActiveItemHints());
		},
		addToList(args: ActivateArgs) {
			dispatch<any>(DisAdvActions._addToList(args));
		},
		removeFromList(args: DeactivateArgs) {
			dispatch<any>(DisAdvActions._removeFromList(args));
		},
		setTier(id: string, index: number, tier: number) {
			dispatch<any>(DisAdvActions._setTier(id, index, tier));
		},
		setFilterText(filterText: string) {
			dispatch<any>(DisAdvActions.setActiveAdvantagesFilterText(filterText));
		},
		setInactiveFilterText(filterText: string) {
			dispatch<any>(DisAdvActions.setInactiveAdvantagesFilterText(filterText));
		},
	};
}

export const AdvantagesContainer = connect<AdvantagesStateProps, AdvantagesDispatchProps, AdvantagesOwnProps>(mapStateToProps, mapDispatchToProps)(Advantages);
