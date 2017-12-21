import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as DisAdvActions from '../actions/DisAdvActions';
import { AppState } from '../reducers/app';
import { getAdvantagesForEdit, getAdvantagesRating, getDeactiveAdvantages } from '../selectors/activatableSelectors';
import { get, getDependent } from '../selectors/dependentInstancesSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getAdvantages, getAdventurePoints } from '../selectors/stateSelectors';
import { getAdvantagesDisadvantagesCultureRatingVisibility, getEnableActiveItemHints } from '../selectors/uisettingsSelectors';
import { ActivateArgs, DeactivateArgs } from '../types/data.d';
import { getAdvantagesDisadvantagesSubMax } from '../utils/APUtils';
import { Advantages, AdvantagesDispatchProps, AdvantagesOwnProps, AdvantagesStateProps } from '../views/disadv/Advantages';

function mapStateToProps(state: AppState) {
	return {
		activeList: getAdvantagesForEdit(state),
		ap: getAdventurePoints(state),
		deactiveList: getDeactiveAdvantages(state),
		enableActiveItemHints: getEnableActiveItemHints(state),
		get(id: string) {
			return get(getDependent(state), id);
		},
		isRemovingEnabled: isRemovingEnabled(state),
		list: [...getAdvantages(state).values()],
		magicalMax: getAdvantagesDisadvantagesSubMax(getDependent(state), 1),
		rating: getAdvantagesRating(state),
		showRating: getAdvantagesDisadvantagesCultureRatingVisibility(state),
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
		}
	};
}

export const AdvantagesContainer = connect<AdvantagesStateProps, AdvantagesDispatchProps, AdvantagesOwnProps>(mapStateToProps, mapDispatchToProps)(Advantages);
