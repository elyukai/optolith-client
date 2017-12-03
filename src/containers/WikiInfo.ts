import { connect } from 'react-redux';
import { AppState } from '../reducers/app';
import { getAttributes, getBooks, getCantrips, getDependentInstances, getLiturgicalChants, getSex, getSkills, getSpecialAbilities, getSpells } from '../selectors/stateSelectors';
import { getDerivedCharacteristicsMap } from '../utils/derivedCharacteristics';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { WikiInfo, WikiInfoDispatchProps, WikiInfoOwnProps, WikiInfoStateProps } from '../views/wiki/WikiInfo';

function mapStateToProps(state: AppState) {
	return {
		attributes: getAttributes(state),
		books: getBooks(state),
		cantrips: getCantrips(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		dependent: getDependentInstances(state),
		languages: mapGetToSlice(getSpecialAbilities, 'SA_29')(state)!,
		liturgicalChantExtensions: mapGetToSlice(getSpecialAbilities, 'SA_663')(state),
		liturgicalChants: getLiturgicalChants(state),
		scripts: mapGetToSlice(getSpecialAbilities, 'SA_27')(state)!,
		sex: getSex(state),
		skills: getSkills(state),
		spells: getSpells(state),
		spellExtensions: mapGetToSlice(getSpecialAbilities, 'SA_414')(state),
		specialAbilities: getSpecialAbilities(state),
	};
}

export const WikiInfoContainer = connect<WikiInfoStateProps, WikiInfoDispatchProps, WikiInfoOwnProps>(mapStateToProps)(WikiInfo);
