import { connect } from "react-redux"
import { ReduxDispatch } from "../Actions/Actions"
import * as RaceActions from "../Actions/RaceActions"
import { AppStateRecord } from "../Models/AppState"
import { RacesSortOptions } from "../Models/Config"
import { getFilteredRaces } from "../Selectors/raceSelectors"
import { getRaceId, getRacesFilterText, getRaceVariantId } from "../Selectors/stateSelectors"
import { getRacesSortOrder } from "../Selectors/uisettingsSelectors"
import { Races, RacesDispatchProps, RacesOwnProps, RacesStateProps } from "../Views/Races/Races"

const mapStateToProps = (state: AppStateRecord, ownProps: RacesOwnProps): RacesStateProps => ({
  currentId: getRaceId (state, ownProps),
  currentVariantId: getRaceVariantId (state, ownProps),
  races: getFilteredRaces (state, ownProps),
  sortOrder: getRacesSortOrder (state),
  filterText: getRacesFilterText (state),
})

const mapDispatchToProps = (dispatch: ReduxDispatch): RacesDispatchProps => ({
  setSortOrder (sortOrder: RacesSortOptions) {
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
