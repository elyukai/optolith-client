import { createSelectorCreator, defaultMemoize } from "reselect";
import { INTERNAL_shallowEquals, isMaybe } from "./structures/Maybe";

export const createMaybeSelector = createSelectorCreator (
  defaultMemoize,
  (currentVal: any, previousVal: any) =>
    isMaybe (currentVal)
      ? INTERNAL_shallowEquals (currentVal) (previousVal)
      : currentVal === previousVal
)
