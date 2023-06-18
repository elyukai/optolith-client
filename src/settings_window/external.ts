import { PreloadAPI } from "../settings_window_preload/index.ts"

type EnhancedWindow = Window & typeof globalThis & { optolith: PreloadAPI }

export const ExternalAPI = (window as EnhancedWindow).optolith
