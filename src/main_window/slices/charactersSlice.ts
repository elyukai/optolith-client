import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store.ts"
import { CharacterState, initialCharacterState } from "./characterSlice.ts"

type CharactersState = Record<string, CharacterState>

const initialState: CharactersState = {
  "550e8400-e29b-11d4-a716-446655440000": initialCharacterState(),
}

const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {},
})

// export const { } = charactersSlice.actions

export const selectCharacters = (state: RootState) => state.characters

export const charactersReducer = charactersSlice.reducer
