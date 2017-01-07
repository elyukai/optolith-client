import { SELECT_PROFESSION_VARIANT } from '../constants/ActionTypes';

export interface SelectProfessionVariantAction {
	type: SELECT_PROFESSION_VARIANT;
	payload: {
		id: string;
	};
}

export const selectProfessionVariant = (id: string): SelectProfessionVariantAction => ({
	type: SELECT_PROFESSION_VARIANT,
	payload: {
		id
	}
});
