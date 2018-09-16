import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as RaceActions from '../actions/RaceActions';
import { AppState } from '../reducers/appReducer';
import { getFilteredRaces } from '../selectors/rcpSelectors';
import { getCurrentRaceId, getCurrentRaceVariantId, getRacesFilterText } from '../selectors/stateSelectors';
import { getRacesSortOrder } from '../selectors/uisettingsSelectors';
import { Races, RacesDispatchProps, RacesOwnProps, RacesStateProps } from '../views/rcp/Races';

function mapStateToProps(state: AppState) {
  return {
    currentId: getCurrentRaceId(state),
    currentVariantId: getCurrentRaceVariantId(state),
    races: getFilteredRaces(state),
    sortOrder: getRacesSortOrder(state),
    filterText: getRacesFilterText(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    selectRace(id: string, variantId?: string) {
      dispatch(RaceActions._selectRace(id, variantId));
    },
    selectRaceVariant(id: string) {
      dispatch(RaceActions.setRaceVariant(id));
    },
    setSortOrder(sortOrder: string) {
      dispatch(RaceActions._setRacesSortOrder(sortOrder));
    },
    switchValueVisibilityFilter() {
      dispatch(RaceActions._switchRaceValueVisibilityFilter());
    },
    setFilterText(filterText: string) {
      dispatch(RaceActions.setFilterText(filterText));
    },
  };
}

export const RacesContainer = connect<RacesStateProps, RacesDispatchProps, RacesOwnProps>(mapStateToProps, mapDispatchToProps)(Races);
