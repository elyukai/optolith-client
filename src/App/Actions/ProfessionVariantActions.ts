import { Maybe } from "../../Data/Maybe";
import { ActionTypes } from "../Constants/ActionTypes";

export interface SelectProfessionVariantAction {
  type: ActionTypes.SELECT_PROFESSION_VARIANT
  payload: {
    id: Maybe<string>;
  }
}

export const selectProfessionVariant = (id: Maybe<string>): SelectProfessionVariantAction => ({
  type: ActionTypes.SELECT_PROFESSION_VARIANT,
  payload: {
    id,
  },
})
