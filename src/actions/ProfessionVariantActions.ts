import { ActionTypes } from '../constants/ActionTypes';
import { Maybe } from '../utils/dataUtils';

export interface SelectProfessionVariantAction {
  type: ActionTypes.SELECT_PROFESSION_VARIANT;
  payload: {
    id: Maybe<string>;
  };
}

export const selectProfessionVariant = (id: Maybe<string>): SelectProfessionVariantAction => ({
  type: ActionTypes.SELECT_PROFESSION_VARIANT,
  payload: {
    id
  }
});
