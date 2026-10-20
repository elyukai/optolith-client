import { PreloadAPI } from "../main_window_preload/index.ts"
import { defaultCharacterIPCSelectors } from "../shared/ipc.ts"
import { transformStateSelectorsFromContextBridgeIntoObservable } from "../shared/state.ts"

type EnhancedWindow = Window & typeof globalThis & { optolith: PreloadAPI }

/**
 * The external API for the main window.
 */
export const ExternalAPI = (window as EnhancedWindow).optolith

export const SharedState = transformStateSelectorsFromContextBridgeIntoObservable(
  ExternalAPI,
  defaultCharacterIPCSelectors,
)

// autorun(() => {
//   console.log(toJS(SharedState.adventurePointsStats))
// })
