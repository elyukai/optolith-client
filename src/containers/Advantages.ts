import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as DisAdvActions from '../actions/DisAdvActions';
import { AppState } from '../reducers/app';
import { getAdvantagesRating, getFilteredActiveAdvantages, getFilteredInactiveAdvantages } from '../selectors/activatableSelectors';
import { get, getDependent } from '../selectors/dependentInstancesSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getAdvantages, getAdvantagesFilterText, getAdventurePoints, getInactiveAdvantagesFilterText } from '../selectors/stateSelectors';
import { getAdvantagesDisadvantagesCultureRatingVisibility, getEnableActiveItemHints } from '../selectors/uisettingsSelectors';
import { ActivateArgs, DeactivateArgs } from '../types/data.d';
import { getAdvantagesDisadvantagesSubMax } from '../utils/APUtils';
import { Advantages, AdvantagesDispatchProps, AdvantagesOwnProps, AdvantagesStateProps } from '../views/disadv/Advantages';

function mapStateToProps(state: AppState) {
	return {
		activeList: getFilteredActiveAdvantages(state),
		ap: getAdventurePoints(state),
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
			dispatch(DisAdvActions._switchRatingVisibility());
		},
		switchActiveItemHints() {
			dispatch(ConfigActions._switchEnableActiveItemHints());
		},
		addToList(args: ActivateArgs) {
			dispatch(DisAdvActions._addToList(args));
		},
		removeFromList(args: DeactivateArgs) {
			dispatch(DisAdvActions._removeFromList(args));
		},
		setTier(id: string, index: number, tier: number) {
			dispatch(DisAdvActions._setTier(id, index, tier));
		},
		setFilterText(filterText: string) {
			dispatch(DisAdvActions.setActiveAdvantagesFilterText(filterText));
		},
		setInactiveFilterText(filterText: string) {
			dispatch(DisAdvActions.setInactiveAdvantagesFilterText(filterText));
		},
	};
}

export const AdvantagesContainer = connect<AdvantagesStateProps, AdvantagesDispatchProps, AdvantagesOwnProps>(mapStateToProps, mapDispatchToProps)(Advantages);
