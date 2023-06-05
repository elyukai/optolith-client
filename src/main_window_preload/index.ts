import { contextBridge, ipcRenderer } from "electron"
import EventEmitter from "events"
import { ValidResults } from "optolith-database-schema"
import { TypedEventEmitterForEvent } from "../shared/utils/events.ts"

export type PreloadAPI = {
  platform: NodeJS.Platform
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
} & Events

type Events =
  & TypedEventEmitterForEvent<"database-available", [database: ValidResults]>
  & TypedEventEmitterForEvent<"maximize", []>
  & TypedEventEmitterForEvent<"unmaximize", []>
  & TypedEventEmitterForEvent<"blur", []>
  & TypedEventEmitterForEvent<"focus", []>

const events = new EventEmitter() as Events

const api: PreloadAPI = {
  on: events.on.bind(events),
  emit: events.emit.bind(events),
  removeListener: events.removeListener.bind(events),
  platform: process.platform,
  checkForUpdates: () => ipcRenderer.send("check-for-updates"),
  isMaximized: () => ipcRenderer.invoke("receive-is-maximized"),
  isFocused: () => ipcRenderer.invoke("receive-is-focused"),
  minimize: () => ipcRenderer.send("minimize"),
  maximize: () => ipcRenderer.send("maximize"),
  restore: () => ipcRenderer.send("restore"),
  close: () => ipcRenderer.send("close"),
  getLicense: () => ipcRenderer.invoke("receive-license"),
  getChangelog: () => ipcRenderer.invoke("receive-changelog"),
  getVersion: () => ipcRenderer.invoke("receive-version"),
  toggleDevTools: () => ipcRenderer.send("toggle-dev-tools"),
}

contextBridge.exposeInMainWorld("optolith", api)

ipcRenderer
  .on("database-available", (_event: Event, database: ValidResults) => {
    events.emit("database-available", database)
  })
  .on("maximize", () => events.emit("maximize"))
  .on("unmaximize", () => events.emit("unmaximize"))
  .on("blur", () => events.emit("blur"))
  .on("focus", () => events.emit("focus"))
