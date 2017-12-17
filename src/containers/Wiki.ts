import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { setWikiCategory1, setWikiCategory2, setWikiFilter, setWikiFilterAll } from '../actions/WikiActions';
import { AppState } from '../reducers/app';
import { getSex, getWikiCategory1, getWikiCategory2, getWikiFilterAll, getWikiFilterText } from '../selectors/stateSelectors';
import { getPreparedAdvantages, getPreparedBlessings, getPreparedCantrips, getPreparedCombatTechniques, getPreparedCultures, getPreparedDisadvantages, getPreparedItemTemplates, getPreparedLiturgicalChants, getPreparedProfessions, getPreparedRaces, getPreparedSkills, getPreparedSpecialAbilities, getPreparedSpells } from '../selectors/wikiSelectors';
import { Wiki, WikiDispatchProps, WikiOwnProps, WikiStateProps } from '../views/wiki/Wiki';

function mapStateToProps(state: AppState) {
	return {
		filterText: getWikiFilterText(state),
		filterAllText: getWikiFilterAll(state),
		category1: getWikiCategory1(state),
		category2: getWikiCategory2(state),
		sex: getSex(state)!,
		races: getPreparedRaces(state),
		cultures: getPreparedCultures(state),
		professions: getPreparedProfessions(state),
		advantages: getPreparedAdvantages(state),
		disadvantages: getPreparedDisadvantages(state),
		skills: getPreparedSkills(state),
		combatTechniques: getPreparedCombatTechniques(state),
		specialAbilities: getPreparedSpecialAbilities(state),
		spells: getPreparedSpells(state),
		cantrips: getPreparedCantrips(state),
		liturgicalChants: getPreparedLiturgicalChants(state),
		blessings: getPreparedBlessings(state),
		itemTemplates: getPreparedItemTemplates(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		setCategory1(category: string) {
			dispatch(setWikiCategory1(category));
		},
		setCategory2(category: string) {
			dispatch(setWikiCategory2(category));
		},
		setFilter(filterText: string) {
			dispatch(setWikiFilter(filterText));
		},
		setFilterAll(filterText: string) {
			dispatch(setWikiFilterAll(filterText));
		}
	};
}

export const WikiContainer = connect<WikiStateProps, WikiDispatchProps, WikiOwnProps>(mapStateToProps, mapDispatchToProps)(Wiki);
