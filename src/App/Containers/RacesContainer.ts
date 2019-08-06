import { connect } from "react-redux";
import { Maybe } from "../../Data/Maybe";
import { ReduxDispatch } from "../Actions/Actions";
import { setTab } from "../Actions/LocationActions";
import * as RaceActions from "../Actions/RaceActions";
import { AppStateRecord } from "../Reducers/appReducer";
import { getFilteredRaces } from "../Selectors/rcpSelectors";
import { getCurrentRaceVariantId, getRaceId, getRacesFilterText } from "../Selectors/stateSelectors";
import { getRacesSortOrder } from "../Selectors/uisettingsSelectors";
import { TabId } from "../Utilities/LocationUtils";
import { Races, RacesDispatchProps, RacesOwnProps, RacesStateProps } from "../Views/Races/Races";
import { SortNames } from "../Views/Universal/SortOptions";

const mapStateToProps = (state: AppStateRecord, ownProps: RacesOwnProps): RacesStateProps => {
  return {
    currentId: getRaceId (state, ownProps),
    currentVariantId: getCurrentRaceVariantId (state),
    races: getFilteredRaces (state, ownProps),
    sortOrder: getRacesSortOrder (state),
    filterText: getRacesFilterText (state),
  }
}

const mapDispatchToProps = (dispatch: ReduxDispatch): RacesDispatchProps => ({
  selectRace (id: string): ((variantId: Maybe<string>) => void) {
    return variantId => dispatch (RaceActions.selectRace (id) (variantId))
  },
  selectRaceVariant (id: string) {
    dispatch (RaceActions.setRaceVariant (id))
  },
  setSortOrder (sortOrder: SortNames) {
    dispatch (RaceActions.setRacesSortOrder (sortOrder))
  },
  switchValueVisibilityFilter () {
    dispatch (RaceActions.switchRaceValueVisibilityFilter ())
  },
  setFilterText (filterText: string) {
    dispatch (RaceActions.setFilterText (filterText))
  },
  switchToCultures () {
    dispatch (setTab (TabId.Cultures))
  },
})

export const connectRaces =
  connect<RacesStateProps, RacesDispatchProps, RacesOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const RacesContainer = connectRaces (Races)
