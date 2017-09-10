import { connect, Dispatch } from 'react-redux';
import * as ProfessionActions from '../actions/ProfessionActions';
import * as ProfessionVariantActions from '../actions/ProfessionVariantActions';
import { AppState } from '../reducers/app';
import { getAllProfessions, getCurrentProfessionId, getCurrentProfessionVariantId } from '../selectors/rcpSelectors';
import { getCantrips, getLiturgicalChants, getSex, getSpells } from '../selectors/stateSelectors';
import { getProfessionsFromExpansionsVisibility, getProfessionsGroupVisibilityFilter, getProfessionsSortOrder, getProfessionsVisibilityFilter } from '../selectors/uisettingsSelectors';
import { Professions, ProfessionsDispatchProps, ProfessionsOwnProps, ProfessionsStateProps } from '../views/rcp/Professions';

function mapStateToProps(state: AppState) {
	return {
		cantrips: getCantrips(state),
		currentProfessionId: getCurrentProfessionId(state),
		currentProfessionVariantId: getCurrentProfessionVariantId(state),
		extensionVisibilityFilter: getProfessionsFromExpansionsVisibility(state),
		groupVisibilityFilter: getProfessionsGroupVisibilityFilter(state),
		liturgicalChants: getLiturgicalChants(state),
		professions: getAllProfessions(state),
		sex: getSex(state)!,
		sortOrder: getProfessionsSortOrder(state),
		spells: getSpells(state),
		visibilityFilter: getProfessionsVisibilityFilter(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
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
		}
	};
}

export const ProfessionsContainer = connect<ProfessionsStateProps, ProfessionsDispatchProps, ProfessionsOwnProps>(mapStateToProps, mapDispatchToProps)(Professions);
