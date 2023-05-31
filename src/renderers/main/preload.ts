import { contextBridge, ipcRenderer } from "electron"
import EventEmitter from "events"
import { ValidResults } from "optolith-database-schema"
import { TypedEventEmitterForEvent } from "../../shared/helpers/events.ts"

export type PreloadAPI = {
  checkForUpdates: () => void
} & Events

type Events =
  & TypedEventEmitterForEvent<"database-available", [database: ValidResults]>

const events = new EventEmitter() as Events

const api: PreloadAPI = {
  on: events.on.bind(events),
  emit: events.emit.bind(events),
  removeListener: events.removeListener.bind(events),
  checkForUpdates: () => {
    ipcRenderer.send("check-for-updates")
  },
}

contextBridge.exposeInMainWorld("optolith", api)

ipcRenderer.on("database-available", (_event: Event, database: ValidResults) => {
  events.emit("database-available", database)
})
