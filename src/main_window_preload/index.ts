import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron"
import EventEmitter from "events"
import type { Database } from "../database/index.ts"
import { GlobalSettings } from "../shared/settings/GlobalSettings.ts"
import {
  GlobalSettingsEvents,
  attachGlobalSettingsEvents,
} from "../shared/settings/listeningRendererPreload.ts"
import { TypedEventEmitter } from "../shared/utils/events.ts"

type Events = GlobalSettingsEvents & {
  "initial-setup": [InitialSetupEventMessage]
  maximize: []
  unmaximize: []
  blur: []
  focus: []
  "new-character": []
}

export type PreloadAPI = {
  platform: NodeJS.Platform
  systemLocale: string
  initialSetupDone: () => void
  checkForUpdates: () => void
  isMaximized: () => Promise<boolean>
  isFocused: () => Promise<boolean>
  minimize: () => void
  maximize: () => void
  restore: () => void
  close: () => void
  getLicense: () => Promise<string>
  getChangelog: () => Promise<string>
  getVersion: () => Promise<string>
  toggleDevTools: () => void
  showSettings: () => void
  setTitle: (title: string) => void
} & TypedEventEmitter<Events>

const events = new EventEmitter() as TypedEventEmitter<Events>

const api: PreloadAPI = {
  on: events.on.bind(events),
  emit: events.emit.bind(events),
  removeListener: events.removeListener.bind(events),
  platform: process.platform,
  systemLocale: "en-US",
  initialSetupDone: () => ipcRenderer.send("initial-setup-done"),
  checkForUpdates: () => ipcRenderer.send("check-for-updates"),
  isMaximized: () => ipcRenderer.invoke("main-window-receive-is-maximized"),
  isFocused: () => ipcRenderer.invoke("main-window-receive-is-focused"),
  minimize: () => ipcRenderer.send("main-window-minimize"),
  maximize: () => ipcRenderer.send("main-window-maximize"),
  restore: () => ipcRenderer.send("main-window-restore"),
  close: () => ipcRenderer.send("main-window-close"),
  getLicense: () => ipcRenderer.invoke("receive-license"),
  getChangelog: () => ipcRenderer.invoke("receive-changelog"),
  getVersion: () => ipcRenderer.invoke("receive-version"),
  toggleDevTools: () => ipcRenderer.send("main-window-toggle-dev-tools"),
  showSettings: () => ipcRenderer.send("show-settings"),
  setTitle: title => ipcRenderer.send("main-window-set-title", title),
}

contextBridge.exposeInMainWorld("optolith", api)

export type InitialSetupEventMessage = {
  database: Database
  globalSettings: GlobalSettings
  systemLocale: string
}

ipcRenderer
  .on("initial-setup", (_event: IpcRendererEvent, message: InitialSetupEventMessage) => {
    api.systemLocale = message.systemLocale
    events.emit("initial-setup", message)
  })
  .on("maximize", () => events.emit("maximize"))
  .on("unmaximize", () => events.emit("unmaximize"))
  .on("blur", () => events.emit("blur"))
  .on("focus", () => events.emit("focus"))
  .on("new-character", () => events.emit("new-character"))

attachGlobalSettingsEvents(ipcRenderer, events)
