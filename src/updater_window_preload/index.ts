import { contextBridge, ipcRenderer } from "electron"
import { UpdateInfo } from "electron-updater"
import EventEmitter from "events"
import { Locale } from "optolith-database-schema/types/Locale"
import { UI } from "optolith-database-schema/types/UI"
import { GlobalSettings } from "../shared/settings/GlobalSettings.ts"
import { GlobalSettingsEvents, attachGlobalSettingsEvents } from "../shared/settings/listeningRendererPreload.ts"
import { TypedEventEmitterForEvent } from "../shared/utils/events.ts"

export type PreloadAPI = {
  platform: NodeJS.Platform
  close: () => void
  setTitle: (title: string) => void
} & Events

type Events =
  & TypedEventEmitterForEvent<"initial-setup", [InitialSetupEventMessage]>
  & TypedEventEmitterForEvent<"update-available", [updateInfo: UpdateInfo]>
  & TypedEventEmitterForEvent<"no-update-available", []>
  & GlobalSettingsEvents

const events = new EventEmitter() as Events

const api: PreloadAPI = {
  on: events.on.bind(events),
  emit: events.emit.bind(events),
  removeListener: events.removeListener.bind(events),
  platform: process.platform,
  close: () => ipcRenderer.send("updater-window-close"),
  setTitle: title => ipcRenderer.send("updater-window-set-title", title),
}

contextBridge.exposeInMainWorld("optolith", api)

export type InitialSetupEventMessage = {
  translations: Record<string, UI>
  locales: Record<string, Locale>
  globalSettings: GlobalSettings
  systemLocale: string
  locale: string | undefined
}

ipcRenderer
  .on("initial-setup", (_event: Event, message: InitialSetupEventMessage) => {
    events.emit("initial-setup", message)
  })
  .on("update-available", (_event: Event, message: UpdateInfo) => {
    events.emit("update-available", message)
  })
  .on("no-update-available", (_event: Event) => {
    events.emit("no-update-available")
  })

attachGlobalSettingsEvents(ipcRenderer, events)
