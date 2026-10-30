import Debug from "debug"
import type { PreloadAPI } from "../main_window_preload/index.ts"
import { defaultCharacterIPCSelectors, type CharacterIPCActions } from "../shared/ipc.ts"
import { transformStateSelectorsFromContextBridgeIntoObservable } from "../shared/state.ts"

const debug = Debug("external")

type EnhancedWindow = Window & typeof globalThis & { optolith: PreloadAPI }

/**
 * The external API for the main window.
 */
export const ExternalAPI = (window as EnhancedWindow).optolith

export const SharedState = transformStateSelectorsFromContextBridgeIntoObservable(
  ExternalAPI,
  defaultCharacterIPCSelectors,
  debug,
)

export const SharedActions = new Proxy(
  {},
  {
    get:
      (_, actionName) =>
      (...args: unknown[]) => {
        debug("execute state action %s with parameters %o", actionName, args)
        return ExternalAPI.execute(
          actionName as keyof CharacterIPCActions,
          ...(args as Parameters<CharacterIPCActions[keyof CharacterIPCActions]>),
        )
      },
  },
) as CharacterIPCActions

// autorun(() => {
//   console.log(toJS(SharedState.adventurePointsStats))
// })
