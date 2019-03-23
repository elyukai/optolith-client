import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as CultureActions from '../App/Actions/CultureActions';
import { setTab } from '../App/Actions/LocationActions';
import { AppState } from '../reducers/appReducer';
import { getFilteredCultures } from '../Selectors/rcpSelectors';
import { getCulturesFilterText, getCurrentCultureId } from '../Selectors/stateSelectors';
import { getCulturesSortOrder, getCulturesVisibilityFilter } from '../Selectors/uisettingsSelectors';
import { Cultures, CulturesDispatchProps, CulturesOwnProps, CulturesStateProps } from '../Views/rcp/Cultures';

const mapStateToProps = (state: AppState, ownProps: CulturesOwnProps): CulturesStateProps => ({
  cultures: getFilteredCultures (state, ownProps),
  currentId: getCurrentCultureId (state),
  sortOrder: getCulturesSortOrder (state),
  visibilityFilter: getCulturesVisibilityFilter (state),
  filterText: getCulturesFilterText (state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action, AppState>): CulturesDispatchProps => ({
  selectCulture (id: string) {
    dispatch (CultureActions.selectCulture (id));
  },
  setSortOrder (sortOrder: string) {
    dispatch (CultureActions.setSortOrder (sortOrder));
  },
  setVisibilityFilter (sortOrder: string) {
    dispatch (CultureActions.setVisibilityFilter (sortOrder));
  },
  switchValueVisibilityFilter () {
    dispatch (CultureActions.switchValueVisibilityFilter ());
  },
  setFilterText (filterText: string) {
    dispatch (CultureActions.setFilterText (filterText));
  },
  switchToProfessions () {
    dispatch (setTab ('professions'));
  },
});

export const connectCultures =
  connect<CulturesStateProps, CulturesDispatchProps, CulturesOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const CulturesContainer = connectCultures (Cultures);
