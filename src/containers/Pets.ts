import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as PetActions from '../actions/PetActions';
import { AppState } from '../reducers/app';
import { getPets } from '../selectors/petsSelectors';
import { PetEditorInstance } from '../types/data.d';
import { Pets, PetsDispatchProps, PetsOwnProps, PetsStateProps } from '../views/belongings/Pets';

function mapStateToProps(state: AppState) {
	return {
		pets: getPets(state)
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
		}
	};
}

export const PetsContainer = connect<PetsStateProps, PetsDispatchProps, PetsOwnProps>(mapStateToProps, mapDispatchToProps)(Pets);
