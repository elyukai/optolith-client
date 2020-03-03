import { connect } from "react-redux"
import { join } from "../../Data/Maybe"
import { Record } from "../../Data/Record"
import { ReduxDispatch } from "../Actions/Actions"
import * as ConfigActions from "../Actions/ConfigActions"
import * as SpecialAbilitiesActions from "../Actions/SpecialAbilitiesActions"
import { ActivatableActivationOptions } from "../Models/Actions/ActivatableActivationOptions"
import { ActivatableDeactivationOptions } from "../Models/Actions/ActivatableDeactivationOptions"
import { AppStateRecord } from "../Models/AppState"
import { SpecialAbilitiesSortOptions } from "../Models/Config"
import { HeroModel } from "../Models/Hero/HeroModel"
import { getFilteredActiveSpecialAbilities } from "../Selectors/activatableSelectors"
import { getFilteredInactiveSpecialAbilities } from "../Selectors/combinedActivatablesSelectors"
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors"
import { getInactiveSpecialAbilitiesFilterText, getSpecialAbilitiesFilterText, getWikiSpecialAbilities } from "../Selectors/stateSelectors"
import { getEnableActiveItemHints, getSpecialAbilitiesSortOrder } from "../Selectors/uisettingsSelectors"
import { SpecialAbilities, SpecialAbilitiesDispatchProps, SpecialAbilitiesOwnProps, SpecialAbilitiesStateProps } from "../Views/SpecialAbilities/SpecialAbilities"

const mapStateToProps = (
  state: AppStateRecord,
  ownProps: SpecialAbilitiesOwnProps
): SpecialAbilitiesStateProps => ({
  activeList: getFilteredActiveSpecialAbilities (state, ownProps),
  deactiveList: join (getFilteredInactiveSpecialAbilities (HeroModel.A.id (ownProps.hero))
                                                          (state, ownProps)),
  enableActiveItemHints: getEnableActiveItemHints (state),
  isRemovingEnabled: getIsRemovingEnabled (state),
  wikiEntries: getWikiSpecialAbilities (state),
  sortOrder: getSpecialAbilitiesSortOrder (state),
  filterText: getSpecialAbilitiesFilterText (state),
  inactiveFilterText: getInactiveSpecialAbilitiesFilterText (state),
})

const mapDispatchToProps = (dispatch: ReduxDispatch): SpecialAbilitiesDispatchProps => ({
  setSortOrder (sortOrder: SpecialAbilitiesSortOptions) {
    dispatch (SpecialAbilitiesActions.setSpecialAbilitiesSortOrder (sortOrder))
  },
  switchActiveItemHints () {
    dispatch (ConfigActions.switchEnableActiveItemHints ())
  },
  async addToList (args: Record<ActivatableActivationOptions>) {
    await dispatch (SpecialAbilitiesActions.addSpecialAbility (args))
  },
  removeFromList (args: Record<ActivatableDeactivationOptions>) {
    dispatch (SpecialAbilitiesActions.removeSpecialAbility (args))
  },
  async setLevel (id: string, index: number, level: number) {
    await dispatch (SpecialAbilitiesActions.setSpecialAbilityLevel (id) (index) (level))
  },
  setFilterText (filterText: string) {
    dispatch (SpecialAbilitiesActions.setActiveSpecialAbilitiesFilterText (filterText))
  },
  setInactiveFilterText (filterText: string) {
    dispatch (SpecialAbilitiesActions.setInactiveSpecialAbilitiesFilterText (filterText))
  },
})

export const connectSpecialAbilities =
  connect<
    SpecialAbilitiesStateProps,
    SpecialAbilitiesDispatchProps,
    SpecialAbilitiesOwnProps,
    AppStateRecord
  > (
    mapStateToProps,
    mapDispatchToProps
  )

export const SpecialAbilitiesContainer = connectSpecialAbilities (SpecialAbilities)
