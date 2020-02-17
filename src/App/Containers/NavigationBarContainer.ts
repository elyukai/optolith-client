import { connect } from "react-redux"
import { bind, join, Nothing } from "../../Data/Maybe"
import { ReduxDispatch } from "../Actions/Actions"
import * as HerolistActions from "../Actions/HerolistActions"
import * as HistoryActions from "../Actions/HistoryActions"
import * as InGameActions from "../Actions/InGameActions"
import * as LocationActions from "../Actions/LocationActions"
import * as SubwindowsActions from "../Actions/SubwindowsActions"
import { AppStateRecord } from "../Models/AppState"
import { HeroModel } from "../Models/Hero/HeroModel"
import { getAPObjectMap, getMagicalAdvantagesDisadvantagesAdventurePointsMaximum } from "../Selectors/adventurePointsSelectors"
import { getRedoAvailability, getUndoAvailability } from "../Selectors/currentHeroSelectors"
import { getIsLiturgicalChantsTabAvailable } from "../Selectors/liturgicalChantsSelectors"
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors"
import { getIsSpellsTabAvailable } from "../Selectors/spellsSelectors"
import { getAvatar, getCurrentTab, getIsSettingsOpen } from "../Selectors/stateSelectors"
import { getIsHeroSection, getSubtabs, getTabs } from "../Selectors/uilocationSelectors"
import { TabId } from "../Utilities/LocationUtils"
import { NavigationBar, NavigationBarDispatchProps, NavigationBarOwnProps, NavigationBarStateProps } from "../Views/NavBar/NavigationBar"

const mapStateToProps =
  (state: AppStateRecord, ownProps: NavigationBarOwnProps): NavigationBarStateProps => ({
    currentTab: getCurrentTab (state),
    avatar: getAvatar (state),
    isRedoAvailable: getRedoAvailability (state),
    isUndoAvailable: getUndoAvailability (state),
    isRemovingEnabled: getIsRemovingEnabled (state),
    isSettingsOpen: getIsSettingsOpen (state),
    isHeroSection: getIsHeroSection (state),
    tabs: getTabs (state),
    subtabs: getSubtabs (state, ownProps),
    adventurePoints: join (bind (ownProps.mhero)
                                (hero => getAPObjectMap (HeroModel.A.id (hero))
                                                        (state, { ...ownProps, hero }))),
    maximumForMagicalAdvantagesDisadvantages:
      getMagicalAdvantagesDisadvantagesAdventurePointsMaximum (state),
    isSpellcaster: getIsSpellsTabAvailable (state, ownProps),
    isBlessedOne: getIsLiturgicalChantsTabAvailable (state, ownProps),
  })

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
  setTab (id: TabId) {
    dispatch (LocationActions.setTab (id))
  },
  undo () {
    dispatch (HistoryActions.undo ())
  },
  redo () {
    dispatch (HistoryActions.redo ())
  },
  async saveHero () {
    await dispatch (HerolistActions.saveHero (Nothing))
  },
  openSettings () {
    dispatch (SubwindowsActions.openSettings ())
  },
  closeSettings () {
    dispatch (SubwindowsActions.closeSettings ())
  },
  saveGroup () {
    dispatch (InGameActions._save ())
  },
})

const connectNavigationBarContainer =
  connect<
    NavigationBarStateProps,
    NavigationBarDispatchProps,
    NavigationBarOwnProps,
    AppStateRecord
  > (
    mapStateToProps,
    mapDispatchToProps
  )

export const NavigationBarContainer = connectNavigationBarContainer (NavigationBar)
