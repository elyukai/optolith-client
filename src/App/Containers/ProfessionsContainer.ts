import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import * as ProfessionActions from "../Actions/ProfessionActions";
import * as ProfessionVariantActions from "../Actions/ProfessionVariantActions";
import { AppState } from "../Reducers/appReducer";
import { getFilteredProfessions } from "../Selectors/rcpSelectors";
import { getCurrentProfessionId, getCurrentProfessionVariantId, getProfessionsFilterText, getSex, getWiki } from "../Selectors/stateSelectors";
import { getProfessionsGroupVisibilityFilter, getProfessionsSortOrder, getProfessionsVisibilityFilter } from "../Selectors/uisettingsSelectors";
import { Professions, ProfessionsDispatchProps, ProfessionsOwnProps, ProfessionsStateProps } from "../Views/Professions/Professions";

const mapStateToProps = (
  state: AppState,
  ownProps: ProfessionsOwnProps
): ProfessionsStateProps => ({
  currentProfessionId: getCurrentProfessionId (state),
  currentProfessionVariantId: getCurrentProfessionVariantId (state),
  groupVisibilityFilter: getProfessionsGroupVisibilityFilter (state),
  professions: getFilteredProfessions (state, ownProps),
  sex: getSex (state),
  sortOrder: getProfessionsSortOrder (state),
  visibilityFilter: getProfessionsVisibilityFilter (state),
  filterText: getProfessionsFilterText (state),
  wiki: getWiki (state),
})

const mapDispatchToProps = (dispatch: Dispatch<Action, AppState>): ProfessionsDispatchProps => ({
  selectProfession (id: string) {
    dispatch (ProfessionActions.selectProfession (id))
  },
  selectProfessionVariant (id: Maybe<string>) {
    dispatch (ProfessionVariantActions.selectProfessionVariant (id))
  },
  setSortOrder (sortOrder: string) {
    dispatch (ProfessionActions.setProfessionsSortOrder (sortOrder))
  },
  setVisibilityFilter (filter: string) {
    dispatch (ProfessionActions.setProfessionsVisibilityFilter (filter))
  },
  setGroupVisibilityFilter (filter: number) {
    dispatch (ProfessionActions.setProfessionsGroupVisibilityFilter (filter))
  },
  switchExpansionVisibilityFilter () {
    dispatch (ProfessionActions.switchProfessionsExpansionVisibilityFilter ())
  },
  setFilterText (filterText: string) {
    dispatch (ProfessionActions.setProfessionsFilterText (filterText))
  },
})

export const connectProfessions =
  connect<ProfessionsStateProps, ProfessionsDispatchProps, ProfessionsOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  )

export const ProfessionsContainer = connectProfessions (Professions)
