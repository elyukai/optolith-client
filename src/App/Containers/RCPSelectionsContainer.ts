import { connect } from "react-redux";
import { ReduxDispatch } from "../Actions/Actions";
import * as ProfessionActions from "../Actions/ProfessionActions";
import { Selections as SelectionsInterface } from "../Models/Hero/heroTypeHelpers";
import { AppStateRecord } from "../Reducers/appReducer";
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from "../Selectors/rcpSelectors";
import { getWiki } from "../Selectors/stateSelectors";
import { RCPOptionSelections, SelectionsDispatchProps, SelectionsOwnProps, SelectionsStateProps } from "../Views/RCPOptionSelections/Selections";

const mapStateToProps = (state: AppStateRecord): SelectionsStateProps => ({
  currentRace: getCurrentRace (state),
  currentCulture: getCurrentCulture (state),
  currentProfession: getCurrentProfession (state),
  currentProfessionVariant: getCurrentProfessionVariant (state),
  wiki: getWiki (state),
})

const mapDispatchToProps = (dispatch: ReduxDispatch): SelectionsDispatchProps => ({
  setSelections (selections: SelectionsInterface) {
    dispatch (ProfessionActions.setSelections (selections))
  },
})

export const connectSelections =
  connect<SelectionsStateProps, SelectionsDispatchProps, SelectionsOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const SelectionsContainer = connectSelections (RCPOptionSelections)
