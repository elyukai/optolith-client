import { Maybe } from "../../Data/Maybe";
import { SELECT_PROFESSION_VARIANT } from "../Constants/ActionTypes";

export interface SelectProfessionVariantAction {
  type: SELECT_PROFESSION_VARIANT
  payload: {
    id: Maybe<string>;
  }
}

export const selectProfessionVariant = (id: Maybe<string>): SelectProfessionVariantAction => ({
  type: SELECT_PROFESSION_VARIANT,
  payload: {
    id,
  },
})
