import { connect } from "react-redux"
import { Action } from "redux"
import { fromJust, isJust, Just, Maybe } from "../../Data/Maybe"
import { OrderedSet } from "../../Data/OrderedSet"
import { ReduxDispatch } from "../Actions/Actions"
import * as HerolistActions from "../Actions/HerolistActions"
import * as IOActions from "../Actions/IOActions"
import * as LocationActions from "../Actions/LocationActions"
import * as SubwindowsActions from "../Actions/SubwindowsActions"
import { AppStateRecord } from "../Models/AppState"
import { HeroListSortOptions, HeroListVisibilityFilter } from "../Models/Config"
import { getSortedBooks } from "../Selectors/bookSelectors"
import { getSortedHerolist, getUnsavedHeroesById } from "../Selectors/herolistSelectors"
import { getCurrentHeroPresent, getHerolistFilterText, getIsCharacterCreatorOpen, getUsers, getWiki, getWikiExperienceLevels } from "../Selectors/stateSelectors"
import { getHerolistSortOrder, getHerolistVisibilityFilter } from "../Selectors/uisettingsSelectors"
import { TabId } from "../Utilities/LocationUtils"
import { Herolist, HerolistDispatchProps, HerolistOwnProps, HerolistStateProps } from "../Views/Heroes/Herolist"

const mapStateToProps = (state: AppStateRecord) => ({
  currentHero: getCurrentHeroPresent (state),
  experienceLevels: getWikiExperienceLevels (state),
  filterText: getHerolistFilterText (state),
  list: getSortedHerolist (state),
  unsavedHeroesById: getUnsavedHeroesById (state),
  users: getUsers (state),
  sortOrder: getHerolistSortOrder (state),
  visibilityFilter: getHerolistVisibilityFilter (state),
  isCharacterCreatorOpen: getIsCharacterCreatorOpen (state),
  sortedBooks: getSortedBooks (state),
  wiki: getWiki (state),
})

const mapDispatchToProps = (dispatch: ReduxDispatch<Action>) => ({
  loadHero (id: string) {
    dispatch (HerolistActions.loadHero (id))
  },
  showHero () {
    dispatch (LocationActions.setTab (TabId.Profile))
  },
  async saveHero (id: string) {
    await dispatch (HerolistActions.saveHero (Just (id)))
  },
  saveHeroAsJSON (id: string) {
    dispatch (HerolistActions.exportHeroValidate (id))
  },
  async deleteHero (id: string) {
    await dispatch (HerolistActions.deleteHeroValidate (id))
  },
  duplicateHero (id: string) {
    dispatch (HerolistActions.duplicateHero (id))
  },
  createHero (
    name: string,
    sex: "m" | "f",
    el: string,
    enableAllRuleBooks: boolean,
    enabledRuleBooks: OrderedSet<string>
  ) {
    dispatch (HerolistActions.createHero (name)
                                         (sex)
                                         (el)
                                         (enableAllRuleBooks)
                                         (enabledRuleBooks))
  },
  async importHero () {
    await dispatch (IOActions.requestHeroImport)
  },
  setSortOrder (id: HeroListSortOptions) {
    dispatch (HerolistActions.setHerolistSortOrder (id))
  },
  setFilterText (newText: string) {
    dispatch (HerolistActions.setHerolistFilterText (newText))
  },
  setVisibilityFilter (id: Maybe<HeroListVisibilityFilter>) {
    if (isJust (id)) {
      dispatch (HerolistActions.setHerolistVisibilityFilter (fromJust (id)))
    }
  },
  openCharacterCreator () {
    dispatch (SubwindowsActions.openCharacterCreator ())
  },
  closeCharacterCreator () {
    dispatch (SubwindowsActions.closeCharacterCreator ())
  },
})

const connectHerolist =
  connect<HerolistStateProps, HerolistDispatchProps, HerolistOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const HerolistContainer = connectHerolist (Herolist)
