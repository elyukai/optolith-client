import { ActionReducerMapBuilder } from "@reduxjs/toolkit"
import { RootState } from "../store.ts"
import { characterReducer } from "./characterSlice.ts"

export const globalReducer = (builder: ActionReducerMapBuilder<RootState>): void => {
  builder
    .addDefaultCase((state, action) => {
      const selectedId = state.route.path[0] === "characters"
        ? state.route.path[1]
        : undefined

      if (selectedId !== undefined) {
        state.characters[selectedId] =
          characterReducer(state.characters[selectedId], action)
      }
    })
}
