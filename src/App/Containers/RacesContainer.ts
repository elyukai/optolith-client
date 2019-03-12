import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { setTab } from '../App/Actions/LocationActions';
import * as RaceActions from '../App/Actions/RaceActions';
import { AppState } from '../reducers/appReducer';
import { getFilteredRaces } from '../selectors/rcpSelectors';
import { getCurrentRaceId, getCurrentRaceVariantId, getRacesFilterText } from '../selectors/stateSelectors';
import { getRacesSortOrder } from '../selectors/uisettingsSelectors';
import { Maybe } from '../utils/dataUtils';
import { Races, RacesDispatchProps, RacesOwnProps, RacesStateProps } from '../views/rcp/Races';

const mapStateToProps = (state: AppState, ownProps: RacesOwnProps): RacesStateProps => {
  return {
    currentId: getCurrentRaceId (state),
    currentVariantId: getCurrentRaceVariantId (state),
    races: getFilteredRaces (state, ownProps),
    sortOrder: getRacesSortOrder (state),
    filterText: getRacesFilterText (state),
  };
}

const mapDispatchToProps = (dispatch: Dispatch<Action, AppState>): RacesDispatchProps => ({
  selectRace (id: string): ((variantId: Maybe<string>) => void) {
    return variantId => dispatch (RaceActions.selectRace (id) (variantId));
  },
  selectRaceVariant (id: string) {
    dispatch (RaceActions.setRaceVariant (id));
  },
  setSortOrder (sortOrder: string) {
    dispatch (RaceActions.setRacesSortOrder (sortOrder));
  },
  switchValueVisibilityFilter () {
    dispatch (RaceActions.switchRaceValueVisibilityFilter ());
  },
  setFilterText (filterText: string) {
    dispatch (RaceActions.setFilterText (filterText));
  },
  switchToCultures () {
    dispatch (setTab ('cultures'));
  },
});

export const connectRaces = connect<RacesStateProps, RacesDispatchProps, RacesOwnProps, AppState> (
  mapStateToProps,
  mapDispatchToProps
);

export const RacesContainer = connectRaces (Races);
