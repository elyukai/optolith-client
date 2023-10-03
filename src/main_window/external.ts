import { PreloadAPI } from "../main_window_preload/index.ts"

type EnhancedWindow = Window & typeof globalThis & { optolith: PreloadAPI }

/**
 * The external API for the main window.
 */
export const ExternalAPI = (window as EnhancedWindow).optolith
