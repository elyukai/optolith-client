import { connect } from "react-redux";
import { AppStateRecord } from "../Reducers/appReducer";
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors";
import { getSkills, getWiki } from "../Selectors/stateSelectors";
import { ActivatableAddListItem, ActivatableAddListItemDispatchProps, ActivatableAddListItemOwnProps, ActivatableAddListItemStateProps } from "../Views/Activatable/ActivatableAddListItem";

const mapStateToProps = (state: AppStateRecord): ActivatableAddListItemStateProps => ({
  skills: getSkills (state),
  wiki: getWiki (state),
  isEditingAllowed: getIsRemovingEnabled (state),
})


export const connectActivatableAddListItem =
  connect<
    ActivatableAddListItemStateProps,
    ActivatableAddListItemDispatchProps,
    ActivatableAddListItemOwnProps,
    AppStateRecord
  >
    (mapStateToProps)

export const ActivatableAddListItemContainer =
  connectActivatableAddListItem (ActivatableAddListItem)
