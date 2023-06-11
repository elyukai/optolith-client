import { createSelector } from "@reduxjs/toolkit"
import { selectIsCharacterCreationFinished } from "../slices/characterSlice.ts"

export const selectIsInCharacterCreation = createSelector(
  selectIsCharacterCreationFinished,
  (isCharacterCreationFinished): boolean => !isCharacterCreationFinished
)
