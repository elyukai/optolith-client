import { GlobalSettings } from "./GlobalSettings.ts"
import { GlobalSettingsEvents } from "./listeningRendererPreload.ts"

export const onGlobalSettingsUpdate = (
  api: GlobalSettingsEvents,
  actions: { [K in keyof GlobalSettings]: (value: GlobalSettings[K]) => void },
) => {
  api.on("global-setting-changed", ([key, value]) => {
    actions[key](value as never)
  })
}
