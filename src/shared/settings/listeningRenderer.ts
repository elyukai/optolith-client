import { GlobalSettings } from "./GlobalSettings.ts"
import { GlobalSettingsEventEmitter } from "./listeningRendererPreload.ts"

export const onGlobalSettingsUpdate = (
  api: GlobalSettingsEventEmitter,
  actions: { [K in keyof GlobalSettings]: (value: GlobalSettings[K]) => void },
) => {
  api.on("global-setting-changed", ([key, value]) => {
    actions[key](value as never)
  })
}
