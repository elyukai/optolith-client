import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as TalentsActions from '../actions/TalentsActions';
import { AppState } from '../reducers/app';
import { getPresent } from '../selectors/currentHeroSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getAttributes, getPhase } from '../selectors/stateSelectors';
import { getTalents, getTalentsRating } from '../selectors/talentsSelectors';
import { getTalentsCultureRatingVisibility, getTalentsSortOrder } from '../selectors/uisettingsSelectors';
import { getDerivedCharacteristicsMap } from '../utils/derivedCharacteristics';
import { Talents, TalentsDispatchProps, TalentsOwnProps, TalentsStateProps } from '../views/skills/Talents';

function mapStateToProps(state: AppState) {
	return {
		attributes: getAttributes(state),
		currentHero: getPresent(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		isRemovingEnabled: isRemovingEnabled(state),
		list: [...getTalents(state).values()],
		phase: getPhase(state),
		sortOrder: getTalentsSortOrder(state),
		ratingVisibility: getTalentsCultureRatingVisibility(state),
		talentRating: getTalentsRating(state)
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addPoint(id: string) {
			dispatch(TalentsActions._addPoint(id));
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
