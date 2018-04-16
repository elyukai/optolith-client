import { connect } from 'react-redux';
import { AppState } from '../reducers/app';
import { getDerivedCharacteristicsMap } from '../selectors/derivedCharacteristicsSelectors';
import * as stateSelectors from '../selectors/stateSelectors';
import { getAllWikiEntries } from '../selectors/wikiSelectors';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { WikiInfo, WikiInfoDispatchProps, WikiInfoOwnProps } from '../views/wiki/WikiInfo';
import { WikiInfoContentStateProps } from '../views/wiki/WikiInfoContent';

function mapStateToProps(state: AppState) {
	return {
		attributes: stateSelectors.getWikiAttributes(state),
		advantages: stateSelectors.getWikiAdvantages(state),
		blessings: stateSelectors.getWikiBlessings(state),
		books: stateSelectors.getWikiBooks(state),
		cantrips: stateSelectors.getWikiCantrips(state),
		combatTechniques: stateSelectors.getWikiCombatTechniques(state),
		cultures: stateSelectors.getWikiCultures(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		dependent: stateSelectors.getDependentInstances(state),
		languages: mapGetToSlice(stateSelectors.getWikiSpecialAbilities, 'SA_29')(state)!,
		list: getAllWikiEntries(state),
		professionVariants: stateSelectors.getWikiProfessionVariants(state),
		raceVariants: stateSelectors.getWikiRaceVariants(state),
		races: stateSelectors.getWikiRaces(state),
		liturgicalChantExtensions: mapGetToSlice(stateSelectors.getWikiSpecialAbilities, 'SA_663')(state),
		liturgicalChants: stateSelectors.getWikiLiturgicalChants(state),
		scripts: mapGetToSlice(stateSelectors.getWikiSpecialAbilities, 'SA_27')(state)!,
		sex: stateSelectors.getSex(state),
		skills: stateSelectors.getWikiSkills(state),
		spellExtensions: mapGetToSlice(stateSelectors.getWikiSpecialAbilities, 'SA_414')(state),
		spells: stateSelectors.getWikiSpells(state),
		specialAbilities: stateSelectors.getWikiSpecialAbilities(state),
		templates: stateSelectors.getWikiItemTemplates(state),
		wiki: stateSelectors.getWiki(state),
	};
}

export const WikiInfoContainer = connect<WikiInfoContentStateProps, WikiInfoDispatchProps, WikiInfoOwnProps>(mapStateToProps)(WikiInfo);
