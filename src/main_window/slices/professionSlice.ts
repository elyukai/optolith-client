/* eslint-disable jsdoc/require-jsdoc */
import { createAction } from "@reduxjs/toolkit"
import { createImmerReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"

export const setProfession = createAction<{ id: number; instanceId: number }>(
  "profession/setProfession",
)
export const setProfessionVariant = createAction<number>("profession/setProfessionVariant")
export const setCustomProfessionName = createAction<string>("profession/setCustomProfessionName")

export const professionReducer = createImmerReducer<CharacterState>((state, action) => {
  if (setProfession.match(action)) {
    state.profession.id = action.payload.id
    state.profession.instanceId = action.payload.instanceId
    state.profession.variantId = undefined
  } else if (setProfessionVariant.match(action)) {
    state.profession.variantId = action.payload
  } else if (setCustomProfessionName.match(action)) {
    state.profession.customName = action.payload.length > 0 ? action.payload : undefined
  }
})
