import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as CombatTechniquesActions from '../actions/CombatTechniquesActions';
import { AppState } from '../reducers/app';
import { getCombatTechniques } from '../selectors/combatTechniquesSelectors';
import { getPresent } from '../selectors/currentHeroSelectors';
import { get, getDependent } from '../selectors/dependentInstancesSelectors';
import { getPhase } from '../selectors/phaseSelectors';
import { getCombatTechniquesSortOrder } from '../selectors/uisettingsSelectors';
import { DCIds, get as getDerivedCharacteristic } from '../utils/derivedCharacteristics';
import { CombatTechniques, CombatTechniquesDispatchProps, CombatTechniquesOwnProps, CombatTechniquesStateProps } from '../views/skills/CombatTechniques';

function mapStateToProps(state: AppState) {
	return {
		currentHero: getPresent(state),
		list: [...getCombatTechniques(state).values()],
		phase: getPhase(state),
		sortOrder: getCombatTechniquesSortOrder(state),
		get(id: string) {
			return get(getDependent(state), id);
		},
		getDerivedCharacteristic(id: DCIds) {
			return getDerivedCharacteristic(getPresent(state), id);
		},
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addPoint(id: string) {
			const action = CombatTechniquesActions._addPoint(id);
			if (action) {
				dispatch(action);
			}
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
