import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron"
import { ProgressInfo, UpdateDownloadedEvent, UpdateInfo } from "electron-updater"
import EventEmitter from "events"
import { Locale } from "optolith-database-schema/types/Locale"
import { UI } from "optolith-database-schema/types/UI"
import { GlobalSettings } from "../shared/settings/GlobalSettings.ts"
import {
  GlobalSettingsEvents,
  attachGlobalSettingsEvents,
} from "../shared/settings/listeningRendererPreload.ts"
import { TypedEventEmitterForEvent } from "../shared/utils/events.ts"

export type PreloadAPI = {
  platform: NodeJS.Platform
  close: () => void
  setTitle: (title: string) => void
  downloadUpdateLater: () => void
  downloadUpdate: () => void
  installUpdateLater: () => void
  quitAndInstallUpdate: () => void
} & Events

type Events = TypedEventEmitterForEvent<"initial-setup", [InitialSetupEventMessage]> &
  TypedEventEmitterForEvent<"update-available", [updateInfo: UpdateInfo]> &
  TypedEventEmitterForEvent<"no-update-available", []> &
  TypedEventEmitterForEvent<"download-progress", [updateInfo: ProgressInfo]> &
  TypedEventEmitterForEvent<"update-downloaded", [updateInfo: UpdateDownloadedEvent]> &
  TypedEventEmitterForEvent<"blur", []> &
  TypedEventEmitterForEvent<"focus", []> &
  GlobalSettingsEvents

const events = new EventEmitter() as Events

const api: PreloadAPI = {
  on: events.on.bind(events),
  emit: events.emit.bind(events),
  removeListener: events.removeListener.bind(events),
  platform: process.platform,
  close: () => ipcRenderer.send("updater-window-close"),
  setTitle: title => ipcRenderer.send("updater-window-set-title", title),
  downloadUpdateLater: () => ipcRenderer.send("download-update-later"),
  downloadUpdate: () => ipcRenderer.send("download-update"),
  installUpdateLater: () => ipcRenderer.send("install-update-later"),
  quitAndInstallUpdate: () => ipcRenderer.send("quit-and-install-update"),
}

contextBridge.exposeInMainWorld("optolith", api)

export type InitialSetupEventMessage = {
  translations: Record<string, UI>
  locales: Record<string, Locale>
  globalSettings: GlobalSettings
  systemLocale: string
}

ipcRenderer
  .on("initial-setup", (_event: IpcRendererEvent, message: InitialSetupEventMessage) => {
    events.emit("initial-setup", message)
  })
  .on("update-available", (_event: IpcRendererEvent, message: UpdateInfo) => {
    events.emit("update-available", message)
  })
  .on("no-update-available", (_event: IpcRendererEvent) => {
    events.emit("no-update-available")
  })
  .on("download-progress", (_event: IpcRendererEvent, message: ProgressInfo) => {
    events.emit("download-progress", message)
  })
  .on("update-downloaded", (_event: IpcRendererEvent, message: UpdateDownloadedEvent) => {
    events.emit("update-downloaded", message)
  })
  .on("blur", () => events.emit("blur"))
  .on("focus", () => events.emit("focus"))

attachGlobalSettingsEvents(ipcRenderer, events)
