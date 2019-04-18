import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import * as ProfessionActions from "../Actions/ProfessionActions";
import { Selections as SelectionsInterface } from "../Models/Hero/heroTypeHelpers";
import { AppState } from "../Reducers/appReducer";
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from "../Selectors/rcpSelectors";
import { getWiki } from "../Selectors/stateSelectors";
import { Selections, SelectionsDispatchProps, SelectionsOwnProps, SelectionsStateProps } from "../Views/RCPOptionSelections/Selections";

const mapStateToProps = (state: AppState): SelectionsStateProps => ({
  currentRace: getCurrentRace (state),
  currentCulture: getCurrentCulture (state),
  currentProfession: getCurrentProfession (state),
  currentProfessionVariant: getCurrentProfessionVariant (state),
  wiki: getWiki (state),
})

const mapDispatchToProps = (dispatch: Dispatch<Action, AppState>): SelectionsDispatchProps => ({
  setSelections (selections: SelectionsInterface) {
    dispatch (ProfessionActions.setSelections (selections))
  },
})

export const connectSelections =
  connect<SelectionsStateProps, SelectionsDispatchProps, SelectionsOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  )

export const SelectionsContainer = connectSelections (Selections)
