import { createImmerReducer } from "../../shared/utils/redux.ts"
import { RootState } from "../store.ts"
import { characterReducer } from "./characterSlice.ts"

export const globalReducer = createImmerReducer<RootState>((state, action) => {
  const selectedId = state.route.path[0] === "characters" ? state.route.path[1] : undefined

  if (selectedId !== undefined) {
    const character = state.characters[selectedId]

    if (character !== undefined) {
      characterReducer(character, action, state.database)
    }
  }
})
