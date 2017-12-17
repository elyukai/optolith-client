import { connect } from 'react-redux';
import { AppState } from '../reducers/app';
import { getDependentInstances, getSex, getWiki, getWikiAttributes, getWikiBooks, getWikiCantrips, getWikiCombatTechniques, getWikiCultures, getWikiItemTemplates, getWikiLiturgicalChants, getWikiProfessionVariants, getWikiRaces, getWikiRaceVariants, getWikiSkills, getWikiSpecialAbilities, getWikiSpells } from '../selectors/stateSelectors';
import { getAllWikiEntries } from '../selectors/wikiSelectors';
import { getDerivedCharacteristicsMap } from '../utils/derivedCharacteristics';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { WikiInfo, WikiInfoDispatchProps, WikiInfoOwnProps } from '../views/wiki/WikiInfo';
import { WikiInfoContentStateProps } from '../views/wiki/WikiInfoContent';

function mapStateToProps(state: AppState) {
	return {
		attributes: getWikiAttributes(state),
		books: getWikiBooks(state),
		cantrips: getWikiCantrips(state),
		combatTechniques: getWikiCombatTechniques(state),
		cultures: getWikiCultures(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		dependent: getDependentInstances(state),
		languages: mapGetToSlice(getWikiSpecialAbilities, 'SA_29')(state)!,
		list: getAllWikiEntries(state),
		professionVariants: getWikiProfessionVariants(state),
		raceVariants: getWikiRaceVariants(state),
		races: getWikiRaces(state),
		liturgicalChantExtensions: mapGetToSlice(getWikiSpecialAbilities, 'SA_663')(state),
		liturgicalChants: getWikiLiturgicalChants(state),
		scripts: mapGetToSlice(getWikiSpecialAbilities, 'SA_27')(state)!,
		sex: getSex(state),
		skills: getWikiSkills(state),
		spellExtensions: mapGetToSlice(getWikiSpecialAbilities, 'SA_414')(state),
		spells: getWikiSpells(state),
		specialAbilities: getWikiSpecialAbilities(state),
		templates: getWikiItemTemplates(state),
		wiki: getWiki(state),
	};
}

export const WikiInfoContainer = connect<WikiInfoContentStateProps, WikiInfoDispatchProps, WikiInfoOwnProps>(mapStateToProps)(WikiInfo);
