import { useContext } from "react"
import type { CharacterIPCActions } from "../../shared/ipc.ts"
import { CharacterStateAndActionsContext } from "../context/CharacterStateAndActions.ts"

export const useCharacterActions = (): CharacterIPCActions =>
  useContext(CharacterStateAndActionsContext).actions
