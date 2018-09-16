import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as PetActions from '../actions/PetActions';
import * as SubwindowsActions from '../actions/SubwindowsActions';
import { AppState } from '../reducers/appReducer';
import { getPets } from '../selectors/petsSelectors';
import { isEditPetAvatarOpen } from '../selectors/stateSelectors';
import { PetEditorInstance } from '../types/data';
import { Pets, PetsDispatchProps, PetsOwnProps, PetsStateProps } from '../views/belongings/Pets';

function mapStateToProps(state: AppState) {
  return {
    pets: getPets(state),
    isEditPetAvatarOpen: isEditPetAvatarOpen(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    savePet(instance: PetEditorInstance | undefined) {
      if (instance) {
        if (typeof instance.id !== 'string') {
          dispatch(PetActions._addToList(instance));
        }
        else {
          dispatch(PetActions._set(instance.id, instance));
        }
      }
    },
    deletePet(id: string) {
      dispatch(PetActions._removeFromList(id));
    },
    openEditPetAvatar() {
      dispatch(SubwindowsActions.openEditPetAvatar());
    },
    closeEditPetAvatar() {
      dispatch(SubwindowsActions.closeEditPetAvatar());
    },
  };
}

export const PetsContainer = connect<PetsStateProps, PetsDispatchProps, PetsOwnProps>(mapStateToProps, mapDispatchToProps)(Pets);
