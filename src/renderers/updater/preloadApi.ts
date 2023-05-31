import { PreloadAPI } from "./preload.ts"

type EnhancedWindow = Window & typeof globalThis & { optolith: PreloadAPI }

export const preloadApi = (window as EnhancedWindow).optolith
