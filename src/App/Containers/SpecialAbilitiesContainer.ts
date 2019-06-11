import { connect } from "react-redux";
import { join } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { ReduxDispatch } from "../Actions/Actions";
import * as ConfigActions from "../Actions/ConfigActions";
import * as SpecialAbilitiesActions from "../Actions/SpecialAbilitiesActions";
import { ActivatableActivationOptions } from "../Models/Actions/ActivatableActivationOptions";
import { ActivatableDeactivationOptions } from "../Models/Actions/ActivatableDeactivationOptions";
import { HeroModel } from "../Models/Hero/HeroModel";
import { AppStateRecord } from "../Reducers/appReducer";
import { getFilteredActiveSpecialAbilities } from "../Selectors/activatableSelectors";
import { getFilteredInactiveSpecialAbilities } from "../Selectors/combinedActivatablesSelectors";
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors";
import { getInactiveSpecialAbilitiesFilterText, getSpecialAbilitiesFilterText, getWikiSpecialAbilities } from "../Selectors/stateSelectors";
import { getEnableActiveItemHints, getSpecialAbilitiesSortOrder } from "../Selectors/uisettingsSelectors";
import { SpecialAbilities, SpecialAbilitiesDispatchProps, SpecialAbilitiesOwnProps, SpecialAbilitiesStateProps } from "../Views/SpecialAbilities/SpecialAbilities";

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

const mapDispatchToProps = (
  dispatch: ReduxDispatch,
  { l10n }: SpecialAbilitiesOwnProps
): SpecialAbilitiesDispatchProps => ({
  setSortOrder (sortOrder: string) {
    dispatch (SpecialAbilitiesActions.setSpecialAbilitiesSortOrder (sortOrder))
  },
  switchActiveItemHints () {
    dispatch (ConfigActions.switchEnableActiveItemHints ())
  },
  addToList (args: Record<ActivatableActivationOptions>) {
    dispatch (SpecialAbilitiesActions.addSpecialAbility (l10n) (args))
  },
  removeFromList (args: Record<ActivatableDeactivationOptions>) {
    dispatch (SpecialAbilitiesActions.removeSpecialAbility (args))
  },
  setLevel (id: string, index: number, level: number) {
    dispatch (SpecialAbilitiesActions.setSpecialAbilityLevel (l10n) (id) (index) (level))
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
