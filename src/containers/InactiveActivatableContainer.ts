import { connect } from 'react-redux';
import { ActivatableAddListItem, ActivatableAddListItemDispatchProps, ActivatableAddListItemOwnProps, ActivatableAddListItemStateProps } from '../components/ActivatableAddListItem';
import { AppState } from '../reducers/appReducer';
import { getSkills, getWiki } from '../selectors/stateSelectors';

const mapStateToProps = (state: AppState): ActivatableAddListItemStateProps => ({
  skills: getSkills (state),
  wiki: getWiki (state),
});


export const connectActivatableAddListItem =
  connect<
    ActivatableAddListItemStateProps,
    ActivatableAddListItemDispatchProps,
    ActivatableAddListItemOwnProps,
    AppState
  >
    (mapStateToProps);

export const ActivatableAddListItemContainer =
  connectActivatableAddListItem (ActivatableAddListItem);
