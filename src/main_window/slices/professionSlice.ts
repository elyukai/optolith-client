import { ActionReducerMapBuilder, createAction } from "@reduxjs/toolkit"
import { CharacterState } from "./characterSlice.ts"

export const setProfession = createAction<{ id: number; instanceId: number }>("profession/setProfession")
export const setProfessionVariant = createAction<number>("profession/setProfessionVariant")
export const setCustomProfessionName = createAction<string>("profession/setCustomProfessionName")

export const professionReducer = (builder: ActionReducerMapBuilder<CharacterState>) =>
  builder
    .addCase(setProfession, (state, action) => {
      state.profession.id = action.payload.id
      state.profession.instanceId = action.payload.instanceId
      state.profession.variantId = undefined
    })
    .addCase(setProfessionVariant, (state, action) => {
      state.profession.variantId = action.payload
    })
    .addCase(setCustomProfessionName, (state, action) => {
      state.profession.customName = action.payload.length > 0 ? action.payload : undefined
    })
