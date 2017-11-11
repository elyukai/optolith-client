import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as CombatTechniquesActions from '../actions/CombatTechniquesActions';
import { AppState } from '../reducers/app';
import { getAllCombatTechniques } from '../selectors/combatTechniquesSelectors';
import { getPresent } from '../selectors/currentHeroSelectors';
import { isRemovingEnabled } from '../selectors/phaseSelectors';
import { getAttributes, getPhase } from '../selectors/stateSelectors';
import { getCombatTechniquesSortOrder } from '../selectors/uisettingsSelectors';
import { getDerivedCharacteristicsMap } from '../utils/derivedCharacteristics';
import { CombatTechniques, CombatTechniquesDispatchProps, CombatTechniquesOwnProps, CombatTechniquesStateProps } from '../views/skills/CombatTechniques';

function mapStateToProps(state: AppState) {
	return {
		attributes: getAttributes(state),
		currentHero: getPresent(state),
		derivedCharacteristics: getDerivedCharacteristicsMap(state),
		isRemovingEnabled: isRemovingEnabled(state),
		list: getAllCombatTechniques(state),
		phase: getPhase(state),
		sortOrder: getCombatTechniquesSortOrder(state)
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addPoint(id: string) {
			dispatch(CombatTechniquesActions._addPoint(id));
		},
		removePoint(id: string) {
			dispatch(CombatTechniquesActions._removePoint(id));
		},
		setSortOrder(sortOrder: string) {
			dispatch(CombatTechniquesActions._setSortOrder(sortOrder));
		}
	};
}

export const CombatTechniquesContainer = connect<CombatTechniquesStateProps, CombatTechniquesDispatchProps, CombatTechniquesOwnProps>(mapStateToProps, mapDispatchToProps)(CombatTechniques);
