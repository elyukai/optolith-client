import { connect } from "react-redux";
import { ReduxDispatch } from "../Actions/Actions";
import * as RaceActions from "../Actions/RaceActions";
import { AppStateRecord } from "../Reducers/appReducer";
import { getFilteredRaces } from "../Selectors/rcpSelectors";
import { getCurrentRaceVariantId, getRaceId, getRacesFilterText } from "../Selectors/stateSelectors";
import { getRacesSortOrder } from "../Selectors/uisettingsSelectors";
import { Races, RacesDispatchProps, RacesOwnProps, RacesStateProps } from "../Views/Races/Races";
import { SortNames } from "../Views/Universal/SortOptions";

const mapStateToProps = (state: AppStateRecord, ownProps: RacesOwnProps): RacesStateProps => ({
  currentId: getRaceId (state, ownProps),
  currentVariantId: getCurrentRaceVariantId (state),
  races: getFilteredRaces (state, ownProps),
  sortOrder: getRacesSortOrder (state),
  filterText: getRacesFilterText (state),
})

const mapDispatchToProps = (dispatch: ReduxDispatch): RacesDispatchProps => ({
  setSortOrder (sortOrder: SortNames) {
    dispatch (RaceActions.setRacesSortOrder (sortOrder))
  },
  switchValueVisibilityFilter () {
    dispatch (RaceActions.switchRaceValueVisibilityFilter ())
  },
  setFilterText (filterText: string) {
    dispatch (RaceActions.setFilterText (filterText))
  },
})

export const connectRaces =
  connect<RacesStateProps, RacesDispatchProps, RacesOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const RacesContainer = connectRaces (Races)
