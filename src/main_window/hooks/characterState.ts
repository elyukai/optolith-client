import { useContext } from "react"
import type { CharacterIPCSelectors } from "../../shared/ipc.ts"
import { CharacterStateAndActionsContext } from "../context/CharacterStateAndActions.ts"

export const useCharacterState = (): CharacterIPCSelectors =>
  useContext(CharacterStateAndActionsContext).state
