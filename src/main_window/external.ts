import Debug from "debug"
import type { GlobalIPCState } from "../main/index.ts"
import type { PreloadAPI } from "../main_window_preload/index.ts"
import { defaultCharacterIPCSelectors, type CharacterIPCActions } from "../shared/ipc.ts"
import {
  transformKeyedStateSelectorsFromContextBridgeIntoObservable,
  transformStateSelectorsFromContextBridgeIntoObservable,
} from "../shared/state.ts"

const debug = Debug("external")

type EnhancedWindow = Window & typeof globalThis & { optolith: PreloadAPI }

/**
 * The external API for the main window.
 */
export const ExternalAPI = (window as EnhancedWindow).optolith

const defaultGlobalState: GlobalIPCState = { characters: [] }

export const SharedGlobalState = transformStateSelectorsFromContextBridgeIntoObservable(
  ExternalAPI,
  defaultGlobalState,
  debug,
)

export const SharedCharacterState = transformKeyedStateSelectorsFromContextBridgeIntoObservable(
  ExternalAPI,
  defaultCharacterIPCSelectors,
  debug,
)

export const executeStateAction = <Action extends keyof CharacterIPCActions>(
  characterId: string,
  actionName: Action,
  ...args: Parameters<CharacterIPCActions[Action]>
) => {
  debug("execute state action %s with parameters %o", actionName, args)
  return ExternalAPI.executeKeyed(characterId, actionName, ...args)
}

// autorun(() => {
//   console.log(toJS(SharedState.adventurePointsStats))
// })
