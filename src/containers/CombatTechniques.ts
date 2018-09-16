import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as CombatTechniquesActions from '../actions/CombatTechniquesActions';
import { AppState } from '../reducers/appReducer';
import { getFilteredCombatTechniques } from '../selectors/combatTechniquesSelectors';
import { getPresent } from '../selectors/currentHeroSelectors';
import { getDerivedCharacteristicsMap } from '../selectors/derivedCharacteristicsSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getAttributes, getCombatTechniquesFilterText, getPhase } from '../selectors/stateSelectors';
import { getCombatTechniquesSortOrder } from '../selectors/uisettingsSelectors';
import { CombatTechniques, CombatTechniquesDispatchProps, CombatTechniquesOwnProps, CombatTechniquesStateProps } from '../views/skills/CombatTechniques';

function mapStateToProps(state: AppState) {
  return {
    attributes: getAttributes(state),
    currentHero: getPresent(state),
    derivedCharacteristics: getDerivedCharacteristicsMap(state),
    isRemovingEnabled: getIsRemovingEnabled(state),
    list: getFilteredCombatTechniques(state),
    phase: getPhase(state),
    sortOrder: getCombatTechniquesSortOrder(state),
    filterText: getCombatTechniquesFilterText(state),
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
    },
    setFilterText(filterText: string) {
      dispatch(CombatTechniquesActions.setFilterText(filterText));
    },
  };
}

export const CombatTechniquesContainer = connect<CombatTechniquesStateProps, CombatTechniquesDispatchProps, CombatTechniquesOwnProps>(mapStateToProps, mapDispatchToProps)(CombatTechniques);
