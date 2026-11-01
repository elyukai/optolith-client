import { createContext } from "react"
import {
  defaultCharacterIPCSelectors,
  type CharacterIPCActions,
  type CharacterIPCSelectors,
} from "../../shared/ipc.ts"

export const defaultCharacterStateAndActionsContextValue: {
  state: CharacterIPCSelectors
  actions: CharacterIPCActions
} = {
  state: defaultCharacterIPCSelectors,
  actions: new Proxy(
    {},
    {
      get:
        (_, actionName) =>
        (...args: unknown[]) => {
          console.error(
            "executing state action %s with parameters %o without set character values",
            actionName,
            args,
          )
        },
    },
  ) as CharacterIPCActions,
}

export const CharacterStateAndActionsContext = createContext<{
  state: CharacterIPCSelectors
  actions: CharacterIPCActions
}>(defaultCharacterStateAndActionsContextValue)
