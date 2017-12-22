import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ProfessionActions from '../actions/ProfessionActions';
import * as ProfessionVariantActions from '../actions/ProfessionVariantActions';
import { AppState } from '../reducers/app';
import { getFilteredProfessions } from '../selectors/rcpSelectors';
import { getBooks, getCantrips, getCurrentProfessionId, getCurrentProfessionVariantId, getLiturgicalChants, getProfessionsFilterText, getSex, getSpells } from '../selectors/stateSelectors';
import { getProfessionsGroupVisibilityFilter, getProfessionsSortOrder, getProfessionsVisibilityFilter } from '../selectors/uisettingsSelectors';
import { Professions, ProfessionsDispatchProps, ProfessionsOwnProps, ProfessionsStateProps } from '../views/rcp/Professions';

function mapStateToProps(state: AppState) {
	return {
		books: getBooks(state),
		cantrips: getCantrips(state),
		currentProfessionId: getCurrentProfessionId(state),
		currentProfessionVariantId: getCurrentProfessionVariantId(state),
		groupVisibilityFilter: getProfessionsGroupVisibilityFilter(state),
		liturgicalChants: getLiturgicalChants(state),
		professions: getFilteredProfessions(state),
		sex: getSex(state)!,
		sortOrder: getProfessionsSortOrder(state),
		spells: getSpells(state),
		visibilityFilter: getProfessionsVisibilityFilter(state),
		filterText: getProfessionsFilterText(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		selectProfession(id: string) {
			dispatch(ProfessionActions._selectProfession(id));
		},
		selectProfessionVariant(id: string | undefined) {
			dispatch(ProfessionVariantActions._selectProfessionVariant(id));
		},
		setSortOrder(sortOrder: string) {
			dispatch(ProfessionActions._setProfessionsSortOrder(sortOrder));
		},
		setVisibilityFilter(filter: string) {
			dispatch(ProfessionActions._setProfessionsVisibilityFilter(filter));
		},
		setGroupVisibilityFilter(filter: number) {
			dispatch(ProfessionActions._setProfessionsGroupVisibilityFilter(filter));
		},
		switchExpansionVisibilityFilter() {
			dispatch(ProfessionActions._switchProfessionsExpansionVisibilityFilter());
		},
		setFilterText(filterText: string) {
			dispatch(ProfessionActions.setFilterText(filterText));
		},
	};
}

export const ProfessionsContainer = connect<ProfessionsStateProps, ProfessionsDispatchProps, ProfessionsOwnProps>(mapStateToProps, mapDispatchToProps)(Professions);
