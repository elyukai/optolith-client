import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as HerolistActions from '../App/Actions/HerolistActions';
import * as HistoryActions from '../App/Actions/HistoryActions';
import * as InGameActions from '../App/Actions/InGameActions';
import * as LocationActions from '../App/Actions/LocationActions';
import * as SubwindowsActions from '../App/Actions/SubwindowsActions';
import { TabId } from '../App/Utils/LocationUtils';
import { AppState } from '../reducers/appReducer';
import { getAdventurePointsObject, getMagicalAdvantagesDisadvantagesAdventurePointsMaximum } from '../Selectors/adventurePointsSelectors';
import { getRedoAvailability, getUndoAvailability } from '../Selectors/currentHeroSelectors';
import { getIsLiturgicalChantsTabAvailable } from '../Selectors/liturgicalChantsSelectors';
import { getIsRemovingEnabled } from '../Selectors/phaseSelectors';
import { getIsSpellsTabAvailable } from '../Selectors/spellsSelectors';
import { getAvatar, getCurrentTab, getIsSettingsOpen } from '../Selectors/stateSelectors';
import { getIsHeroSection, getSubtabs, getTabs } from '../Selectors/uilocationSelectors';
import { UIMessagesObject } from '../types/ui';
import { Nothing } from '../Utilities/dataUtils';
import { NavigationBar, NavigationBarDispatchProps, NavigationBarOwnProps, NavigationBarStateProps } from '../Views/navigationbar/NavigationBar';

const mapStateToProps = (state: AppState, ownProps: { locale: UIMessagesObject }) => ({
  currentTab: getCurrentTab (state),
  avatar: getAvatar (state),
  isRedoAvailable: getRedoAvailability (state),
  isUndoAvailable: getUndoAvailability (state),
  isRemovingEnabled: getIsRemovingEnabled (state),
  isSettingsOpen: getIsSettingsOpen (state),
  isHeroSection: getIsHeroSection (state),
  tabs: getTabs (state, ownProps),
  subtabs: getSubtabs (state, ownProps),
  adventurePoints: getAdventurePointsObject (state, ownProps),
  maximumForMagicalAdvantagesDisadvantages:
    getMagicalAdvantagesDisadvantagesAdventurePointsMaximum (state),
  isSpellcaster: getIsSpellsTabAvailable (state),
  isBlessedOne: getIsLiturgicalChantsTabAvailable (state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Action, AppState>,
  ownProps: { locale: UIMessagesObject }
) => ({
  setTab (id: TabId) {
    dispatch (LocationActions.setTab (id));
  },
  undo () {
    dispatch (HistoryActions.undo ());
  },
  redo () {
    dispatch (HistoryActions.redo ());
  },
  saveHero () {
    dispatch (HerolistActions.saveHero (ownProps.locale) (Nothing ()));
  },
  openSettings () {
    dispatch (SubwindowsActions.openSettings ());
  },
  closeSettings () {
    dispatch (SubwindowsActions.closeSettings ());
  },
  saveGroup () {
    dispatch (InGameActions._save ());
  },
});

const connectNavigationBarContainer =
  connect<NavigationBarStateProps, NavigationBarDispatchProps, NavigationBarOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const NavigationBarContainer = connectNavigationBarContainer (NavigationBar);
