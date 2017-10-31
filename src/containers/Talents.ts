import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as TalentsActions from '../actions/TalentsActions';
import { AppState } from '../reducers/app';
import { getPresent } from '../selectors/currentHeroSelectors';
import { get, getDependent } from '../selectors/dependentInstancesSelectors';
import { getPhase } from '../selectors/stateSelectors';
import { getTalents, getTalentsRating } from '../selectors/talentsSelectors';
import { getTalentsCultureRatingVisibility, getTalentsSortOrder } from '../selectors/uisettingsSelectors';
import { getDerivedCharacteristicsMap } from '../utils/derivedCharacteristics';
import { Talents, TalentsDispatchProps, TalentsOwnProps, TalentsStateProps } from '../views/skills/Talents';

function mapStateToProps(state: AppState) {
	return {
		currentHero: getPresent(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		list: [...getTalents(state).values()],
		phase: getPhase(state),
		sortOrder: getTalentsSortOrder(state),
		ratingVisibility: getTalentsCultureRatingVisibility(state),
		talentRating: getTalentsRating(state),
		get(id: string) {
			return get(getDependent(state), id);
		}
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addPoint(id: string) {
			const action = TalentsActions._addPoint(id);
			if (action) {
				dispatch(action);
			}
		},
		removePoint(id: string) {
			dispatch(TalentsActions._removePoint(id));
		},
		setSortOrder(sortOrder: string) {
			dispatch(TalentsActions._setSortOrder(sortOrder));
		},
		switchRatingVisibility() {
			dispatch(TalentsActions._switchRatingVisibility());
		}
	};
}

export const TalentsContainer = connect<TalentsStateProps, TalentsDispatchProps, TalentsOwnProps>(mapStateToProps, mapDispatchToProps)(Talents);
