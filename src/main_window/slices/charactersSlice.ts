import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store.ts"
import { CharacterState, characterReducer } from "./characterSlice.ts"

type CharactersState = {
  selectedId?: string
  characters: Record<string, CharacterState>
}

const initialState: CharactersState = {
  selectedId: "550e8400-e29b-11d4-a716-446655440000",
  characters: {},
}

const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addDefaultCase((state, action) => {
        if (state.selectedId !== undefined) {
          state.characters[state.selectedId] =
            characterReducer(state.characters[state.selectedId], action)
        }
      })
  },
})

// export const {} = localeSlice.actions

export const selectSelectedCharacterId = (state: RootState) => state.characters.selectedId
export const selectCharacters = (state: RootState) => state.characters.characters

export const charactersReducer = charactersSlice.reducer
