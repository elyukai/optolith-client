import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ProfessionActions from '../App/Actions/ProfessionActions';
import { Selections as SelectionsInterface } from '../App/Models/Hero/heroTypeHelpers';
import { AppState } from '../reducers/appReducer';
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from '../Selectors/rcpSelectors';
import { getWiki } from '../Selectors/stateSelectors';
import { Selections, SelectionsDispatchProps, SelectionsOwnProps, SelectionsStateProps } from '../Views/rcp/Selections';

const mapStateToProps = (state: AppState): SelectionsStateProps => ({
  currentRace: getCurrentRace (state),
  currentCulture: getCurrentCulture (state),
  currentProfession: getCurrentProfession (state),
  currentProfessionVariant: getCurrentProfessionVariant (state),
  wiki: getWiki (state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action, AppState>): SelectionsDispatchProps => ({
  setSelections (selections: SelectionsInterface) {
    dispatch (ProfessionActions.setSelections (selections));
  },
});

export const connectSelections =
  connect<SelectionsStateProps, SelectionsDispatchProps, SelectionsOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const SelectionsContainer = connectSelections (Selections);
