import { connect } from "react-redux"
import { ReduxDispatch } from "../Actions/Actions"
import * as CultureActions from "../Actions/CultureActions"
import { setTab } from "../Actions/LocationActions"
import { AppStateRecord } from "../Models/AppState"
import { CulturesSortOptions, CulturesVisibilityFilter } from "../Models/Config"
import { getFilteredCultures } from "../Selectors/rcpSelectors"
import { getCulturesFilterText, getCurrentCultureId } from "../Selectors/stateSelectors"
import { getCulturesSortOrder, getCulturesVisibilityFilter } from "../Selectors/uisettingsSelectors"
import { TabId } from "../Utilities/LocationUtils"
import { Cultures, CulturesDispatchProps, CulturesOwnProps, CulturesStateProps } from "../Views/Cultures/Cultures"

const mapStateToProps =
  (state: AppStateRecord, ownProps: CulturesOwnProps): CulturesStateProps => ({
    cultures: getFilteredCultures (state, ownProps),
    currentId: getCurrentCultureId (state),
    sortOrder: getCulturesSortOrder (state),
    visibilityFilter: getCulturesVisibilityFilter (state),
    filterText: getCulturesFilterText (state),
  })

const mapDispatchToProps = (dispatch: ReduxDispatch): CulturesDispatchProps => ({
  selectCulture (id: string) {
    dispatch (CultureActions.selectCulture (id))
  },
  setSortOrder (sortOrder: CulturesSortOptions) {
    dispatch (CultureActions.setSortOrder (sortOrder))
  },
  setVisibilityFilter (sortOrder: CulturesVisibilityFilter) {
    dispatch (CultureActions.setVisibilityFilter (sortOrder))
  },
  switchValueVisibilityFilter () {
    dispatch (CultureActions.switchValueVisibilityFilter ())
  },
  setFilterText (filterText: string) {
    dispatch (CultureActions.setFilterText (filterText))
  },
  switchToProfessions () {
    dispatch (setTab (TabId.Professions))
  },
})

const connectCultures =
  connect<CulturesStateProps, CulturesDispatchProps, CulturesOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const CulturesContainer = connectCultures (Cultures)
