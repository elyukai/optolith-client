import { connect } from "react-redux";
import { ReduxDispatch } from "../Actions/Actions";
import * as ProfessionActions from "../Actions/ProfessionActions";
import { Selections as SelectionsInterface } from "../Models/Hero/heroTypeHelpers";
import { AppStateRecord } from "../Reducers/appReducer";
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from "../Selectors/rcpSelectors";
import { getAllSpellsForManualGuildMageSelect } from "../Selectors/spellsSelectors";
import { getRules, getWiki } from "../Selectors/stateSelectors";
import { RCPOptionSelections, SelectionsDispatchProps, SelectionsOwnProps, SelectionsStateProps } from "../Views/RCPOptionSelections/Selections";

const mapStateToProps =
  (state: AppStateRecord, ownProps: SelectionsOwnProps): SelectionsStateProps => ({
    currentRace: getCurrentRace (state),
    currentCulture: getCurrentCulture (state),
    currentProfession: getCurrentProfession (state),
    currentProfessionVariant: getCurrentProfessionVariant (state),
    wiki: getWiki (state),
    munfamiliar_spells: getAllSpellsForManualGuildMageSelect (state, ownProps),
    rules: getRules (state, ownProps),
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
