import { SELECT_PROFESSION_VARIANT } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const selectProfessionVariant = (id: string | null) => AppDispatcher.dispatch<SelectProfessionVariantAction>({
	type: SELECT_PROFESSION_VARIANT,
	payload: {
		id
	}
});
