import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { setTab } from "../Actions/LocationActions";
import * as RaceActions from "../Actions/RaceActions";
import { AppState } from "../Reducers/appReducer";
import { getFilteredRaces } from "../Selectors/rcpSelectors";
import { getCurrentRaceId, getCurrentRaceVariantId, getRacesFilterText } from "../Selectors/stateSelectors";
import { getRacesSortOrder } from "../Selectors/uisettingsSelectors";
import { Races, RacesDispatchProps, RacesOwnProps, RacesStateProps } from "../Views/Races/Races";

const mapStateToProps = (state: AppState, ownProps: RacesOwnProps): RacesStateProps => {
  return {
    currentId: getCurrentRaceId (state),
    currentVariantId: getCurrentRaceVariantId (state),
    races: getFilteredRaces (state, ownProps),
    sortOrder: getRacesSortOrder (state),
    filterText: getRacesFilterText (state),
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action, AppState>): RacesDispatchProps => ({
  selectRace (id: string): ((variantId: Maybe<string>) => void) {
    return variantId => dispatch (RaceActions.selectRace (id) (variantId))
  },
  selectRaceVariant (id: string) {
    dispatch (RaceActions.setRaceVariant (id))
  },
  setSortOrder (sortOrder: string) {
    dispatch (RaceActions.setRacesSortOrder (sortOrder))
  },
  switchValueVisibilityFilter () {
    dispatch (RaceActions.switchRaceValueVisibilityFilter ())
  },
  setFilterText (filterText: string) {
    dispatch (RaceActions.setFilterText (filterText))
  },
  switchToCultures () {
    dispatch (setTab ("cultures"))
  },
})

export const connectRaces = connect<RacesStateProps, RacesDispatchProps, RacesOwnProps, AppState> (
  mapStateToProps,
  mapDispatchToProps
)

export const RacesContainer = connectRaces (Races)
