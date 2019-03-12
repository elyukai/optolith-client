import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { CombatTechniques, CombatTechniquesDispatchProps, CombatTechniquesOwnProps, CombatTechniquesStateProps } from '../../views/combatTechniques/CombatTechniques';
import * as CombatTechniquesActions from '../Actions/CombatTechniquesActions';
import { AppState } from '../Reducers/appReducer';
import { getAttributesForSheet } from '../Selectors/attributeSelectors';
import { getFilteredCombatTechniques } from '../Selectors/combatTechniquesSelectors';
import { getDerivedCharacteristicsMap } from '../Selectors/derivedCharacteristicsSelectors';
import { getIsRemovingEnabled } from '../Selectors/phaseSelectors';
import { getCombatTechniquesFilterText } from '../Selectors/stateSelectors';
import { getCombatTechniquesSortOrder } from '../Selectors/uisettingsSelectors';

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
