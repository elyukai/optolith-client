import { contextBridge, ipcRenderer } from "electron"
import { UpdateInfo } from "electron-updater"
import EventEmitter from "events"
import { TypedEventEmitterForEvent } from "../shared/utils/events.ts"

export type PreloadAPI = {

} & Events

type Events =
  & TypedEventEmitterForEvent<"update-available", [updateInfo: UpdateInfo]>

const events = new EventEmitter() as Events

const api: PreloadAPI = {
  on: events.on.bind(events),
  emit: events.emit.bind(events),
  removeListener: events.removeListener.bind(events),
}

contextBridge.exposeInMainWorld("optolith", api)

ipcRenderer.on("update-available", (_event: Event, updateInfo: UpdateInfo) => {
  events.emit("update-available", updateInfo)
})
