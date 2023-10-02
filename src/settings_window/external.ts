import { PreloadAPI } from "../settings_window_preload/index.ts"

type EnhancedWindow = Window & typeof globalThis & { optolith: PreloadAPI }

/**
 * The API that is exposed to the settings window.
 */
export const ExternalAPI = (window as EnhancedWindow).optolith
