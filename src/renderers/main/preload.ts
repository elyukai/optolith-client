import { contextBridge, ipcRenderer } from "electron"
import EventEmitter from "events"
import { ValidResults } from "optolith-database-schema"
import { TypedEventEmitterForEvent } from "../../shared/helpers/events.ts"

export type PreloadAPI = {
  platform: NodeJS.Platform
  checkForUpdates: () => void
  isMaximized: () => Promise<boolean>
  isFullScreen: () => Promise<boolean>
  isFocused: () => Promise<boolean>
  minimize: () => void
  maximize: () => void
  restore: () => void
  enterFullScreen: () => void
  leaveFullScreen: () => void
  close: () => void
} & Events

type Events =
  & TypedEventEmitterForEvent<"database-available", [database: ValidResults]>
  & TypedEventEmitterForEvent<"maximize", []>
  & TypedEventEmitterForEvent<"unmaximize", []>
  & TypedEventEmitterForEvent<"enter-full-screen", []>
  & TypedEventEmitterForEvent<"leave-full-screen", []>
  & TypedEventEmitterForEvent<"blur", []>
  & TypedEventEmitterForEvent<"focus", []>

const events = new EventEmitter() as Events

const api: PreloadAPI = {
  on: events.on.bind(events),
  emit: events.emit.bind(events),
  removeListener: events.removeListener.bind(events),
  platform: process.platform,
  checkForUpdates: () => {
    ipcRenderer.send("check-for-updates")
  },
  isMaximized: () => ipcRenderer.invoke("receive-is-maximized"),
  isFullScreen: () => ipcRenderer.invoke("receive-is-full-screen"),
  isFocused: () => ipcRenderer.invoke("receive-is-focused"),
  minimize: () => ipcRenderer.send("minimize"),
  maximize: () => ipcRenderer.send("maximize"),
  restore: () => ipcRenderer.send("restore"),
  enterFullScreen: () => ipcRenderer.send("enter-full-screen"),
  leaveFullScreen: () => ipcRenderer.send("leave-full-screen"),
  close: () => ipcRenderer.send("close"),
}

contextBridge.exposeInMainWorld("optolith", api)

ipcRenderer
  .on("database-available", (_event: Event, database: ValidResults) => {
    events.emit("database-available", database)
  })
  .on("maximize", () => events.emit("maximize"))
  .on("unmaximize", () => events.emit("unmaximize"))
  .on("enter-full-screen", () => events.emit("enter-full-screen"))
  .on("leave-full-screen", () => events.emit("leave-full-screen"))
  .on("blur", () => events.emit("blur"))
  .on("focus", () => events.emit("focus"))
