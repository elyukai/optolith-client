import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as CultureActions from '../actions/CultureActions';
import { setTab } from '../actions/LocationActions';
import { AppState } from '../reducers/appReducer';
import { getFilteredCultures } from '../selectors/rcpSelectors';
import { getCulturesFilterText, getCurrentCultureId } from '../selectors/stateSelectors';
import { getCulturesSortOrder, getCulturesVisibilityFilter } from '../selectors/uisettingsSelectors';
import { Cultures, CulturesDispatchProps, CulturesOwnProps, CulturesStateProps } from '../views/rcp/Cultures';

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
