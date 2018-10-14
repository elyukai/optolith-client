import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as CombatTechniquesActions from '../actions/CombatTechniquesActions';
import { AppState } from '../reducers/appReducer';
import { getAttributesForSheet } from '../selectors/attributeSelectors';
import { getFilteredCombatTechniques } from '../selectors/combatTechniquesSelectors';
import { getDerivedCharacteristicsMap } from '../selectors/derivedCharacteristicsSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getCombatTechniquesFilterText } from '../selectors/stateSelectors';
import { getCombatTechniquesSortOrder } from '../selectors/uisettingsSelectors';
import { CombatTechniques, CombatTechniquesDispatchProps, CombatTechniquesOwnProps, CombatTechniquesStateProps } from '../views/combatTechniques/CombatTechniques';

const mapStateToProps = (
  state: AppState,
  ownProps: CombatTechniquesOwnProps
): CombatTechniquesStateProps => ({
  attributes: getAttributesForSheet (state),
  derivedCharacteristics: getDerivedCharacteristicsMap (state, ownProps),
  isRemovingEnabled: getIsRemovingEnabled (state),
  list: getFilteredCombatTechniques (state, ownProps),
  sortOrder: getCombatTechniquesSortOrder (state),
  filterText: getCombatTechniquesFilterText (state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Action, AppState>,
  { locale }: CombatTechniquesOwnProps
) => ({
  addPoint (id: string) {
    dispatch (CombatTechniquesActions.addCombatTechniquePoint (locale) (id));
  },
  removePoint (id: string) {
    dispatch (CombatTechniquesActions.removeCombatTechniquePoint (id));
  },
  setSortOrder (sortOrder: string) {
    dispatch (CombatTechniquesActions.setCombatTechniquesSortOrder (sortOrder));
  },
  setFilterText (filterText: string) {
    dispatch (CombatTechniquesActions.setCombatTechniquesFilterText (filterText));
  },
});

export const connectCombatTechniques =
  connect<
    CombatTechniquesStateProps,
    CombatTechniquesDispatchProps,
    CombatTechniquesOwnProps,
    AppState
  > (
    mapStateToProps,
    mapDispatchToProps
  );

export const CombatTechniquesContainer = connectCombatTechniques (CombatTechniques);
