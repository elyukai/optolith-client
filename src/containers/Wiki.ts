import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { setWikiCategory1, setWikiCategory2, setWikiCombatTechniquesGroup, setWikiFilter, setWikiFilterAll, setWikiItemTemplatesGroup, setWikiLiturgicalChantsGroup, setWikiProfessionsGroup, setWikiSkillsGroup, setWikiSpecialAbilitiesGroup, setWikiSpellsGroup } from '../actions/WikiActions';
import { AppState } from '../reducers/app';
import { getSex, getWikiCombatTechniquesGroup, getWikiFilterAll, getWikiFilterText, getWikiItemTemplatesGroup, getWikiLiturgicalChantsGroup, getWikiMainCategory, getWikiProfessionsGroup, getWikiSkillsGroup, getWikiSpecialAbilitiesGroup, getWikiSpellsGroup } from '../selectors/stateSelectors';
import { getPreparedAdvantages, getPreparedBlessings, getPreparedCantrips, getPreparedCombatTechniques, getPreparedCultures, getPreparedDisadvantages, getPreparedItemTemplates, getPreparedLiturgicalChants, getPreparedProfessions, getPreparedRaces, getPreparedSkills, getPreparedSpecialAbilities, getPreparedSpells } from '../selectors/wikiSelectors';
import { Wiki, WikiDispatchProps, WikiOwnProps, WikiStateProps } from '../views/wiki/Wiki';

function mapStateToProps(state: AppState) {
	return {
		filterText: getWikiFilterText(state),
		filterAllText: getWikiFilterAll(state),
		category: getWikiMainCategory(state),
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
		professionsGroup: getWikiProfessionsGroup(state),
		skillsGroup: getWikiSkillsGroup(state),
		combatTechniquesGroup: getWikiCombatTechniquesGroup(state),
		specialAbilitiesGroup: getWikiSpecialAbilitiesGroup(state),
		spellsGroup: getWikiSpellsGroup(state),
		liturgicalChantsGroup: getWikiLiturgicalChantsGroup(state),
		itemTemplatesGroup: getWikiItemTemplatesGroup(state),
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
		},
		setProfessionsGroup(group: number | undefined) {
			dispatch(setWikiProfessionsGroup(group));
		},
		setSkillsGroup(group: number | undefined) {
			dispatch(setWikiSkillsGroup(group));
		},
		setCombatTechniquesGroup(group: number | undefined) {
			dispatch(setWikiCombatTechniquesGroup(group));
		},
		setSpecialAbilitiesGroup(group: number | undefined) {
			dispatch(setWikiSpecialAbilitiesGroup(group));
		},
		setSpellsGroup(group: number | undefined) {
			dispatch(setWikiSpellsGroup(group));
		},
		setLiturgicalChantsGroup(group: number | undefined) {
			dispatch(setWikiLiturgicalChantsGroup(group));
		},
		setItemTemplatesGroup(group: number | undefined) {
			dispatch(setWikiItemTemplatesGroup(group));
		},
	};
}

export const WikiContainer = connect<WikiStateProps, WikiDispatchProps, WikiOwnProps>(mapStateToProps, mapDispatchToProps)(Wiki);
