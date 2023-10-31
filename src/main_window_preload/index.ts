import Debug from "debug"
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron"
import EventEmitter from "events"
import type { Database } from "../database/index.ts"
import { GlobalSettings } from "../shared/settings/GlobalSettings.ts"
import {
  GlobalSettingsEvents,
  attachGlobalSettingsEvents,
} from "../shared/settings/listeningRendererPreload.ts"
import { TypedEventEmitter } from "../shared/utils/events.ts"
const debugRendererCalls = Debug("mainwindowpreload:renderer")
const debugMainEvents = Debug("mainwindowpreload:main")

type Events = GlobalSettingsEvents & {
  "initial-setup": [InitialSetupEventMessage]
  maximize: []
  unmaximize: []
  blur: []
  focus: []
  "new-character": []
}

/**
 * The API that is exposed to the main window.
 */
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
  initialSetupDone: () => {
    debugRendererCalls("initial setup done")
    ipcRenderer.send("initial-setup-done")
  },
  checkForUpdates: () => {
    debugRendererCalls("check for updates")
    ipcRenderer.send("check-for-updates")
  },
  isMaximized: () => {
    debugRendererCalls("get is maximized")
    return ipcRenderer.invoke("main-window-receive-is-maximized")
  },
  isFocused: () => {
    debugRendererCalls("get is focused")
    return ipcRenderer.invoke("main-window-receive-is-focused")
  },
  minimize: () => {
    debugRendererCalls("minimize")
    ipcRenderer.send("main-window-minimize")
  },
  maximize: () => {
    debugRendererCalls("maximize")
    ipcRenderer.send("main-window-maximize")
  },
  restore: () => {
    debugRendererCalls("restore")
    ipcRenderer.send("main-window-restore")
  },
  close: () => {
    debugRendererCalls("close")
    ipcRenderer.send("main-window-close")
  },
  getLicense: () => {
    debugRendererCalls("get license")
    return ipcRenderer.invoke("receive-license")
  },
  getChangelog: () => {
    debugRendererCalls("get changelog")
    return ipcRenderer.invoke("receive-changelog")
  },
  getVersion: () => {
    debugRendererCalls("get version")
    return ipcRenderer.invoke("receive-version")
  },
  toggleDevTools: () => {
    debugRendererCalls("toggle dev tools")
    ipcRenderer.send("main-window-toggle-dev-tools")
  },
  showSettings: () => {
    debugRendererCalls("show settings")
    ipcRenderer.send("show-settings")
  },
  setTitle: title => {
    debugRendererCalls('set title to "%s"', title)
    ipcRenderer.send("main-window-set-title", title)
  },
}

contextBridge.exposeInMainWorld("optolith", api)

/**
 * The message that is sent from the main process to the main window right after
 * creation.
 */
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
  .on("maximize", () => {
    debugMainEvents("maximize")
    events.emit("maximize")
  })
  .on("unmaximize", () => {
    debugMainEvents("unmaximize")
    events.emit("unmaximize")
  })
  .on("blur", () => {
    debugMainEvents("blur")
    events.emit("blur")
  })
  .on("focus", () => {
    debugMainEvents("focus")
    events.emit("focus")
  })
  .on("new-character", () => {
    debugMainEvents("new-character")
    events.emit("new-character")
  })

attachGlobalSettingsEvents(ipcRenderer, events)
