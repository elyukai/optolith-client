import { createAction } from "@reduxjs/toolkit"
import { createImmerReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"

export const changeAttributeAdjustmentId = createAction<number>("race/changeAttributeAdjustmentId")

export const raceReducer =
  createImmerReducer<CharacterState>((state, action) => {
    if (changeAttributeAdjustmentId.match(action)) {
      state.race.selectedAttributeAdjustmentId = action.payload
    }
  })
