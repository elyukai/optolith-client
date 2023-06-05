import { PreloadAPI } from "../updater_window_preload/index.ts"

type EnhancedWindow = Window & typeof globalThis & { optolith: PreloadAPI }

export const preloadApi = (window as EnhancedWindow).optolith
