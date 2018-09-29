import { connect } from 'react-redux';
import { ActivatableAddListItem, ActivatableAddListItemDispatchProps, ActivatableAddListItemOwnProps, ActivatableAddListItemStateProps } from '../components/ActivatableAddListItem';
import { AppState } from '../reducers/appReducer';
import { getCurrentHeroPresent, getSkills, getWiki } from '../selectors/stateSelectors';
import { getHeroStateListItem } from '../utils/heroStateUtils';

const mapStateToProps = (state: AppState): ActivatableAddListItemStateProps => ({
  skills: getSkills (state),
  wiki: getWiki (state),
  get: (id: string) => getCurrentHeroPresent (state) .bind (getHeroStateListItem (id)),
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
