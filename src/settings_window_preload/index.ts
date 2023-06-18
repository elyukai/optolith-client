import { contextBridge, ipcRenderer } from "electron"
import EventEmitter from "events"
import { Locale } from "optolith-database-schema/types/Locale"
import { UI } from "optolith-database-schema/types/UI"
import { GlobalSettings } from "../main/settingsWindow.ts"
import { GlobalSettingsEmittingAPI, globalSettingsEmittingAPI } from "../shared/settings/emittingRendererPreload.ts"
import { TypedEventEmitterForEvent } from "../shared/utils/events.ts"

export type PreloadAPI = {
  platform: NodeJS.Platform
  checkForUpdate: () => void
  close: () => void
  setTitle: (title: string) => void
} & Events & GlobalSettingsEmittingAPI

type Events =
  & TypedEventEmitterForEvent<"initial-setup", [InitialSetupEventMessage]>

const events = new EventEmitter() as Events

const api: PreloadAPI = {
  on: events.on.bind(events),
  emit: events.emit.bind(events),
  removeListener: events.removeListener.bind(events),
  platform: process.platform,
  checkForUpdate: () => ipcRenderer.send("check-for-update"),
  close: () => ipcRenderer.send("settings-window-close"),
  setTitle: title => ipcRenderer.send("settings-window-set-title", title),
  ...globalSettingsEmittingAPI,
}

contextBridge.exposeInMainWorld("optolith", api)

export type InitialSetupEventMessage = {
  translations: Record<string, UI>
  locales: Record<string, Locale>
  systemLocale: string
  settings: GlobalSettings
}

ipcRenderer
  .on("initial-setup", (
    _event: Event,
    message: InitialSetupEventMessage
  ) => {
    events.emit("initial-setup", message)
  })