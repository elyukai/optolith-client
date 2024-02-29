import {
  attributeImprovementCost,
  createEmptyDynamicAttribute,
} from "../../shared/domain/rated/attribute.ts"
import { createRatedSlice } from "./ratedSlice.ts"

// eslint-disable-next-line jsdoc/require-jsdoc
export const {
  actions: {
    incrementEntry: incrementAttribute,
    setEntry: setAttribute,
    decrementEntry: decrementAttribute,
  },
  reducer: attributesReducer,
} = createRatedSlice({
  namespace: "attributes",
  entityName: "Attribute",
  getState: state => state.attributes,
  minValue: 8,
  getImprovementCost: () => attributeImprovementCost,
  createEmptyRated: createEmptyDynamicAttribute,
})
