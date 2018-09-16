import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as TalentsActions from '../actions/SkillActions';
import { AppState } from '../reducers/appReducer';
import { getPresent } from '../selectors/currentHeroSelectors';
import { getDerivedCharacteristicsMap } from '../selectors/derivedCharacteristicsSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getAttributes, getPhase, getSkillsFilterText } from '../selectors/stateSelectors';
import { getFilteredSkills, getTalentsRating } from '../selectors/skillsSelectors';
import { getTalentsCultureRatingVisibility, getTalentsSortOrder } from '../selectors/uisettingsSelectors';
import { Talents, TalentsDispatchProps, TalentsOwnProps, TalentsStateProps } from '../views/skills/Talents';

function mapStateToProps(state: AppState) {
	return {
		attributes: getAttributes(state),
		currentHero: getPresent(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		isRemovingEnabled: getIsRemovingEnabled(state),
		list: getFilteredSkills(state),
		phase: getPhase(state),
		sortOrder: getTalentsSortOrder(state),
		filterText: getSkillsFilterText(state),
		ratingVisibility: getTalentsCultureRatingVisibility(state),
		talentRating: getTalentsRating(state),
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
		},
		setFilterText(filterText: string) {
			dispatch(TalentsActions.setFilterText(filterText));
		},
	};
}

export const TalentsContainer = connect<TalentsStateProps, TalentsDispatchProps, TalentsOwnProps>(mapStateToProps, mapDispatchToProps)(Talents);
