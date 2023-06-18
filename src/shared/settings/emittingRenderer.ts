import { useEffect } from "react"
import { GlobalSettings } from "./GlobalSettings.ts"
import { GlobalSettingsEmittingAPI } from "./emittingRendererPreload.ts"

export const useBroadcastSetting = <K extends keyof GlobalSettings>(
  api: GlobalSettingsEmittingAPI,
  key: K,
  value: GlobalSettings[K],
) => {
  useEffect(() => {
    api.setGlobalSetting([ key, value ] as {
      [K1 in keyof GlobalSettings]: [key: K1, newValue: GlobalSettings[K1]]
    }[keyof GlobalSettings])
  }, [ api, key, value ])
}
